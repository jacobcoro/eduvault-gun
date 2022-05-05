<script lang="ts">
	import SignInForm from '$lib/components/SignInForm.svelte';
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import type { SignInRequest } from 'src/types';

	let error = '';

	async function handleSubmit({ detail: { email, passwordHash } }: { detail: SignInRequest }) {
		const response = await fetch('/api/sign-in', {
			method: 'POST',
			body: JSON.stringify({ email, passwordHash }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const body = await response.json();
		if (response.ok) {
			// session from getSession hook will otherwise not be set before navigation
			// that would trigger redirect from /app back to /sign-in
			$session = body;
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
