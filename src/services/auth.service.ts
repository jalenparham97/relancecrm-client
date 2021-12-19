import { axios } from '@/libs/axios';
import {
  firebaseAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@/libs/firebase';
import { queryClient } from '@/libs/react-query';
import { User, UserLoginData, UserSignupData } from '@/types';

class AuthService {
  async authenticate() {
    const { data: user } = await axios.get<User>('/auth/authenticate');
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

  async login(loginUserData: UserLoginData) {
    const { email, password } = loginUserData;
    const { user: firebaseUser } = await signInWithEmailAndPassword(firebaseAuth, email, password);
    let user: User;
    if (firebaseUser) {
      console.log({ firebaseUser });
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
