import { AppError } from '../../../shared/errors/app-error';
import type { MunicipalityRepository } from '../../municipality/domain/municipality.repository';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import { type SafeUserWithRelations, toSafeUser, toSafeUserWithRelations } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';

export class GetUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly provinceRepository: ProvinceRepository,
    private readonly municipalityRepository: MunicipalityRepository,
  ) {}

  async execute(id: string): Promise<SafeUserWithRelations> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw AppError.notFound('Utilizador não encontrado', 'USER_NOT_FOUND');
    }

    const [province, municipality] = await Promise.all([
      this.provinceRepository.findById(user.province),
      this.municipalityRepository.findById(user.municipality),
    ]);

    if (!province || !municipality) {
      throw AppError.notFound('Província ou município do utilizador não encontrado', 'NOT_FOUND');
    }

    return toSafeUserWithRelations(toSafeUser(user), province, municipality);
  }
}
