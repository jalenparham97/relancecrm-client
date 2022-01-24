import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { config } from '@/core/config';

export const firebaseApp = initializeApp(config.firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const fb = firebase;

export const googleAuthProvider = new GoogleAuthProvider();
export const microsoftAuthProvider = new OAuthProvider('microsoft.com');

export enum AuthProviders {
  GOOGLE = 'google.com',
  MICROSOFT = 'microsoft.com',
}

export * from 'firebase/auth';
