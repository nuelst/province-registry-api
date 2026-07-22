import type { CreateProvinceProps, Province, UpdateProvinceProps } from './province.entity';


export interface ProvinceRepository {
  create(data: CreateProvinceProps): Promise<Province>;
  findAll(): Promise<Province[]>;
  findById(id: string): Promise<Province | null>;
  findByName(name: string): Promise<Province | null>;
  update(id: string, data: UpdateProvinceProps): Promise<Province | null>;
  delete(id: string): Promise<boolean>;
}
