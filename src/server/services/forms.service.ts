import mongoose from 'mongoose';
import {
  mailer,
  EmailParams,
  Recipient,
} from '@/server/libs/email/email-manager';
import { formsModel, responsesModel } from '@/server/models';
import {
  Client,
  Form,
  FormResponse,
  Project,
  ServiceResponse,
  Task,
  User,
} from '@/core/types';

class FormsService {
  async create(createData: Form, userId: string): Promise<Form> {
    return await formsModel.create({ ...createData, userId });
  }

  async findAll(userId: string): Promise<ServiceResponse<Form>> {
    const query = { userId };

    const data = await formsModel
      .find(query)
      .sort({ _id: -1 })
      .select(
        '_id name responsesCount status createdAt updatedAt settings.maxResponses settings.limitResponses'
      )
      .exec();

    const total = await formsModel.count(query);

    return { total, data };
  }

  async findOne(id: string, userId: string): Promise<Form> {
    const query = { _id: id, userId };

    const data = await formsModel.findOne(query).exec();

    return data;
  }

  async update(id: string, userId: string, updateData: Form): Promise<Client> {
    return await formsModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();
  }

  async removeMany(ids: string[]) {
    return await formsModel.deleteMany({ _id: { $in: ids } });
  }

  async remove(id: string, userId: string) {
    return await formsModel.findOneAndRemove({ _id: id, userId });
  }

  async createResponse(
    createData: FormResponse,
    user: User
  ): Promise<FormResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();

    const responses = await responsesModel.create([createData], { session });
    const responsesCount = await responsesModel.countDocuments(
      {
        formId: createData.formId,
      },
      { session }
    );
    const form: Form = await formsModel.findByIdAndUpdate(
      createData.formId,
      {
        responsesCount,
      },
      { new: true, session }
    );
    await session.commitTransaction();

    session.endSession();

    if (form?.settings?.sendEmailNotification) {
      await this.sendNotificatioEmail(createData, user);
    }
    return responses[0] as FormResponse;
  }

  async sendNotificatioEmail(response: FormResponse, user: User) {
    try {
      const email = this.createNotificationEmail(response, user);
      return await mailer.send(email);
    } catch (error) {
      console.log(error);
    }
  }

  private createNotificationEmail(response: FormResponse, user: User) {
    const recipients = [new Recipient(user?.email, user?.fullName)];

    const html = `
      <div>
        ${response?.content
          .map(
            (content) =>
              `
            <div style="margin-bottom: 10px;">
              <h4 style="margin: 0px;">${content.element.label}</h4>
              <p style="margin: 0px;">${content.value}</p>
            </div>
            `
          )
          .join('')}
      </div>
    `;

    const email = new EmailParams()
      .setFrom('no-reply@relancecrm.com')
      .setRecipients(recipients)
      .setSubject(`New response for your form`)
      .setHtml(html);

    return email;
  }

  async findAllResponses(
    formId: string
  ): Promise<ServiceResponse<FormResponse>> {
    const query = { formId };

    const data = await responsesModel.find(query).sort({ _id: -1 }).exec();

    const total = await responsesModel.count(query);

    return { total, data };
  }

  async removeManyResponses(ids: string[]) {
    return await responsesModel.deleteMany({ _id: { $in: ids } });
  }

  async removeResponse(id: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    const response: FormResponse = await responsesModel
      .findById(id)
      .session(session);

    await responsesModel.findByIdAndRemove(id).session(session);

    const form: Form = await formsModel
      .findById(response?.formId)
      .session(session);

    await formsModel
      .findByIdAndUpdate(response.formId, {
        responsesCount: form.responsesCount - 1,
      })
      .session(session);

    await session.commitTransaction();

    session.endSession();
    return { ok: 'ok' };
  }
}

export const formsService = new FormsService();
