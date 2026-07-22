import type { Municipality } from '../domain/municipality.entity';
import type { MunicipalityRepository } from '../domain/municipality.repository';

export class ListMunicipalitiesUseCase {
  constructor(private readonly municipalityRepository: MunicipalityRepository) {}

  async execute(province?: string): Promise<Municipality[]> {
    return this.municipalityRepository.findAll(province);
  }
}
