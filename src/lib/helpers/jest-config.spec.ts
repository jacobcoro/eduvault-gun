test('jest env works', () => {
	expect(process.env.ENV_CHECK).toBe('working');
	expect(process.env.APP_SECRET).toBe('jest-secret');
});

export {};
