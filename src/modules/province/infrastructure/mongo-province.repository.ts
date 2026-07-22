import type { CreateProvinceProps, Province, UpdateProvinceProps } from '../domain/province.entity';
import type { ProvinceRepository } from '../domain/province.repository';
import { type ProvinceDocument, ProvinceModel } from './province.model';

function toEntity(doc: ProvinceDocument): Province {
  return {
    id: doc.id as string,
    name: doc.name,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoProvinceRepository implements ProvinceRepository {
  async create(data: CreateProvinceProps): Promise<Province> {
    const doc = await ProvinceModel.create(data);
    return toEntity(doc);
  }

  async findAll(): Promise<Province[]> {
    const docs = await ProvinceModel.find().sort({ name: 1 });
    return docs.map(toEntity);
  }

  async findById(id: string): Promise<Province | null> {
    const doc = await ProvinceModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findByName(name: string): Promise<Province | null> {
    const doc = await ProvinceModel.findOne({ name: new RegExp(`^${name}$`, 'i') });
    return doc ? toEntity(doc) : null;
  }

  async update(id: string, data: UpdateProvinceProps): Promise<Province | null> {
    const doc = await ProvinceModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return doc ? toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProvinceModel.findByIdAndDelete(id);
    return !!result;
  }
}
