import type { NextFunction, Request, Response } from 'express';
import { JwtTokenProvider } from '../../modules/auth/infrastructure/jwt-token-provider';
import type { Role } from '../../modules/user/domain/user.entity';
import { AppError } from '../errors/app-error';

const tokenProvider = new JwtTokenProvider();

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: Role };
}

export function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw AppError.unauthorized('Token de acesso não fornecido', 'MISSING_TOKEN');
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const payload = tokenProvider.verify(token);

  req.user = { id: payload.sub, email: payload.email, role: payload.role };
  next();
}
