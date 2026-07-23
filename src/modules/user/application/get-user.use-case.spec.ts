import { describe, expect, it, type Mocked, vi } from 'vitest';
import type { MunicipalityRepository } from '../../municipality/domain/municipality.repository';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import type { User } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';
import { GetUserUseCase } from './get-user.use-case';

describe('GetUserUseCase', () => {
  const userId = 'user-1';

  const user: User = {
    id: userId,
    name: 'Isaac',
    email: 'isaac@email.com',
    passwordHash: 'hash',
    province: 'province-luanda-id',
    municipality: 'municipality-talatona-id',
    role: 'user',
  };

  function buildDeps(overrides?: { userExists?: boolean }) {
    const userRepository: Mocked<UserRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValue(overrides?.userExists === false ? null : user),
      findByEmail: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByMunicipality: vi.fn(),
    };

    const provinceRepository: Mocked<ProvinceRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValue({ id: 'province-luanda-id', name: 'Luanda' }),
      findByName: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const municipalityRepository: Mocked<MunicipalityRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValue({
        id: 'municipality-talatona-id',
        name: 'Talatona',
        province: 'province-luanda-id',
      }),
      findByNameInProvince: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByProvince: vi.fn(),
    };

    return { userRepository, provinceRepository, municipalityRepository };
  }

  it('devolve o utilizador com província e município resolvidos (id + nome)', async () => {
    const deps = buildDeps();
    const useCase = new GetUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
    );

    const result = await useCase.execute(userId);

    expect(result.province).toEqual({ id: 'province-luanda-id', name: 'Luanda' });
    expect(result.municipality).toEqual({ id: 'municipality-talatona-id', name: 'Talatona' });
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('rejeita quando o utilizador não existe', async () => {
    const deps = buildDeps({ userExists: false });
    const useCase = new GetUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
    );

    await expect(useCase.execute(userId)).rejects.toMatchObject({
      statusCode: 404,
      code: 'USER_NOT_FOUND',
    });
  });
});
