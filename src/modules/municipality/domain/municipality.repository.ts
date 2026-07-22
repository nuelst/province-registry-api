import type { MunicipalityExistenceChecker } from '../../province/application/delete-province.use-case';
import type { CreateMunicipalityProps, Municipality, UpdateMunicipalityProps } from './municipality.entity';

export interface MunicipalityRepository extends MunicipalityExistenceChecker {
  create(data: CreateMunicipalityProps): Promise<Municipality>;
  findAll(province?: string): Promise<Municipality[]>;
  findById(id: string): Promise<Municipality | null>;
  findByNameInProvince(name: string, province: string): Promise<Municipality | null>;
  update(id: string, data: UpdateMunicipalityProps): Promise<Municipality | null>;
  delete(id: string): Promise<boolean>;
}
