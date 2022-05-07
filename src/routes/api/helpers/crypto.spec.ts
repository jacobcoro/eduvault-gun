import { hashPassword, validPasswordHash } from './crypto';

const password = 'super-duper-$3CR3T';

describe('password hashing', () => {
	test('create hash', () => {
		const hash = hashPassword(password);
		expect(hash.length).toBeGreaterThan(20);
	});
	test('verify hash', () => {
		const hash = hashPassword(password);
		const valid = validPasswordHash(password, hash);
		expect(valid).toBe(true);

		const invalid = validPasswordHash('doodah', hash);
		expect(invalid).toBe(false);
	});
});
