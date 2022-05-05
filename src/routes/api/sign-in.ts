import { createSession, getUserByEmail } from './_db';
import { serialize } from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';
import { validPasswordHash } from '$lib/helpers/crypto';
import type { SignInRequest } from 'src/types';
import { PEER1 } from './config';

export const post: RequestHandler = async ({ request }) => {
	console.log({ PEER1 });
	const { email, passwordHash }: SignInRequest = await request.json();
	const userRecord = await getUserByEmail(email);
	if (!userRecord || !validPasswordHash(passwordHash, userRecord.passwordHash)) {
		return {
			status: 401,
			body: {
				message: 'Incorrect user or password'
			}
		};
	}

	const { id } = await createSession(email);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { passwordHash: doNotReturnPassword, ...clientUser } = userRecord;
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
			user: { ...clientUser }
		}
	};
};
