import { dummyUserEmail } from '../../lib/helpers/initGun';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import 'gun/sea';
import { post } from './sign-in';

describe('sign-in', () => {
	test('non-existent user', async () => {
		const request = new Request('/api/sign-in', {
			method: 'POST',
			body: JSON.stringify({ email: '12341234', passwordHash: '1234123' }),
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
		expect(response.status).toBe(401);
		expect(body.message).toBe('Incorrect user name');
	});
	test('incorrect password', async () => {
		const request = new Request('/api/sign-in', {
			method: 'POST',
			body: JSON.stringify({ email: dummyUserEmail, passwordHash: '123412' }),
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
		expect(response.status).toBe(401);
		expect(body.message).toBe('Incorrect password');
	});
});
