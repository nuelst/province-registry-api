import type { NextFunction, Response } from 'express';
import type { Role } from '../../modules/user/domain/user.entity';
import { AppError } from '../errors/app-error';
import type { AuthenticatedRequest } from './auth.middleware';

export function requireRole(...roles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw AppError.forbidden('Apenas administradores podem realizar esta ação', 'FORBIDDEN');
    }
    next();
  };
}
