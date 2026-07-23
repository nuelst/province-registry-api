import { describe, expect, it, type Mocked, vi } from 'vitest';
import type { AppError } from '../../../shared/errors/app-error';
import type { MunicipalityRepository } from '../../municipality/domain/municipality.repository';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import type { PasswordHasher } from '../domain/password-hasher';
import type { UserRepository } from '../domain/user.repository';
import { RegisterUserUseCase } from './register-user.use-case';

describe('RegisterUserUseCase', () => {
  const baseInput = {
    name: 'Isaac',
    email: 'isaac@email.com',
    password: 'password123',
    province: 'province-luanda-id',
    municipality: 'municipality-talatona-id',
  };

  function buildDeps(overrides?: {
    existingUser?: boolean;
    municipalityProvince?: string;
    provinceExists?: boolean;
    municipalityExists?: boolean;
  }) {
    const userRepository: Mocked<UserRepository> = {
      create: vi.fn().mockImplementation(async (data) => ({ id: 'user-1', ...data })),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue(overrides?.existingUser ? { id: 'existing' } : null),
      update: vi.fn(),
      delete: vi.fn(),
      existsByMunicipality: vi.fn(),
    };

    const provinceRepository: Mocked<ProvinceRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi
        .fn()
        .mockResolvedValue(
          overrides?.provinceExists === false ? null : { id: baseInput.province, name: 'Luanda' },
        ),
      findByName: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const municipalityRepository: Mocked<MunicipalityRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValue(
        overrides?.municipalityExists === false
          ? null
          : {
              id: baseInput.municipality,
              name: 'Talatona',
              province: overrides?.municipalityProvince ?? baseInput.province,
            },
      ),
      findByNameInProvince: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      existsByProvince: vi.fn(),
    };

    const passwordHasher: Mocked<PasswordHasher> = {
      hash: vi.fn().mockResolvedValue('hashed-password'),
      compare: vi.fn(),
    };

    return { userRepository, provinceRepository, municipalityRepository, passwordHasher };
  }

  it('regista um utilizador quando o município pertence à província informada', async () => {
    const deps = buildDeps();
    const useCase = new RegisterUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    const result = await useCase.execute(baseInput);

    expect(result.email).toBe(baseInput.email);
    expect(deps.passwordHasher.hash).toHaveBeenCalledWith(baseInput.password);
    expect(deps.userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ passwordHash: 'hashed-password' }),
    );
    expect(result.province).toEqual({ id: baseInput.province, name: 'Luanda' });
    expect(result.municipality).toEqual({ id: baseInput.municipality, name: 'Talatona' });
  });

  it('rejeita quando o email já está em uso', async () => {
    const deps = buildDeps({ existingUser: true });
    const useCase = new RegisterUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    await expect(useCase.execute(baseInput)).rejects.toMatchObject({
      statusCode: 409,
    } satisfies Partial<AppError>);
  });

  it('rejeita quando a província informada não existe', async () => {
    const deps = buildDeps({ provinceExists: false });
    const useCase = new RegisterUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    await expect(useCase.execute(baseInput)).rejects.toMatchObject({ statusCode: 400 });
  });

  it('rejeita quando o município informado não existe', async () => {
    const deps = buildDeps({ municipalityExists: false });
    const useCase = new RegisterUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    await expect(useCase.execute(baseInput)).rejects.toMatchObject({ statusCode: 400 });
  });

  it('rejeita quando o município NÃO pertence à província informada (regra central do desafio)', async () => {
    const deps = buildDeps({ municipalityProvince: 'province-huila-id' });
    const useCase = new RegisterUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    await expect(useCase.execute(baseInput)).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining('não pertence'),
    });

    expect(deps.userRepository.create).not.toHaveBeenCalled();
  });

  it('atribui role "user" por omissão quando role não é informado (ex: /auth/register)', async () => {
    const deps = buildDeps();
    const useCase = new RegisterUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    await useCase.execute(baseInput);

    expect(deps.userRepository.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'user' }));
  });

  it('propaga role "admin" quando explicitamente informado (fluxo admin em POST /users)', async () => {
    const deps = buildDeps();
    const useCase = new RegisterUserUseCase(
      deps.userRepository,
      deps.provinceRepository,
      deps.municipalityRepository,
      deps.passwordHasher,
    );

    await useCase.execute({ ...baseInput, role: 'admin' });

    expect(deps.userRepository.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'admin' }));
  });
});
