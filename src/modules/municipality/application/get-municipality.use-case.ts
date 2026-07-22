import { AppError } from '../../../shared/errors/app-error';
import type { Municipality } from '../domain/municipality.entity';
import type { MunicipalityRepository } from '../domain/municipality.repository';

export class GetMunicipalityUseCase {
  constructor(private readonly municipalityRepository: MunicipalityRepository) {}

  async execute(id: string): Promise<Municipality> {
    const municipality = await this.municipalityRepository.findById(id);

    if (!municipality) {
      throw AppError.notFound('Município não encontrado', 'MUNICIPALITY_NOT_FOUND');
    }

    return municipality;
  }
}
