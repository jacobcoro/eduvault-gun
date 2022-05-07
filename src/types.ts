export interface User {
	/** Unique. acts as user id. */
	email: string;
	/** SEA epub */
	pubKey: string;
	/** used to enable offline sign-in, and 3rd party app permission-less sign-in. Gets set in localStorage. If app detects use is offline, and has this in localStorage, app can prompt user to unlock offline mode by entering password. */
	pwEncryptedKeyPair: string;
	/** email to user for private key recovery. Saved on backend database  */
	recoveryKeyEncryptedKeyPair?: string;
	/** double hashed (client hashes once, sends to server, server saves a hash of that) */
	passwordHash?: string;
	/** used to enable continuous login state with cookies. This also gets saved in localStorage. App checks for this and tries to decrypt from session ID. If succesfull user is already logged in.  */
	sessionIDEncryptedKeyPair?: string;
}

export interface SignInRequestLocal {
	email: string;
	/** plain text password, only use between the sign-in form and parent*/
	password: string;
}

export interface SignInRequest {
	email: string;
	/** client side single hashed. */
	passwordHash: string;
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

export interface KeyPair {
	pub: string;
	priv: string;
	epub: string;
	epriv: string;
}
