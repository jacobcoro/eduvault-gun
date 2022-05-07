export * from './crypto';
export * from './initGun';
export * from './jwt';

/** Sleep is a wait function */
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
