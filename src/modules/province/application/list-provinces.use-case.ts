import type { PaginatedResult } from '../../../shared/utils/pagination';
import type { Province } from '../domain/province.entity';
import type { FindAllProvincesOptions, ProvinceRepository } from '../domain/province.repository';

export class ListProvincesUseCase {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  async execute(query: FindAllProvincesOptions = {}): Promise<Province[] | PaginatedResult<Province>> {
    const result = await this.provinceRepository.findAllPaginated(query);

    const isPaginated = query.page !== undefined || query.limit !== undefined;

    return isPaginated ? result : result.data;
  }
}
