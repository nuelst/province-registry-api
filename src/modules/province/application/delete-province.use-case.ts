import { AppError } from '../../../shared/errors/app-error';
import type { ProvinceRepository } from '../domain/province.repository';

/**
 * Porta mínima usada apenas para checar dependências antes de remover
 * uma província (evita import direto do módulo municipality).
 */
export interface MunicipalityExistenceChecker {
  existsByProvince(provinceId: string): Promise<boolean>;
}

export class DeleteProvinceUseCase {
  constructor(
    private readonly provinceRepository: ProvinceRepository,
    private readonly municipalityChecker: MunicipalityExistenceChecker,
  ) {}

  async execute(id: string): Promise<void> {
    const province = await this.provinceRepository.findById(id);

    if (!province) {
      throw AppError.notFound('Província não encontrada', 'PROVINCE_NOT_FOUND');
    }

    const hasMunicipalities = await this.municipalityChecker.existsByProvince(id);

    if (hasMunicipalities) {
      throw AppError.badRequest(
        'Não é possível remover uma província com municípios associados',
        'PROVINCE_HAS_MUNICIPALITIES',
      );
    }

    await this.provinceRepository.delete(id);
  }
}
