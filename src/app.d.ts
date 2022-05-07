/// <reference types="@sveltejs/kit" />

type User = import('./types').User;

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		id: string;
		user: User | null;
	}

	// interface Platform {}

	interface Session {
		id?: string;
		user?: User;
	}

	// interface Stuff {}
}
