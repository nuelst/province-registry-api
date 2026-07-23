import { describe, expect, it, vi } from 'vitest';
import type { AuthenticatedRequest } from './auth.middleware';
import { requireRole } from './require-role.middleware';

describe('requireRole', () => {
  function buildReq(user?: AuthenticatedRequest['user']): AuthenticatedRequest {
    return { user } as AuthenticatedRequest;
  }

  it('chama next() quando o role do utilizador está na lista permitida', () => {
    const req = buildReq({ id: 'user-1', email: 'admin@email.com', role: 'admin' });
    const next = vi.fn();

    requireRole('admin')(req, {} as never, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('lança AppError 403/FORBIDDEN quando o role não está na lista permitida', () => {
    const req = buildReq({ id: 'user-1', email: 'user@email.com', role: 'user' });
    const next = vi.fn();

    expect(() => requireRole('admin')(req, {} as never, next)).toThrowError(
      expect.objectContaining({ statusCode: 403, code: 'FORBIDDEN' }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('lança AppError 403/FORBIDDEN quando não há utilizador autenticado', () => {
    const req = buildReq(undefined);
    const next = vi.fn();

    expect(() => requireRole('admin')(req, {} as never, next)).toThrowError(
      expect.objectContaining({ statusCode: 403, code: 'FORBIDDEN' }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
