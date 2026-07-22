import { AppError } from '../../../shared/errors/app-error';
import type { Province, UpdateProvinceProps } from '../domain/province.entity';
import type { ProvinceRepository } from '../domain/province.repository';

export class UpdateProvinceUseCase {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  async execute(id: string, data: UpdateProvinceProps): Promise<Province> {
    if (data.name) {
      const existing = await this.provinceRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict(
          `Já existe uma província com o nome "${data.name}"`,
          'PROVINCE_ALREADY_EXISTS',
        );
      }
    }

    const updated = await this.provinceRepository.update(id, data);

    if (!updated) {
      throw AppError.notFound('Província não encontrada', 'PROVINCE_NOT_FOUND');
    }

    return updated;
  }
}
