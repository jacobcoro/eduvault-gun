import dotenv from 'dotenv';

dotenv.config();
const env = process.env;

export const PEER1 = env.PEER1 ?? 'http://localhost:4635';
export const PEER2 = env.PEER2 ?? 'http://localhost:4635';

/** expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d" */
export const JWT_EXPIRY = '30d';
export const APP_SECRET = env.APP_SECRET || 'super-secret';
export const APP_KEY_PAIR = env.APP_KEY_PAIR || '';
if (!APP_KEY_PAIR)
	throw new Error('app started without keys. please run `npm run generate-api-keys`');
export const DB_NAME = env.DB_NAME || 'eduvault-backend';
