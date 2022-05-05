export interface User {
	email: string;
	pwEncryptedPrivateKey: string;
	pubKey: string;
	recoveryKeyEncryptedKeyPair: string;
	passwordHash: string;
}

export interface SignInRequest {
	email: User['email'];
	passwordHash: User['passwordHash'];
}

export interface ServerSession {
	id: string;
	user: User;
}

interface JWT<T = unknown> {
	data: T;
	iat: number;
	exp: number;
}

export type LoginToken = JWT<{ appID: string; personID: string }>;

export type AuthToken = JWT<{ appID: string; personID: string }>;
