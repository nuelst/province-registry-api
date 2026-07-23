import type { PaginatedResult, PaginationParams } from '../../../shared/utils/pagination';
import type { CreateProvinceProps, Province, UpdateProvinceProps } from './province.entity';

export interface FindAllProvincesOptions extends PaginationParams {
  name?: string;
}

export interface ProvinceRepository {
  create(data: CreateProvinceProps): Promise<Province>;
  findAll(): Promise<Province[]>;
  findAllPaginated(options: FindAllProvincesOptions): Promise<PaginatedResult<Province>>;
  findById(id: string): Promise<Province | null>;
  findByName(name: string): Promise<Province | null>;
  update(id: string, data: UpdateProvinceProps): Promise<Province | null>;
  delete(id: string): Promise<boolean>;
}
