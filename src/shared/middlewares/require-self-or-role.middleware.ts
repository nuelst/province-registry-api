import type { NextFunction, Response } from 'express';
import type { Role } from '../../modules/user/domain/user.entity';
import { AppError } from '../errors/app-error';
import type { AuthenticatedRequest } from './auth.middleware';

export function requireSelfOrRole(paramName: string, ...roles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const isSelf = req.user?.id === req.params[paramName];
    const hasRole = req.user ? roles.includes(req.user.role) : false;

    if (!isSelf && !hasRole) {
      throw AppError.forbidden('Só pode gerir a sua própria conta', 'FORBIDDEN');
    }
    next();
  };
}
