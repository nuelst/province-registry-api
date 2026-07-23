export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ResolvedPagination {
  isPaginated: boolean;
  page: number;
  limit: number;
  skip: number;
}

export function resolvePagination(params: PaginationParams, total: number): ResolvedPagination {
  const isPaginated = params.page !== undefined || params.limit !== undefined;

  if (!isPaginated) {
    return { isPaginated: false, page: 1, limit: total, skip: 0 };
  }

  const page = Math.max(params.page ?? 1, 1);
  const limit = Math.min(Math.max(params.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);

  return { isPaginated: true, page, limit, skip: (page - 1) * limit };
}

export function buildPaginatedResult<T>(
  data: T[],
  resolved: ResolvedPagination,
  total: number,
): PaginatedResult<T> {
  return {
    data,
    page: resolved.page,
    limit: resolved.limit,
    total,
    totalPages: resolved.limit > 0 ? Math.ceil(total / resolved.limit) : total > 0 ? 1 : 0,
  };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
