import bcrypt from 'bcryptjs';

export const hashPassword = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validPasswordHash = (providedPassword: string, storedPasswordHash: string) => {
	try {
		return bcrypt.compareSync(providedPassword, storedPasswordHash);
	} catch (error) {
		return false;
	}
};

export const doubleHashUser = (user: User) => {
	if (!user.passwordHash) throw new Error('must be called with password hash');
	const doubleHashedPassword = hashPassword(user.passwordHash);
	return { ...user, passwordHash: doubleHashedPassword };
};
