import dotenv from 'dotenv';

dotenv.config();
const env = process.env;

export const PEER1 = env.PEER1;
export const PEER2 = env.PEER2;

/** expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d" */
export const JWT_EXPIRY = '30d';
export const APP_SECRET = env.APP_SECRET || 'super-secret';
