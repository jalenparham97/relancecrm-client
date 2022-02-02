import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { userState, useRecoilState, useRecoilValue, useSetRecoilState } from '@/app/store/store';
import { authService } from '@/app/services/auth.service';
import { firebaseAuth } from '@/app/libs/firebase';
import { User, FirebaseUser, UserSignupData, UserLoginData } from '@/core/types';
import { isEmpty } from 'lodash';
import { getFullName, getInitials } from '@/app/utils';
import dayjs from 'dayjs';

export const useAuth = () => {
  const { pathname, push: navigate } = useRouter();
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        if (isEmpty(user)) {
          const currentUser = await authService.authenticate();
          setUser({
            fullName: getFullName(currentUser),
            initials: getInitials(getFullName(currentUser)),
            ...currentUser,
          });
          // if (dayjs().isAfter(currentUser?.subscription?.trialEndDate)) {
          //   navigate('/subscribe');
          // }
          if (pathname.includes('/auth/login') || pathname.includes('/auth/signup')) {
            navigate('/');
          }
        }
      } else {
        if (!(pathname.includes('/auth/login') || pathname.includes('/auth/signup'))) {
          navigate('/auth/login');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate, pathname, setUser, user]);
};

export const useSignUp = (isMounted?: boolean) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (signupData: UserSignupData) => {
    try {
      setIsLoading(true);
      const user = await authService.signup(signupData);
      if (user) {
        router.push('/');
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setError(error);
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};

export const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => {
    setError(null);
  };

  const login = async (loginData: UserLoginData) => {
    try {
      setIsLoading(true);
      const user = await authService.login(loginData);
      if (user) {
        router.push('/');
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setError(error);
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, clearError };
};

export const useGoogleAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [signInError, setSignInError] = useState(null);
  const [signUpError, setSignUpError] = useState(null);

  const loginWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      setSignInError(error);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      const user = await authService.signUpWithGoogle();
      if (user) {
        router.push('/');
      }
    } catch (error) {
      setSignUpError(error);
    }
  };

  const clearError = () => {
    setSignInError(null);
    setSignUpError(null);
  };

  return { loginWithGoogle, signUpWithGoogle, signInError, signUpError, clearError };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setUser = useSetRecoilState(userState);

  const logout = async () => {
    await authService.logout();
    queryClient.clear();
    setUser({});
  };

  return logout;
};

export const useUser = (): User => {
  const user = useRecoilValue<User>(userState);
  return user;
};

export const useFirebaseUser = () => {
  const firebaseUser: FirebaseUser = firebaseAuth.currentUser;
  return firebaseUser;
};
