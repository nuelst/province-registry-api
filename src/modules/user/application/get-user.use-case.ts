import { AppError } from '../../../shared/errors/app-error';
import { type SafeUser, toSafeUser } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw AppError.notFound('Utilizador não encontrado', 'USER_NOT_FOUND');
    }

    return toSafeUser(user);
  }
}
