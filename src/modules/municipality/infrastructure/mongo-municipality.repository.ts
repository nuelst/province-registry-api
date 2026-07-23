import type { FilterQuery } from 'mongoose';
import {
  buildPaginatedResult,
  escapeRegex,
  type PaginatedResult,
  resolvePagination,
} from '../../../shared/utils/pagination';
import type {
  CreateMunicipalityProps,
  Municipality,
  UpdateMunicipalityProps,
} from '../domain/municipality.entity';
import type { FindAllMunicipalitiesOptions, MunicipalityRepository } from '../domain/municipality.repository';
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

  async findAllPaginated(options: FindAllMunicipalitiesOptions): Promise<PaginatedResult<Municipality>> {
    const filter: FilterQuery<MunicipalityDocument> = {};
    if (options.province) filter.province = options.province;
    if (options.name) filter.name = new RegExp(escapeRegex(options.name), 'i');

    const total = await MunicipalityModel.countDocuments(filter);
    const resolved = resolvePagination(options, total);

    let query = MunicipalityModel.find(filter).sort({ name: 1 });
    if (resolved.isPaginated) {
      query = query.skip(resolved.skip).limit(resolved.limit);
    }
    const docs = await query;

    return buildPaginatedResult(docs.map(toEntity), resolved, total);
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
