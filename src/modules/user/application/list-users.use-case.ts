import { type SafeUser, toSafeUser } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<SafeUser[]> {
    const users = await this.userRepository.findAll();
    return users.map(toSafeUser);
  }
}
