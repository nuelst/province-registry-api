import { AppError } from '../../../shared/errors/app-error';
import type { CreateProvinceProps, Province } from '../domain/province.entity';
import type { ProvinceRepository } from '../domain/province.repository';

export class CreateProvinceUseCase {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  async execute(input: CreateProvinceProps): Promise<Province> {
    const existing = await this.provinceRepository.findByName(input.name);

    if (existing) {
      throw AppError.conflict(
        `Já existe uma província com o nome "${input.name}"`,
        'PROVINCE_ALREADY_EXISTS',
      );
    }

    return this.provinceRepository.create(input);
  }
}
