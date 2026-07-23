import jwt from 'jsonwebtoken';
import { AppError } from '../../../shared/errors/app-error';
import { env } from '../../../shared/infra/env';
import type { TokenPayload, TokenProvider } from '../application/token-provider.interface';

export class JwtTokenProvider implements TokenProvider {
  generate(payload: TokenPayload): string {
    const options: jwt.SignOptions = { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, env.JWT_SECRET, options);
  }

  verify(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch {
      throw AppError.unauthorized('Token inválido ou expirado', 'INVALID_TOKEN');
    }
  }
}
