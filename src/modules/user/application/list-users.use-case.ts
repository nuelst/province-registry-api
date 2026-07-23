import { AppError } from '../../../shared/errors/app-error';
import type { PaginatedResult } from '../../../shared/utils/pagination';
import type { MunicipalityRepository } from '../../municipality/domain/municipality.repository';
import type { ProvinceRepository } from '../../province/domain/province.repository';
import {
  type RelationRef,
  type SafeUserWithRelations,
  toSafeUser,
  toSafeUserWithRelations,
} from '../domain/user.entity';
import type { FindAllUsersOptions, UserRepository } from '../domain/user.repository';

export class ListUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly provinceRepository: ProvinceRepository,
    private readonly municipalityRepository: MunicipalityRepository,
  ) {}

  async execute(
    query: FindAllUsersOptions = {},
  ): Promise<SafeUserWithRelations[] | PaginatedResult<SafeUserWithRelations>> {
    const [result, provinces, municipalities] = await Promise.all([
      this.userRepository.findAllPaginated(query),
      this.provinceRepository.findAll(),
      this.municipalityRepository.findAll(),
    ]);

    const provincesById = new Map<string, RelationRef>(provinces.map((p) => [p.id, p]));
    const municipalitiesById = new Map<string, RelationRef>(municipalities.map((m) => [m.id, m]));

    const data = result.data.map((user) => {
      const province = provincesById.get(user.province);
      const municipality = municipalitiesById.get(user.municipality);

      if (!province || !municipality) {
        throw AppError.notFound('Província ou município de um utilizador não encontrado', 'NOT_FOUND');
      }

      return toSafeUserWithRelations(toSafeUser(user), province, municipality);
    });

    const isPaginated = query.page !== undefined || query.limit !== undefined;

    return isPaginated ? { ...result, data } : data;
  }
}
