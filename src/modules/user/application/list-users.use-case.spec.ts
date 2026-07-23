import { describe, expect, it, type Mocked, vi } from 'vitest';
import type { PaginatedResult } from '../../../shared/utils/pagination';
import type { MunicipalityRepository } from '../../municipality/domain/municipality.repository';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import type { SafeUserWithRelations, User } from '../domain/user.entity';
import type { FindAllUsersOptions, UserRepository } from '../domain/user.repository';
import { ListUsersUseCase } from './list-users.use-case';

describe('ListUsersUseCase', () => {
  const users: User[] = [
    {
      id: 'user-1',
      name: 'Isaac',
      email: 'isaac@email.com',
      passwordHash: 'hash',
      province: 'province-luanda-id',
      municipality: 'municipality-talatona-id',
      role: 'user',
    },
    {
      id: 'user-2',
      name: 'Maria',
      email: 'maria@email.com',
      passwordHash: 'hash',
      province: 'province-huila-id',
      municipality: 'municipality-lubango-id',
      role: 'admin',
    },
  ];

  function toUnpaginatedResult(data: User[]): PaginatedResult<User> {
    return { data, page: 1, limit: data.length, total: data.length, totalPages: data.length > 0 ? 1 : 0 };
  }

  function buildDeps(findAllPaginatedResult: PaginatedResult<User> = toUnpaginatedResult(users)) {
    const userRepository: Mocked<UserRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findAllPaginated: vi.fn().mockResolvedValue(findAllPaginatedResult),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByMunicipality: vi.fn(),
    };

    const provinceRepository: Mocked<ProvinceRepository> = {
      create: vi.fn(),
      findAll: vi.fn().mockResolvedValue([
        { id: 'province-luanda-id', name: 'Luanda' },
        { id: 'province-huila-id', name: 'Huíla' },
      ]),
      findAllPaginated: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const municipalityRepository: Mocked<MunicipalityRepository> = {
      create: vi.fn(),
      findAll: vi.fn().mockResolvedValue([
        { id: 'municipality-talatona-id', name: 'Talatona', province: 'province-luanda-id' },
        { id: 'municipality-lubango-id', name: 'Lubango', province: 'province-huila-id' },
      ]),
      findAllPaginated: vi.fn(),
      findById: vi.fn(),
      findByNameInProvince: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByProvince: vi.fn(),
    };

    return { userRepository, provinceRepository, municipalityRepository };
  }

  it('devolve todos os utilizadores com província e município resolvidos, cada um o seu', async () => {
    const deps = buildDeps();
    const useCase = new ListUsersUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
    );

    const result = await useCase.execute();

    expect(Array.isArray(result)).toBe(true);
    const list = result as SafeUserWithRelations[];
    expect(list).toHaveLength(2);
    expect(list[0]).toMatchObject({
      id: 'user-1',
      province: { id: 'province-luanda-id', name: 'Luanda' },
      municipality: { id: 'municipality-talatona-id', name: 'Talatona' },
    });
    expect(list[1]).toMatchObject({
      id: 'user-2',
      province: { id: 'province-huila-id', name: 'Huíla' },
      municipality: { id: 'municipality-lubango-id', name: 'Lubango' },
    });
    expect(list[0]).not.toHaveProperty('passwordHash');
  });

  it('sem page/limit devolve um array simples (não paginado)', async () => {
    const deps = buildDeps();
    const useCase = new ListUsersUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
    );

    const result = await useCase.execute();

    expect(Array.isArray(result)).toBe(true);
  });

  it('com page/limit devolve o envelope paginado, com data já mapeado', async () => {
    const deps = buildDeps({ data: [users[0]], page: 1, limit: 1, total: 2, totalPages: 2 });
    const useCase = new ListUsersUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
    );

    const result = await useCase.execute({ page: 1, limit: 1 });

    expect(result).toMatchObject({ page: 1, limit: 1, total: 2, totalPages: 2 });
    expect(Array.isArray((result as { data: unknown[] }).data)).toBe(true);
    expect((result as { data: unknown[] }).data).toHaveLength(1);
  });

  it('repassa os filtros (province, municipality, role) ao repositório', async () => {
    const deps = buildDeps();
    const useCase = new ListUsersUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
    );

    const query: FindAllUsersOptions = { role: 'admin', province: 'province-huila-id' };
    await useCase.execute(query);

    expect(deps.userRepository.findAllPaginated).toHaveBeenCalledWith(query);
  });
});
