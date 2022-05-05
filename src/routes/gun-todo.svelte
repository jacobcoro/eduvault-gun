<script lang="ts">
	import type { IGunChain, IGunInstance } from 'gun';

	import { onMount } from 'svelte';
	import { initGun } from '$lib/helpers/initGun';

	let todoGun: IGunChain<any, IGunInstance<any>, IGunInstance<any>, 'todos'>;
	// Create a local store to cache data from GUN
	let store: { [key: string]: { done: boolean; title: string } } = {};
	onMount(() => {
		let gun = initGun();
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

<input placeholder="add todo" on:change={create} />
completed {done}/{todos.length}

{#each todos as [key, todo]}
	<div id={key}>
		<input type="checkbox" checked={todo.done} on:change={() => update(key, !todo.done)} />
		{todo.title} <a href="/" on:click|preventDefault={() => remove(key)}>remove</a>
		{todo.done ? '😺' : '😾'}
	</div>
{/each}
