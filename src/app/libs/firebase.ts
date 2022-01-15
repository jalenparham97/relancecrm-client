import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { config } from '@/core/config';

export const firebaseApp = initializeApp(config.firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
export const fb = firebase;

export * from 'firebase/auth';
