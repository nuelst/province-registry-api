import { type Document, model, Schema } from 'mongoose';

export interface ProvinceDocument extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const provinceSchema = new Schema<ProvinceDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

export const ProvinceModel = model<ProvinceDocument>('Province', provinceSchema);
