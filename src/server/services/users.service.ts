import { SubscriptionData, User } from '@/core/types';
import { userModel } from '@/server/models';

class UsersService {
  async create(userData: User): Promise<User> {
    return await userModel.create(userData);
  }

  async findAll() {
    return userModel.find();
  }

  async findOne(id: string): Promise<User> {
    return await userModel.findById(id);
  }

  async update(id: string, updateUserData: User): Promise<User> {
    return await userModel.findByIdAndUpdate(id, updateUserData, { new: true }).exec();
  }

  async updateStripeConnectedPayment(id: string, accountId: string): Promise<User> {
    return await userModel
      .findOneAndUpdate(
        { _id: id },
        { connectedPayments: { stripe: { accountId } } },
        { new: true }
      )
      .exec();
  }

  async updateSubscription(subscription: SubscriptionData): Promise<User> {
    return userModel
      .findOneAndUpdate(
        {
          'subscription.customerId': subscription.customerId,
        },
        {
          'subscription.status': subscription.status,
          'subscription.isInTrial': subscription.isInTrial,
          'subscription.plan': subscription.plan,
        },
        { new: true }
      )
      .exec();
  }

  async remove(id: string) {
    return await userModel.findByIdAndDelete(id);
  }
}

export const usersService = new UsersService();
