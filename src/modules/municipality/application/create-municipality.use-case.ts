import { AppError } from '../../../shared/errors/app-error';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import type { CreateMunicipalityProps, Municipality } from '../domain/municipality.entity';
import type { MunicipalityRepository } from '../domain/municipality.repository';

export class CreateMunicipalityUseCase {
  constructor(
    private readonly municipalityRepository: MunicipalityRepository,
    private readonly provinceRepository: ProvinceRepository,
  ) {}

  async execute(input: CreateMunicipalityProps): Promise<Municipality> {
    const province = await this.provinceRepository.findById(input.province);

    if (!province) {
      throw AppError.badRequest('Província informada não existe', 'PROVINCE_NOT_FOUND');
    }

    const existing = await this.municipalityRepository.findByNameInProvince(input.name, input.province);

    if (existing) {
      throw AppError.conflict(
        `Já existe o município "${input.name}" na província "${province.name}"`,
        'MUNICIPALITY_ALREADY_EXISTS',
      );
    }

    return this.municipalityRepository.create(input);
  }
}
