import mongoose, { Types } from 'mongoose';
import { Project, ProjectStatus } from '@/core/types';
import { getInitials } from '@/app/utils';
import { ProjectDocument } from '@/server/types';
import randomColor from 'randomcolor';

const schema = new mongoose.Schema<ProjectDocument>(
  {
    userId: { type: Types.ObjectId },
    projectName: { type: String, trim: true },
    backgroundColor: { type: String },
    description: { type: String, trim: true },
    status: { type: String, trim: true, default: ProjectStatus.ACTIVE },
    endDate: { type: String },
    client: { type: Types.ObjectId, ref: 'Client' },
  },
  { timestamps: true }
);

schema.pre<Project>('save', function (next) {
  this.backgroundColor = randomColor({ luminosity: 'dark' });
  next();
});

schema.virtual('initials').get(function () {
  return getInitials(this.projectName, 1);
});

schema.set('toJSON', { virtuals: true });

export const projectModel = mongoose.models.Project || mongoose.model('Project', schema);
