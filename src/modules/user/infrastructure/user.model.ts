import { type Document, model, Schema, type Types } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  province: Types.ObjectId;
  municipality: Types.ObjectId;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    province: { type: Schema.Types.ObjectId, ref: 'Province', required: true },
    municipality: { type: Schema.Types.ObjectId, ref: 'Municipality', required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user', required: true },
  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>('User', userSchema);
