<script lang="ts">
	import { goto } from '$app/navigation';
	import SignUpForm from '$lib/components/SignUpForm.svelte';
	import { session } from '$app/stores';
	import type { SignInRequestLocal } from 'src/types';
	import { createNewUser, handleSignupSignInSuccess } from '$lib/helpers';

	let error = '';

	async function handleSubmit({ detail: { email, password } }: { detail: SignInRequestLocal }) {
		const newUser = await createNewUser(email, password);

		const request = new Request('/api/sign-up', {
			method: 'POST',
			body: JSON.stringify(newUser),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const response = await fetch(request);

		const body = await response.json();
		if (response.ok) {
			const sessionIDEncryptedKeyPair = handleSignupSignInSuccess(body, password);

			// session from getSession hook will otherwise not be set before navigation
			// that would trigger redirect from /app back to /sign-in
			$session = { id: body.id, user: { ...body.user, sessionIDEncryptedKeyPair } };
			await goto('/app');
		}
		error = body.message;
	}
</script>

<h1 class="title">Sign Up</h1>
{#if error}
	<p>{error}</p>
{/if}
<SignUpForm on:submit={handleSubmit} />

<style lang="scss">
	.title {
		text-align: center;
	}
</style>
