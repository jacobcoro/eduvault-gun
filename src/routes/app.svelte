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
	import UseGun from '$lib/components/UseGun.svelte';
	import type { User } from 'src/types';
	import { session } from '$app/stores';
	export let user: User;
	$session.user;
</script>

<UseGun username={user.email} password={user.passwordHash} let:gunUser>
	{#if user.email}
		<GunTodo {gunUser} />
	{/if}
</UseGun>
