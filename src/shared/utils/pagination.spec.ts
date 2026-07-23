import { describe, expect, it } from 'vitest';
import { buildPaginatedResult, escapeRegex, MAX_LIMIT, resolvePagination } from './pagination';

describe('resolvePagination', () => {
  it('sem page nem limit, não pagina e devolve limit = total', () => {
    const resolved = resolvePagination({}, 42);

    expect(resolved).toEqual({ isPaginated: false, page: 1, limit: 42, skip: 0 });
  });

  it('só com page, aplica o limit por omissão (20)', () => {
    const resolved = resolvePagination({ page: 2 }, 100);

    expect(resolved).toEqual({ isPaginated: true, page: 2, limit: 20, skip: 20 });
  });

  it('só com limit, assume page 1', () => {
    const resolved = resolvePagination({ limit: 5 }, 100);

    expect(resolved).toEqual({ isPaginated: true, page: 1, limit: 5, skip: 0 });
  });

  it('faz clamp de limit acima de MAX_LIMIT', () => {
    const resolved = resolvePagination({ limit: 999 }, 1000);

    expect(resolved.limit).toBe(MAX_LIMIT);
  });

  it('faz clamp de page/limit abaixo de 1 para 1', () => {
    const resolved = resolvePagination({ page: -3, limit: 0 }, 10);

    expect(resolved.page).toBe(1);
    expect(resolved.limit).toBe(1);
  });

  it('calcula skip corretamente para páginas > 1', () => {
    const resolved = resolvePagination({ page: 3, limit: 10 }, 100);

    expect(resolved.skip).toBe(20);
  });
});

describe('buildPaginatedResult', () => {
  it('devolve totalPages correto quando paginado', () => {
    const resolved = resolvePagination({ page: 1, limit: 10 }, 25);

    const result = buildPaginatedResult(['a', 'b'], resolved, 25);

    expect(result).toEqual({ data: ['a', 'b'], page: 1, limit: 10, total: 25, totalPages: 3 });
  });

  it('devolve totalPages = 1 quando não paginado e total > 0', () => {
    const resolved = resolvePagination({}, 7);

    const result = buildPaginatedResult(['a'], resolved, 7);

    expect(result.totalPages).toBe(1);
  });

  it('devolve totalPages = 0 quando total = 0', () => {
    const resolved = resolvePagination({}, 0);

    const result = buildPaginatedResult([], resolved, 0);

    expect(result.totalPages).toBe(0);
  });
});

describe('escapeRegex', () => {
  it('escapa caracteres especiais de regex', () => {
    expect(escapeRegex('(.*)+$')).toBe('\\(\\.\\*\\)\\+\\$');
  });

  it('não afeta texto sem caracteres especiais', () => {
    expect(escapeRegex('Luanda')).toBe('Luanda');
  });

  it('produz uma regex segura (não faz match indevido de tudo)', () => {
    const regex = new RegExp(escapeRegex('(.*)+$'), 'i');
    expect(regex.test('texto qualquer')).toBe(false);
    expect(regex.test('prefixo (.*)+$ sufixo')).toBe(true);
  });
});
