<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';

	import type { SignInRequestLocal } from '../../types';

	let email = '';
	let password = '';
	let error = '';

	$: email, validateEmail();
	$: password, validatePassword();
	$: buttonDisabled = email.length === 0 || password.length === 0 || error.length > 0;

	const validateEmail = () => {
		email = email.trim();
		if (email === '') return;
		if (email.length <= 5 || email.length >= 64) {
			error = 'Email must be 5-64 characters long';
		} else if (!email.includes('@') || !email.includes('.')) {
			error = 'Invalid email';
		} else if (email.includes(' ')) {
			error = 'Email must not include spaces';
		} else {
			error = '';
		}
	};
	const validatePassword = () => {
		if (password === '') return;

		if (password.length < 8 || password.length >= 64) {
			error = 'Password must be 8-64 characters long';
		} else {
			error = '';
		}
	};
	const dispatch = createEventDispatcher();

	function submit() {
		const SignInRequest: SignInRequestLocal = {
			email,
			password
		};
		dispatch('submit', SignInRequest);
	}
</script>

<form on:submit|preventDefault={submit} class="form">
	<div class="input-section">
		<Input label="Email" id="email" name="email" type="email" bind:value={email} required />
		<Input
			label="Password"
			id="password"
			name="password"
			type="password"
			bind:value={password}
			required
		/>
		{#if error.length > 0}
			<p class="error">{error}</p>
		{/if}
	</div>
	<Button disabled={buttonDisabled} type="submit">Sign In</Button>
</form>

<style lang="scss">
	.error {
		color: red;
	}
	.form {
		@include style.login-form;
	}
	.input-section {
		margin-bottom: style.$spacing * 5;
	}
</style>
