import { type Document, model, Schema, type Types } from 'mongoose';

export interface MunicipalityDocument extends Document {
  name: string;
  province: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const municipalitySchema = new Schema<MunicipalityDocument>(
  {
    name: { type: String, required: true, trim: true },
    province: { type: Schema.Types.ObjectId, ref: 'Province', required: true },
  },
  { timestamps: true },
);

municipalitySchema.index({ name: 1, province: 1 }, { unique: true });

export const MunicipalityModel = model<MunicipalityDocument>('Municipality', municipalitySchema);
