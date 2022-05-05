import { createSession, getUserByEmail } from './_db';
import { serialize } from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';
import { validPasswordHash } from '$lib/helpers/crypto';
import type { SignInRequest } from 'src/types';

export const post: RequestHandler = async ({ request }) => {
	try {
		const { email, passwordHash }: SignInRequest = await request.json();
		const user = await getUserByEmail(email);
		if (!user || !validPasswordHash(passwordHash, user.passwordHash)) {
			return {
				status: 401,
				body: {
					message: 'Incorrect user or password'
				}
			};
		}

		const { id } = createSession(email);

		return {
			status: 200,
			headers: {
				'Set-Cookie': serialize('session_id', id, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 7 // one week
				})
			},
			body: {
				user: { ...user }
			}
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			body: {
				message: 'Internal service error: ' + error
			}
		};
	}
};
