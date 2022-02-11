import { Integration } from '.';
import { SubscriptionData, SubscriptionPlan } from './payment.types';
import { User as FirebaseUserObject } from '@firebase/auth';

export type FirebaseUser = FirebaseUserObject;

export type User = {
  _id?: string;
  uid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  fullName?: string;
  initials?: string;
  photoUrl?: string;
  integrations?: { [key: string]: Integration };
  businessInfo?: UserBusinessInfo;
  subscription?: SubscriptionData;
  connectedPayments?: UserConnectedPayments;
};

export type UserLoginData = {
  email: string;
  password?: string;
};

export type UserSignupData = {
  uid?: string;
  firstName: string;
  lastName: string;
  plan?: SubscriptionPlan;
} & UserLoginData;

export type UserBusinessInfo = {
  businessName?: string;
  website?: string;
  address?: string;
  branding?: {
    logoUrl?: string;
    bgColor?: string;
    textColor?: string;
  };
};

export type UserConnectedPayments = {
  stripe?: {
    accountId?: string;
    isEnabled?: boolean;
  };
  zelle?: {
    accountId?: string;
    isEnabled?: boolean;
  };
};
