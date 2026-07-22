import { AppError } from '../../../shared/errors/app-error';
import type { UserRepository } from '../domain/user.repository';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw AppError.notFound('Utilizador não encontrado', 'USER_NOT_FOUND');
    }

    await this.userRepository.delete(id);
  }
}
