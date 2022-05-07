<script lang="ts">
	import SignInForm from '$lib/components/SignInForm.svelte';
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import type { SignInRequest, SignInRequestLocal } from 'src/types';
	import { handleSignupSignInSuccess, hash } from '$lib/helpers';

	let error = '';

	async function handleSubmit({ detail: { email, password } }: { detail: SignInRequestLocal }) {
		const SignInRequest: SignInRequest = {
			email,
			passwordHash: hash(password)
		};
		const request = new Request('/api/sign-in', {
			method: 'POST',
			body: JSON.stringify(SignInRequest),
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

<h1 class="title">Sign In</h1>
{#if error}
	<p class="error">{error}</p>
{/if}
<SignInForm on:submit={handleSubmit} />

<style lang="scss">
	.error {
		color: red;
	}
	.title {
		text-align: center;
	}
</style>
