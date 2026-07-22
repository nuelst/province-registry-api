import { describe, expect, it, type Mocked, vi } from 'vitest';
import type { MunicipalityRepository } from '../domain/municipality.repository';
import { DeleteMunicipalityUseCase, type UserExistenceChecker } from './delete-municipality.use-case';

describe('DeleteMunicipalityUseCase', () => {
  const municipalityId = 'municipality-talatona-id';

  function buildDeps(overrides?: { municipalityExists?: boolean; hasUsers?: boolean }) {
    const municipalityRepository: Mocked<MunicipalityRepository> = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi
        .fn()
        .mockResolvedValue(
          overrides?.municipalityExists === false
            ? null
            : { id: municipalityId, name: 'Talatona', province: 'province-luanda-id' },
        ),
      findByNameInProvince: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue(true),
      existsByProvince: vi.fn(),
    };

    const userChecker: Mocked<UserExistenceChecker> = {
      existsByMunicipality: vi.fn().mockResolvedValue(overrides?.hasUsers ?? false),
    };

    return { municipalityRepository, userChecker };
  }

  it('remove o município quando não existem utilizadores associados', async () => {
    const deps = buildDeps();
    const useCase = new DeleteMunicipalityUseCase(deps.municipalityRepository, deps.userChecker);

    await useCase.execute(municipalityId);

    expect(deps.municipalityRepository.delete).toHaveBeenCalledWith(municipalityId);
  });

  it('rejeita quando existem utilizadores associados ao município', async () => {
    const deps = buildDeps({ hasUsers: true });
    const useCase = new DeleteMunicipalityUseCase(deps.municipalityRepository, deps.userChecker);

    await expect(useCase.execute(municipalityId)).rejects.toMatchObject({
      statusCode: 400,
      code: 'MUNICIPALITY_HAS_USERS',
    });

    expect(deps.municipalityRepository.delete).not.toHaveBeenCalled();
  });

  it('rejeita quando o município não existe', async () => {
    const deps = buildDeps({ municipalityExists: false });
    const useCase = new DeleteMunicipalityUseCase(deps.municipalityRepository, deps.userChecker);

    await expect(useCase.execute(municipalityId)).rejects.toMatchObject({
      statusCode: 404,
      code: 'MUNICIPALITY_NOT_FOUND',
    });

    expect(deps.userChecker.existsByMunicipality).not.toHaveBeenCalled();
  });
});
