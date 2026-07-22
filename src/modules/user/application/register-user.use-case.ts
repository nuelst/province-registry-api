import { AppError } from '../../../shared/errors/app-error';
import type { MunicipalityRepository } from '../../municipality/domain/municipality.repository';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import type { PasswordHasher } from '../domain/password-hasher';
import { type CreateUserProps, type SafeUser, toSafeUser } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly provinceRepository: ProvinceRepository,
    private readonly municipalityRepository: MunicipalityRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserProps): Promise<SafeUser> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw AppError.conflict('Já existe um utilizador com este email', 'EMAIL_ALREADY_EXISTS');
    }

    const province = await this.provinceRepository.findById(input.province);
    if (!province) {
      throw AppError.badRequest('Província informada não existe', 'PROVINCE_NOT_FOUND');
    }

    const municipality = await this.municipalityRepository.findById(input.municipality);
    if (!municipality) {
      throw AppError.badRequest('Município informado não existe', 'MUNICIPALITY_NOT_FOUND');
    }

    if (municipality.province !== input.province) {
      throw AppError.badRequest(
        `O município "${municipality.name}" não pertence à província selecionada`,
        'MUNICIPALITY_PROVINCE_MISMATCH',
      );
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      province: input.province,
      municipality: input.municipality,
    });

    return toSafeUser(user);
  }
}
