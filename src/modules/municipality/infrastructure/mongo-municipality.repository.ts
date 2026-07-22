import type {
  CreateMunicipalityProps,
  Municipality,
  UpdateMunicipalityProps,
} from '../domain/municipality.entity';
import type { MunicipalityRepository } from '../domain/municipality.repository';
import { type MunicipalityDocument, MunicipalityModel } from './municipality.model';

function toEntity(doc: MunicipalityDocument): Municipality {
  return {
    id: doc.id as string,
    name: doc.name,
    province: doc.province.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoMunicipalityRepository implements MunicipalityRepository {
  async create(data: CreateMunicipalityProps): Promise<Municipality> {
    const doc = await MunicipalityModel.create(data);
    return toEntity(doc);
  }

  async findAll(province?: string): Promise<Municipality[]> {
    const filter = province ? { province } : {};
    const docs = await MunicipalityModel.find(filter).sort({ name: 1 });
    return docs.map(toEntity);
  }

  async findById(id: string): Promise<Municipality | null> {
    const doc = await MunicipalityModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findByNameInProvince(name: string, province: string): Promise<Municipality | null> {
    const doc = await MunicipalityModel.findOne({
      name: new RegExp(`^${name}$`, 'i'),
      province,
    });
    return doc ? toEntity(doc) : null;
  }

  async update(id: string, data: UpdateMunicipalityProps): Promise<Municipality | null> {
    const doc = await MunicipalityModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return doc ? toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await MunicipalityModel.findByIdAndDelete(id);
    return !!result;
  }

  async existsByProvince(provinceId: string): Promise<boolean> {
    const count = await MunicipalityModel.countDocuments({ province: provinceId });
    return count > 0;
  }
}
