import type { Role } from '../../user/domain/user.entity';

export interface TokenPayload {
  sub: string; // user id
  email: string;
  role: Role;
}

export interface TokenProvider {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
