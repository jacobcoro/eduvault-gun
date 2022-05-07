import { v4 as uuid } from 'uuid';
import type { KeyPair, User } from 'src/types';
import { decrypt, encrypt, hash } from './crypto';
import { default as SEA } from 'gun/sea.js';

/** Only hashes the password once */
export const createNewUser = async (email: string, password: string) => {
	const keyPair = await SEA.pair();
	const keyPairString = JSON.stringify(keyPair);

	// test that we can get key back from string;
	const keyPairRehydrated = JSON.parse(keyPairString);
	if (keyPairRehydrated.epriv !== keyPair.epriv)
		throw new Error('Could not stringify and parse private key');

	const pwEncryptedKeyPair = encrypt(keyPairString, password);
	if (!pwEncryptedKeyPair) throw new Error('Could not encrypt private key with password');

	// test we can decrypt keyPair
	const decrypted = decrypt(pwEncryptedKeyPair, password);
	if (!decrypted) throw new Error('could not decrypt private key from password');
	const rehydrated = JSON.parse(decrypted);
	if (rehydrated.epriv !== keyPair.epriv)
		throw new Error('Could not stringify and parse private key');

	const recoveryKey = uuid();

	const recoveryKeyEncryptedKeyPair = encrypt(keyPairString, recoveryKey);

	// TODO: prompt user to email themselves the recovery key.

	const signupData: User = {
		email,
		passwordHash: hash(password),
		pwEncryptedKeyPair,
		pubKey: keyPair.epub,
		recoveryKeyEncryptedKeyPair
		// TODO: for 3rd party login
		// redirectURL: redirectURL ?? 'http//:localhost',
		// appID,
	};

	return signupData;
};

export const handleSignupSignInSuccess = (body: { id: string; user: User }, password: string) => {
	const user = body.user;
	const keyPairDecrypted = decrypt(user.pwEncryptedKeyPair, password);
	const keyPairParsed = JSON.parse(keyPairDecrypted ?? '') as KeyPair;
	let sessionIDEncryptedKeyPair = '';
	if (keyPairParsed && keyPairParsed.epub === user.pubKey) {
		sessionIDEncryptedKeyPair = encrypt(keyPairDecrypted, body.id);
		localStorage.setItem('sessionIDEncryptedKeyPair', sessionIDEncryptedKeyPair);
	} else console.error('keys do not match');

	return sessionIDEncryptedKeyPair;
};
