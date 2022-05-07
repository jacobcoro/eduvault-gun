import { createSession, getUserByEmail, registerUser } from './_db';
import { serialize } from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';
import type { User } from 'src/types';

export const post: RequestHandler = async ({ request }) => {
	try {
		const userSignup: User = await request.json();
		const { email, passwordHash, pubKey, pwEncryptedKeyPair, recoveryKeyEncryptedKeyPair } =
			userSignup;
		if (!email || !passwordHash || !pubKey || !pwEncryptedKeyPair || !recoveryKeyEncryptedKeyPair)
			return {
				status: 409,
				body: {
					message: 'Incomplete signup form'
				}
			};

		const existingUser = await getUserByEmail(email);
		console.log({ existingUser });
		if (existingUser) {
			return {
				status: 409,
				body: {
					message: 'User already exists'
				}
			};
		} else {
			await registerUser(userSignup);

			const { id } = await createSession(email);
			return {
				status: 201,
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
					id,
					user: {
						email,
						pubKey,
						pwEncryptedKeyPair
					}
				}
			};
		}
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
