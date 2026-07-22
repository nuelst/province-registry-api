import { AppError } from '../../../shared/errors/app-error';
import type { Province } from '../domain/province.entity';
import type { ProvinceRepository } from '../domain/province.repository';

export class GetProvinceUseCase {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  async execute(id: string): Promise<Province> {
    const province = await this.provinceRepository.findById(id);

    if (!province) {
      throw AppError.notFound('Província não encontrada', 'PROVINCE_NOT_FOUND');
    }

    return province;
  }
}
