import { describe, expect, it, vi } from 'vitest';
import type { AuthenticatedRequest } from './auth.middleware';
import { requireSelfOrRole } from './require-self-or-role.middleware';

describe('requireSelfOrRole', () => {
  function buildReq(user: AuthenticatedRequest['user'], paramId: string): AuthenticatedRequest {
    return { user, params: { id: paramId } } as unknown as AuthenticatedRequest;
  }

  it('chama next() quando o utilizador é o dono do recurso (self), mesmo sem role privilegiado', () => {
    const req = buildReq({ id: 'user-1', email: 'user@email.com', role: 'user' }, 'user-1');
    const next = vi.fn();

    requireSelfOrRole('id', 'admin')(req, {} as never, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('chama next() quando o utilizador tem o role permitido, mesmo não sendo o dono', () => {
    const req = buildReq({ id: 'admin-1', email: 'admin@email.com', role: 'admin' }, 'user-1');
    const next = vi.fn();

    requireSelfOrRole('id', 'admin')(req, {} as never, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('lança AppError 403/FORBIDDEN quando não é o dono nem tem o role permitido', () => {
    const req = buildReq({ id: 'user-2', email: 'other@email.com', role: 'user' }, 'user-1');
    const next = vi.fn();

    expect(() => requireSelfOrRole('id', 'admin')(req, {} as never, next)).toThrowError(
      expect.objectContaining({ statusCode: 403, code: 'FORBIDDEN' }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
