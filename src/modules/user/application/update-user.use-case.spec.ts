import { describe, expect, it, type Mocked, vi } from 'vitest';
import type { MunicipalityRepository } from '../../municipality/domain/municipality.repository';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import type { PasswordHasher } from '../domain/password-hasher';
import type { User } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';
import { UpdateUserUseCase } from './update-user.use-case';

describe('UpdateUserUseCase', () => {
  const userId = 'user-1';

  const currentUser: User = {
    id: userId,
    name: 'Isaac',
    email: 'isaac@email.com',
    passwordHash: 'old-hash',
    province: 'province-luanda-id',
    municipality: 'municipality-talatona-id',
    role: 'user',
  };

  function buildDeps(overrides?: {
    municipalityProvince?: string;
    provinceExists?: boolean;
    municipalityExists?: boolean;
  }) {
    const userRepository: Mocked<UserRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValue(currentUser),
      findByEmail: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockImplementation(async (id, data) => ({ ...currentUser, id, ...data })),
      delete: vi.fn(),
      existsByMunicipality: vi.fn(),
    };

    const provinceRepository: Mocked<ProvinceRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi
        .fn()
        .mockResolvedValue(
          overrides?.provinceExists === false ? null : { id: 'province-huila-id', name: 'Huíla' },
        ),
      findByName: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const municipalityRepository: Mocked<MunicipalityRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockImplementation(async (id: string) => {
        if (overrides?.municipalityExists === false) return null;
        return {
          id,
          name: 'Lubango',
          province: overrides?.municipalityProvince ?? 'province-huila-id',
        };
      }),
      findByNameInProvince: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByProvince: vi.fn(),
    };

    const passwordHasher: Mocked<PasswordHasher> = {
      hash: vi.fn().mockResolvedValue('new-hashed-password'),
      compare: vi.fn(),
    };

    return { userRepository, provinceRepository, municipalityRepository, passwordHasher };
  }

  it('atualiza campos simples sem tocar em role quando role não é informado', async () => {
    const deps = buildDeps();
    const useCase = new UpdateUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    await useCase.execute(userId, { name: 'Isaac Silva' });

    expect(deps.userRepository.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({ name: 'Isaac Silva', role: undefined }),
    );
  });

  it('propaga role quando informado (caminho admin)', async () => {
    const deps = buildDeps();
    const useCase = new UpdateUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    await useCase.execute(userId, { role: 'admin' });

    expect(deps.userRepository.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({ role: 'admin' }),
    );
  });

  it('rejeita quando o município atualizado NÃO pertence à província atualizada (regra central, também no update)', async () => {
    const deps = buildDeps({ municipalityProvince: 'province-luanda-id' });
    const useCase = new UpdateUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    await expect(
      useCase.execute(userId, { province: 'province-huila-id', municipality: 'municipality-lubango-id' }),
    ).rejects.toMatchObject({
      statusCode: 400,
      code: 'MUNICIPALITY_PROVINCE_MISMATCH',
    });

    expect(deps.userRepository.update).not.toHaveBeenCalled();
  });

  it('aceita quando o município atualizado pertence à província atualizada', async () => {
    const deps = buildDeps({ municipalityProvince: 'province-huila-id' });
    const useCase = new UpdateUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    const result = await useCase.execute(userId, {
      province: 'province-huila-id',
      municipality: 'municipality-lubango-id',
    });

    expect(deps.userRepository.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({ province: 'province-huila-id', municipality: 'municipality-lubango-id' }),
    );
    expect(result.province).toEqual({ id: 'province-huila-id', name: 'Huíla' });
    expect(result.municipality).toEqual({ id: 'municipality-lubango-id', name: 'Lubango' });
  });
});
