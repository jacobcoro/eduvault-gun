export interface User {
	/** Unique. acts as user id. */
	email: string;
	/** SEA epub */
	pubKey: string;
	/** used to enable offline sign-in, and 3rd party app permission-less sign-in.  */
	pwEncryptedKeyPair: string;
	/** email to user for private key recovery  */
	recoveryKeyEncryptedKeyPair: string;
	/** double hashed (client hashes once, sends to server, server saves a hash of that) */
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

// might not need this, instead use 'sessionIDEncryptedKeyPair
export type AuthToken = JWT<{ appID: string; personID: string }>;
