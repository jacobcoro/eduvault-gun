<script lang="ts">
	import { onMount } from 'svelte';

	import type { IGunInstance, IGunInstanceRoot, IGunUserInstance } from 'gun';
	import Gun from 'gun/gun';
	import { default as SEA } from 'gun/sea';
	import 'gun/lib/then';

	import { sleep } from '$lib/helpers';

	export let username: string = '';
	export let password: string = '';

	/** use community in frontend and private peers in backend */
	const communityPeers = [
		// Community relay peers:
		// https://github.com/amark/gun/wiki/volunteer.dht
		'https://gun-manhattan.herokuapp.com/gun',
		'https://gunmeetingserver.herokuapp.com/gun',
		'https://gun-us.herokuapp.com/gun'
	];
	let gunPublic: IGunInstance<any>;
	let gunUser: IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>;

	const initGun = async (username: string, password: string, peers: string[] = communityPeers) => {
		Gun.SEA = SEA;

		gunPublic = Gun(peers);
		const user = gunPublic.user();
		let authenticated = false;
		let times = 0;

		const signup = () => {
			console.log('signing up');
			user.create(username, password, (ack) => {
				if ('err' in ack) throw new Error('signup failed');
				auth(1);
			});
		};
		const auth = (attempt: number) => {
			console.log('authenticating');

			user.auth(username, password, (ack) => {
				if ('err' in ack) {
					if (attempt === 0) {
						signup();
					} else throw new Error('auth failed');
				} else authenticated = true;
			});
		};

		auth(0);

		while (!authenticated && times < 500) {
			await sleep(30);
			times++;
		}
		if (!authenticated) throw new Error('authentication failed or timed out');
		console.log('waited for auth', times * 30, 'ms');
		gunUser = user;
	};

	onMount(() => {
		initGun(username, password);
	});
</script>

<slot {gunPublic} {gunUser} />
