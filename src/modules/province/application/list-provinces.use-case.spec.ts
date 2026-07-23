import { describe, expect, it, type Mocked, vi } from 'vitest';
import type { PaginatedResult } from '../../../shared/utils/pagination';
import type { Province } from '../domain/province.entity';
import type { FindAllProvincesOptions, ProvinceRepository } from '../domain/province.repository';
import { ListProvincesUseCase } from './list-provinces.use-case';

describe('ListProvincesUseCase', () => {
  const provinces: Province[] = [
    { id: 'province-luanda-id', name: 'Luanda' },
    { id: 'province-huila-id', name: 'Huíla' },
  ];

  function buildDeps(findAllPaginatedResult: PaginatedResult<Province>) {
    const provinceRepository: Mocked<ProvinceRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findAllPaginated: vi.fn().mockResolvedValue(findAllPaginatedResult),
      findById: vi.fn(),
      findByName: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    return { provinceRepository };
  }

  it('sem page/limit devolve um array simples', async () => {
    const deps = buildDeps({ data: provinces, page: 1, limit: 2, total: 2, totalPages: 1 });
    const useCase = new ListProvincesUseCase(deps.provinceRepository);

    const result = await useCase.execute();

    expect(result).toEqual(provinces);
  });

  it('com page/limit devolve o envelope paginado', async () => {
    const paginated = { data: [provinces[0]], page: 1, limit: 1, total: 2, totalPages: 2 };
    const deps = buildDeps(paginated);
    const useCase = new ListProvincesUseCase(deps.provinceRepository);

    const result = await useCase.execute({ page: 1, limit: 1 });

    expect(result).toEqual(paginated);
  });

  it('repassa o filtro name ao repositório', async () => {
    const deps = buildDeps({ data: [], page: 1, limit: 0, total: 0, totalPages: 0 });
    const useCase = new ListProvincesUseCase(deps.provinceRepository);

    const query: FindAllProvincesOptions = { name: 'lua' };
    await useCase.execute(query);

    expect(deps.provinceRepository.findAllPaginated).toHaveBeenCalledWith(query);
  });
});
