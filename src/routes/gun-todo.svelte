<script lang="ts">
	import type { IGunChain, IGunInstance } from 'gun';
	import Gun from 'gun/gun';
	import SEA from 'gun/sea';
	// import then from 'gun/lib/then';
	// initgun broken
	import { initGun, sleep } from '$lib/helpers';

	export const usersKey = 'users';
	export const sessionsKey = 'sessions';

	/** use community in frontend and private peers in backend */
	export const communityPeers = [
		// Community relay peers:
		// https://github.com/amark/gun/wiki/volunteer.dht
		'https://gun-manhattan.herokuapp.com/gun',
		'https://gunmeetingserver.herokuapp.com/gun',
		'https://gun-us.herokuapp.com/gun'
	];

	export const initGun1 = async (
		userName: string,
		password: string,
		peers: string[] = communityPeers
	) => {
		console.time('total init time');
		// Gun.SEA = SEA;

		const gunPublic = Gun(peers);
		const gunUser = gunPublic.user();

		let authenticated = false;
		let times = 0;
		gunUser.auth(userName, password, (ack) => {
			if ('err' in ack) throw new Error('auth failed');
			authenticated = true;
		});
		while (!authenticated && times < 100) {
			await sleep(30);
			times++;
		}
		if (!authenticated) throw new Error('authentication failed or timed out');
		console.log('waited for auth', times * 30, 'ms');
		return { gunPublic, gunUser };
	};
	import { onMount } from 'svelte';

	let todoGun: IGunChain<any, IGunInstance<any>, IGunInstance<any>, 'todos'>;
	// Create a local store to cache data from GUN
	let store: { [key: string]: { done: boolean; title: string } } = {};
	onMount(() => {
		const initialize = async () => {
			let { gunUser: gun } = await initGun1('username' + Math.random(), 'password');
			todoGun = gun.get('todos');
			// Creates a listener that iterates over keys found in the "todo" node in GUN
			todoGun.map().on(function (todo, key) {
				if (todo) {
					// Updates the store with the new value
					store[key] = todo;
				} else {
					// A key may contain a null value (if data has been deleted/set to null)
					// if so, we remove the item from the store
					delete store[key];
					store = store;
				}
			});
		};
		Gun.SEA = SEA;
		initialize();
	});

	// The below lines listens for updates in the store and creates
	// more convenient variables for use in markup
	$: todos = Object.entries(store);
	$: done = todos.filter(([key, todo]) => todo.done).length;

	// Actions that write data to GUN
	const create = (e: any) =>
		todoGun.get(e.target.value).put({ title: e.target.value, done: false });
	const update = (key: string, value: boolean) => todoGun.get(key).get('done').put(value);
	const remove = (key: string) => todoGun.get(key).put(null);
</script>

{#if todoGun}
	<input placeholder="add todo" on:change={create} />
	completed {done}/{todos.length}

	{#each todos as [key, todo]}
		<div id={key}>
			<input type="checkbox" checked={todo.done} on:change={() => update(key, !todo.done)} />
			{todo.title} <a href="/" on:click|preventDefault={() => remove(key)}>remove</a>
			{todo.done ? '😺' : '😾'}
		</div>
	{/each}
{:else}
	<h2>loading...</h2>
{/if}
