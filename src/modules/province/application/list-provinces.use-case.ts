import type { Province } from '../domain/province.entity';
import type { ProvinceRepository } from '../domain/province.repository';

export class ListProvincesUseCase {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  async execute(): Promise<Province[]> {
    return this.provinceRepository.findAll();
  }
}
