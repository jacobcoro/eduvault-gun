import { hashPassword } from '$lib/helpers/crypto';
import type { ServerSession, User } from 'src/types';
import { v4 as uuidv4 } from 'uuid';

const users: User[] = [];
let sessions: ServerSession[] = [];

export const getUserByEmail = (email: string) => {
	const existingUser = users.find((user) => user.email === email);
	if (!existingUser) return null;
	return existingUser;
};

export const registerUser = (user: User) => {
	const existingUser = users.find((u) => u.email === user.email);
	if (existingUser) throw new Error('User already exists');
	// Yes I know we have ssl etc. But this double hashing means the original password never even leaves the frontend.
	const doubleHashedPassword = hashPassword(user.passwordHash);
	users.push({ ...user, passwordHash: doubleHashedPassword });
	return user;
};

export const createSession = (email: string) => {
	const user = getUserByEmail(email);
	if (!user) throw new Error('user not found by email');
	const session: ServerSession = {
		id: uuidv4(),
		user
	};
	sessions.push(session);
	return session;
};

export const getSession = (id: string) => {
	const session = sessions.find((session) => session.id === id);
	if (!session) null;
	return session;
};

export const removeSession = (id: string) => {
	const session = sessions.find((session) => session.id === id);
	if (!session) throw new Error('Session not found');
	sessions = sessions.filter((session) => session.id !== id);
	return session;
};
