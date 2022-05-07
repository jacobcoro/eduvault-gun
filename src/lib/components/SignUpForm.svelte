<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';

	import { createNewUser } from '$lib/helpers';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let error = '';

	$: email, validateEmail();
	$: password, confirmPassword, validatePassword();
	$: buttonDisabled =
		email.length === 0 || password.length === 0 || confirmPassword.length === 0 || error.length > 0;

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
		} else if (password !== confirmPassword) {
			error = 'Passwords do not match.';
		} else {
			error = '';
		}
	};
	const dispatch = createEventDispatcher();

	const submit = async () => {
		try {
			const submitData = await createNewUser(email, password);

			dispatch('submit', submitData);
		} catch (err) {
			console.error(err);
			if (err instanceof Error) error = err.message;
		}
	};
</script>

<form on:submit|preventDefault={submit} class="form">
	<div class="input-section">
		<Input label="Email" id="email" name="email" type="email" bind:value={email} />
		<Input label="Password" id="password" name="password" type="password" bind:value={password} />
		<Input
			label="Confirm Password"
			id="confirm-password"
			name="confirm-password"
			type="password"
			bind:value={confirmPassword}
		/>
		{#if error.length > 0}
			<p class="error">{error}</p>
		{/if}
	</div>
	<Button disabled={buttonDisabled} type="submit">Sign Up</Button>
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
