import { v4 as uuid } from 'uuid';
import type { User } from 'src/types';
import { decrypt, encrypt, hash } from '$lib/helpers/crypto';
import SEA from 'gun/sea';

export const createNewUser = async (email: string, password: string) => {
	const keyPair = await SEA.pair();
	const keyPairString = JSON.stringify(keyPair);

	// test that we can get key back from string;
	const keyPairRehydrated = JSON.parse(keyPairString);
	if (keyPairRehydrated.epriv !== keyPair.epriv)
		throw new Error('Could not stringify and parse private key');

	const pwEncryptedPrivateKey = encrypt(keyPairString, password);
	if (!pwEncryptedPrivateKey) throw new Error('Could not encrypt private key with password');

	// test we can decrypt keyPair
	const decrypted = decrypt(pwEncryptedPrivateKey, password);
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
		pwEncryptedPrivateKey,
		pubKey: keyPair.epub,
		recoveryKeyEncryptedKeyPair
		// TODO: for 3rd party login
		// redirectURL: redirectURL ?? 'http//:localhost',
		// appID,
	};

	return signupData;
};
