<!-- sveltekit modules run serverside before page load -->
<script context="module" lang="ts">
	import GunTodo from './gun-todo.svelte';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (!session?.user) {
			return {
				status: 302,
				redirect: '/sign-in'
			};
		}
		return {
			props: {
				user: session.user
			}
		};
	};
</script>

<script lang="ts">
	// import type { User } from 'src/types';
	// export let user: User;

	// import { session } from '$app/stores';
	// $session.user;
</script>

<GunTodo />
