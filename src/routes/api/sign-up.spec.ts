import { dummyUserEmail } from './helpers';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import { post } from './sign-up';

describe('sign-up', () => {
	test('Incomplete signup form', async () => {
		const newUser: User = {
			email: dummyUserEmail,
			passwordHash: '123412',
			pubKey: '123',
			pwEncryptedKeyPair: '',
			recoveryKeyEncryptedKeyPair: ''
		};
		const request = new Request('/api/sign-up', {
			method: 'POST',
			body: JSON.stringify(newUser),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const requestEvent: RequestEvent = {
			clientAddress: '',
			locals: {} as any,
			params: {} as any,
			platform: {} as any,
			request: request,
			routeId: null,
			url: new URL('http://localhost:3000/api/sign-in')
		};
		const response = await post(requestEvent);
		const body: any = response.body;
		expect(response.status).toBe(409);
		expect(body.message).toBe('Incomplete signup form');
	});

	test('pre-existent user', async () => {
		const newUser: User = {
			email: dummyUserEmail,
			passwordHash: '123412',
			pubKey: '123',
			pwEncryptedKeyPair: '123',
			recoveryKeyEncryptedKeyPair: '123'
		};
		const request = new Request('/api/sign-up', {
			method: 'POST',
			body: JSON.stringify(newUser),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const requestEvent: RequestEvent = {
			clientAddress: '',
			locals: {} as any,
			params: {} as any,
			platform: {} as any,
			request: request,
			routeId: null,
			url: new URL('http://localhost:3000/api/sign-in')
		};
		const response = await post(requestEvent);
		const body: any = response.body;
		expect(response.status).toBe(409);
		expect(body.message).toBe('User already exists');
	});

	test('success', async () => {
		const newUser: User = {
			email: 'third@email.com',
			passwordHash: '123',
			pubKey: 'test-pubkey',
			pwEncryptedKeyPair: '123',
			recoveryKeyEncryptedKeyPair: '123'
		};
		const request = new Request('/api/sign-in', {
			method: 'POST',
			body: JSON.stringify(newUser),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const requestEvent: RequestEvent = {
			clientAddress: '',
			locals: {} as any,
			params: {} as any,
			platform: {} as any,
			request: request,
			routeId: null,
			url: new URL('http://localhost:3000/api/sign-in')
		};
		const response = await post(requestEvent);
		const body: any = response.body;
		expect(response.status).toBe(201);
		expect(body.user.email).toBe('third@email.com');
		expect(body.user.pubKey).toBe('test-pubkey');
	});
});
