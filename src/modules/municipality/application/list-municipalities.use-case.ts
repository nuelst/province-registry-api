import type { PaginatedResult } from '../../../shared/utils/pagination';
import type { Municipality } from '../domain/municipality.entity';
import type { FindAllMunicipalitiesOptions, MunicipalityRepository } from '../domain/municipality.repository';

export class ListMunicipalitiesUseCase {
  constructor(private readonly municipalityRepository: MunicipalityRepository) {}

  async execute(
    query: FindAllMunicipalitiesOptions = {},
  ): Promise<Municipality[] | PaginatedResult<Municipality>> {
    const result = await this.municipalityRepository.findAllPaginated(query);

    const isPaginated = query.page !== undefined || query.limit !== undefined;

    return isPaginated ? result : result.data;
  }
}
