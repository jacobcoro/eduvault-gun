export * from './createNewUser';
export * from './crypto';
export * from './initGunBrowser';

/** Sleep is a wait function */
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
