export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'MISSING_TOKEN'
  | 'INVALID_TOKEN'
  | 'INVALID_CREDENTIALS'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'PROVINCE_NOT_FOUND'
  | 'MUNICIPALITY_NOT_FOUND'
  | 'CONFLICT'
  | 'EMAIL_ALREADY_EXISTS'
  | 'PROVINCE_ALREADY_EXISTS'
  | 'MUNICIPALITY_ALREADY_EXISTS'
  | 'MUNICIPALITY_PROVINCE_MISMATCH'
  | 'PROVINCE_HAS_MUNICIPALITIES'
  | 'MUNICIPALITY_HAS_USERS'
  | 'DUPLICATE_KEY'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: AppErrorCode;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, code: AppErrorCode = 'BAD_REQUEST', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static notFound(message = 'Recurso não encontrado', code: AppErrorCode = 'NOT_FOUND'): AppError {
    return new AppError(message, 404, code);
  }

  static conflict(message = 'Conflito de dados', code: AppErrorCode = 'CONFLICT'): AppError {
    return new AppError(message, 409, code);
  }

  static badRequest(
    message = 'Requisição inválida',
    code: AppErrorCode = 'BAD_REQUEST',
    details?: unknown,
  ): AppError {
    return new AppError(message, 400, code, details);
  }

  static unauthorized(message = 'Não autorizado', code: AppErrorCode = 'UNAUTHORIZED'): AppError {
    return new AppError(message, 401, code);
  }

  static forbidden(message = 'Acesso negado', code: AppErrorCode = 'FORBIDDEN'): AppError {
    return new AppError(message, 403, code);
  }
}
