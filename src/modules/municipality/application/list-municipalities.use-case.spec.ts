import { describe, expect, it, type Mocked, vi } from 'vitest';
import type { PaginatedResult } from '../../../shared/utils/pagination';
import type { Municipality } from '../domain/municipality.entity';
import type { FindAllMunicipalitiesOptions, MunicipalityRepository } from '../domain/municipality.repository';
import { ListMunicipalitiesUseCase } from './list-municipalities.use-case';

describe('ListMunicipalitiesUseCase', () => {
  const municipalities: Municipality[] = [
    { id: 'municipality-talatona-id', name: 'Talatona', province: 'province-luanda-id' },
    { id: 'municipality-lubango-id', name: 'Lubango', province: 'province-huila-id' },
  ];

  function buildDeps(findAllPaginatedResult: PaginatedResult<Municipality>) {
    const municipalityRepository: Mocked<MunicipalityRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findAllPaginated: vi.fn().mockResolvedValue(findAllPaginatedResult),
      findById: vi.fn(),
      findByNameInProvince: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByProvince: vi.fn(),
    };

    return { municipalityRepository };
  }

  it('sem page/limit devolve um array simples', async () => {
    const deps = buildDeps({ data: municipalities, page: 1, limit: 2, total: 2, totalPages: 1 });
    const useCase = new ListMunicipalitiesUseCase(deps.municipalityRepository);

    const result = await useCase.execute();

    expect(result).toEqual(municipalities);
  });

  it('com page/limit devolve o envelope paginado', async () => {
    const paginated = { data: [municipalities[0]], page: 1, limit: 1, total: 2, totalPages: 2 };
    const deps = buildDeps(paginated);
    const useCase = new ListMunicipalitiesUseCase(deps.municipalityRepository);

    const result = await useCase.execute({ page: 1, limit: 1 });

    expect(result).toEqual(paginated);
  });

  it('repassa os filtros province e name ao repositório', async () => {
    const deps = buildDeps({ data: [], page: 1, limit: 0, total: 0, totalPages: 0 });
    const useCase = new ListMunicipalitiesUseCase(deps.municipalityRepository);

    const query: FindAllMunicipalitiesOptions = { province: 'province-luanda-id', name: 'tala' };
    await useCase.execute(query);

    expect(deps.municipalityRepository.findAllPaginated).toHaveBeenCalledWith(query);
  });
});
