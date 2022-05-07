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
				id: session.id,
				user: session.user
			}
		};
	};
</script>

<script lang="ts">
	import UseGun from '$lib/components/UseGun.svelte';
	import type { KeyPair, User } from 'src/types';
	import { session } from '$app/stores';
	import { decrypt } from '$lib/helpers';
	import { onMount } from 'svelte';
	export let user: User;
	export let id: string;

	$session.user;
	$session.id;

	let sessionIDEncryptedKeyPair = '';
	let keyPair: KeyPair | null = null;

	onMount(() => {
		sessionIDEncryptedKeyPair =
			user.sessionIDEncryptedKeyPair ?? localStorage.getItem('sessionIDEncryptedKeyPair') ?? '';

		if (sessionIDEncryptedKeyPair && id) {
			const keyPairDecrypted = decrypt(sessionIDEncryptedKeyPair, id);
			const keyPairParsed = JSON.parse(keyPairDecrypted ?? '') as KeyPair;
			if (keyPairParsed && keyPairParsed.epub === user.pubKey) keyPair = keyPairParsed;
			else console.error('keys do not match');
		}
	});
</script>

{#if keyPair?.epub}
	<UseGun username={keyPair?.epub} password={keyPair?.epriv} let:gunUser>
		<GunTodo {gunUser} />
	</UseGun>
{/if}
