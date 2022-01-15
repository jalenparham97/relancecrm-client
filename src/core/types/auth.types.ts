import {
  GoogleAuthProvider as GoogleProvider,
  GithubAuthProvider as GithubProvider,
} from '@firebase/auth';

export type GoogleAuthProvider = GoogleProvider;
export type GithubAuthProvider = GithubProvider;

export type UserPasswordResetData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
