import jwt from 'jsonwebtoken';
import type { AuthToken, LoginToken } from 'src/types';
import { APP_SECRET, JWT_EXPIRY } from '../config';

export const createJwtWithData = (data: unknown, expiry?: jwt.SignOptions['expiresIn']) => {
	const newJwt = jwt.sign({ data }, APP_SECRET, {
		expiresIn: expiry ?? JWT_EXPIRY
	});
	// console.log({ newJwt });
	return newJwt;
};

/** Login token valid for 3 minutes */
export const createLoginToken = (data: LoginToken['data']) => createJwtWithData(data, '3m');

export const createAuthJwt = (data: AuthToken['data']) => createJwtWithData(data, '2w');

export const getJwtExpiry = (token: string) => {
	const decoded = jwt.verify(token, APP_SECRET);
	if (typeof decoded === 'string' || !decoded.exp)
		throw new Error('error decoding jwt: ' + JSON.stringify(decoded) + ' token ' + token);
	// console.log({ decoded });
	return new Date(decoded.exp * 1000);
};

export const validateAndDecodeJwt = async <T>(token: string) => {
	const decoded = jwt.verify(token, APP_SECRET) as T;
	const expiry = getJwtExpiry(token);
	const now = new Date();
	const valid = now < expiry;
	if (valid) {
		return decoded;
	} else {
		throw new Error('invalid. now: ' + now + 'expiry: ' + expiry);
	}
};
