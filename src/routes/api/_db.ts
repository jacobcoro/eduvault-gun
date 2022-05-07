import { doubleHashUser } from './helpers';
import type { ServerSession, User } from 'src/types';
import { ulid } from 'ulid';

const users: User[] = [];
let sessions: ServerSession[] = [];

export const getUserByEmail = (email: string) => {
	const existingUser = users.find((user) => user.email === email);
	if (!existingUser) return null;
	return existingUser;
};

export const registerUser = (user: User) => {
	const existingUser = users.find((u) => u.email === user.email);
	if (!user.passwordHash) throw new Error('Password required');
	if (existingUser) throw new Error('User already exists');

	users.push(doubleHashUser(user));
	return user;
};

export const createSession = (email: string) => {
	const user = getUserByEmail(email);
	if (!user) throw new Error('user not found by email');
	const session: ServerSession = {
		id: ulid(),
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
