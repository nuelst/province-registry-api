import { AppError } from '../../../shared/errors/app-error';
import type { MunicipalityRepository } from '../../municipality/domain/municipality.repository';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import type { PasswordHasher } from '../domain/password-hasher';
import { type SafeUser, toSafeUser, type UpdateUserProps } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly provinceRepository: ProvinceRepository,
    private readonly municipalityRepository: MunicipalityRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(id: string, input: UpdateUserProps): Promise<SafeUser> {
    const current = await this.userRepository.findById(id);
    if (!current) {
      throw AppError.notFound('Utilizador não encontrado', 'USER_NOT_FOUND');
    }

    if (input.email && input.email !== current.email) {
      const existing = await this.userRepository.findByEmail(input.email);
      if (existing) {
        throw AppError.conflict('Já existe um utilizador com este email', 'EMAIL_ALREADY_EXISTS');
      }
    }

    const targetProvinceId = input.province ?? current.province;
    const targetMunicipalityId = input.municipality ?? current.municipality;

    if (input.province) {
      const province = await this.provinceRepository.findById(input.province);
      if (!province) {
        throw AppError.badRequest('Província informada não existe', 'PROVINCE_NOT_FOUND');
      }
    }

    if (input.municipality) {
      const municipality = await this.municipalityRepository.findById(input.municipality);
      if (!municipality) {
        throw AppError.badRequest('Município informado não existe', 'MUNICIPALITY_NOT_FOUND');
      }
    }

    if (input.province || input.municipality) {
      const municipality = await this.municipalityRepository.findById(targetMunicipalityId);
      if (!municipality || municipality.province !== targetProvinceId) {
        throw AppError.badRequest(
          'O município selecionado não pertence à província informada',
          'MUNICIPALITY_PROVINCE_MISMATCH',
        );
      }
    }

    const passwordHash = input.password ? await this.passwordHasher.hash(input.password) : undefined;

    const updated = await this.userRepository.update(id, {
      name: input.name,
      email: input.email,
      passwordHash,
      province: input.province,
      municipality: input.municipality,
    });

    if (!updated) {
      throw AppError.notFound('Utilizador não encontrado', 'USER_NOT_FOUND');
    }

    return toSafeUser(updated);
  }
}
