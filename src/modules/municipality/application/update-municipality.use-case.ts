import { AppError } from '../../../shared/errors/app-error';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import type { Municipality, UpdateMunicipalityProps } from '../domain/municipality.entity';
import type { MunicipalityRepository } from '../domain/municipality.repository';

export class UpdateMunicipalityUseCase {
  constructor(
    private readonly municipalityRepository: MunicipalityRepository,
    private readonly provinceRepository: ProvinceRepository,
  ) {}

  async execute(id: string, data: UpdateMunicipalityProps): Promise<Municipality> {
    const current = await this.municipalityRepository.findById(id);

    if (!current) {
      throw AppError.notFound('Município não encontrado', 'MUNICIPALITY_NOT_FOUND');
    }

    const targetProvince = data.province ?? current.province;

    if (data.province) {
      const province = await this.provinceRepository.findById(data.province);
      if (!province) {
        throw AppError.badRequest('Província informada não existe', 'PROVINCE_NOT_FOUND');
      }
    }

    const targetName = data.name ?? current.name;
    const duplicate = await this.municipalityRepository.findByNameInProvince(targetName, targetProvince);

    if (duplicate && duplicate.id !== id) {
      throw AppError.conflict(
        `Já existe o município "${targetName}" nesta província`,
        'MUNICIPALITY_ALREADY_EXISTS',
      );
    }

    const updated = await this.municipalityRepository.update(id, data);

    if (!updated) {
      throw AppError.notFound('Município não encontrado', 'MUNICIPALITY_NOT_FOUND');
    }

    return updated;
  }
}
