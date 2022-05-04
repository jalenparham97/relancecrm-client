import { axios } from '@/app/libs/axios';
import {
  firebaseAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleAuthProvider,
  microsoftAuthProvider,
} from '@/app/libs/firebase';
import { queryClient } from '@/app/libs/react-query';
import {
  FirebaseUser,
  User,
  UserLoginData,
  UserSignupData,
} from '@/core/types';

class AuthService {
  async authenticate() {
    const { data: user } = await axios.get<User>('/auth/me');
    return user;
  }

  async signup(signupUserData: UserSignupData) {
    const { email, password, firstName, lastName, plan } = signupUserData;
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const { data: user } = await axios.post<User>('/auth/signup', {
      uid: firebaseUser.uid,
      email,
      firstName,
      lastName,
      plan,
    });
    return user;
  }

  private async authenticateWithGoogle() {
    const { user } = await signInWithPopup(firebaseAuth, googleAuthProvider);
    return user;
  }

  async signInWithGoogle() {
    return await this.authenticateWithGoogle();
  }

  async signUpWithGoogle() {
    const firebaseUser: FirebaseUser = await this.authenticateWithGoogle();
    const { data: user } = await axios.post<User>('/auth/signup', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      firstName: firebaseUser.displayName.split(' ')[0],
      lastName: firebaseUser.displayName.split(' ')[1],
      photoUrl: firebaseUser.photoURL,
    });
    return user;
  }

  async login(loginUserData: UserLoginData) {
    const { email, password } = loginUserData;
    const { user: firebaseUser } = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    let user: User;
    if (firebaseUser) {
      user = await this.authenticate();
    }
    return user;
  }

  async logout() {
    queryClient.clear();
    return await firebaseAuth.signOut();
  }
}

export const authService = new AuthService();
