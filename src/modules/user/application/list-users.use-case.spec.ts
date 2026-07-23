import { describe, expect, it, type Mocked, vi } from 'vitest';
import type { MunicipalityRepository } from '../../municipality/domain/municipality.repository';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import type { User } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';
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

  function buildDeps() {
    const userRepository: Mocked<UserRepository> = {
      create: vi.fn(),
      findAll: vi.fn().mockResolvedValue(users),
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

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 'user-1',
      province: { id: 'province-luanda-id', name: 'Luanda' },
      municipality: { id: 'municipality-talatona-id', name: 'Talatona' },
    });
    expect(result[1]).toMatchObject({
      id: 'user-2',
      province: { id: 'province-huila-id', name: 'Huíla' },
      municipality: { id: 'municipality-lubango-id', name: 'Lubango' },
    });
    expect(result[0]).not.toHaveProperty('passwordHash');
  });
});
