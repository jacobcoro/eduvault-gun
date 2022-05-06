test('jest env works', () => {
	expect(process.env.APP_SECRET).toBe('jest-secret');
});

export {};
