import { AppError } from '../../../shared/errors/app-error';
import type { MunicipalityRepository } from '../domain/municipality.repository';

export interface UserExistenceChecker {
  existsByMunicipality(municipalityId: string): Promise<boolean>;
}

export class DeleteMunicipalityUseCase {
  constructor(
    private readonly municipalityRepository: MunicipalityRepository,
    private readonly userChecker: UserExistenceChecker,
  ) {}

  async execute(id: string): Promise<void> {
    const municipality = await this.municipalityRepository.findById(id);

    if (!municipality) {
      throw AppError.notFound('Município não encontrado', 'MUNICIPALITY_NOT_FOUND');
    }

    const hasUsers = await this.userChecker.existsByMunicipality(id);

    if (hasUsers) {
      throw AppError.badRequest(
        'Não é possível remover um município com utilizadores associados',
        'MUNICIPALITY_HAS_USERS',
      );
    }

    await this.municipalityRepository.delete(id);
  }
}
