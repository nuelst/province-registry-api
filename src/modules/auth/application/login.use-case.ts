import { AppError } from '../../../shared/errors/app-error';
import type { PasswordHasher } from '../../user/domain/password-hasher';
import type { UserRepository } from '../../user/domain/user.repository';
import type { TokenProvider } from './token-provider.interface';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw AppError.unauthorized('Email ou password inválidos', 'INVALID_CREDENTIALS');
    }

    const passwordMatches = await this.passwordHasher.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw AppError.unauthorized('Email ou password inválidos', 'INVALID_CREDENTIALS');
    }

    const accessToken = this.tokenProvider.generate({ sub: user.id, email: user.email });

    return { accessToken };
  }
}
