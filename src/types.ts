export interface User {
	email: string;
	pwEncryptedPrivateKey: string;
	pubKey: string;
	recoveryKeyEncryptedKeyPair: string;
}

export interface ServerUser extends User {
	passwordHash: string;
}

export interface SignInRequest {
	email: User['email'];
	passwordHash: ServerUser['passwordHash'];
}

export interface ServerSession {
	id: string;
	email: User['email'];
}
