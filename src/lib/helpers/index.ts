export * from './createNewUser';
export * from './crypto';

/** Sleep is a wait function */
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
