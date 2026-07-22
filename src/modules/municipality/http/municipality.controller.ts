import type { Request, Response } from 'express';
import type { CreateMunicipalityUseCase } from '../application/create-municipality.use-case';
import type { DeleteMunicipalityUseCase } from '../application/delete-municipality.use-case';
import type { GetMunicipalityUseCase } from '../application/get-municipality.use-case';
import type { ListMunicipalitiesUseCase } from '../application/list-municipalities.use-case';
import type { UpdateMunicipalityUseCase } from '../application/update-municipality.use-case';

export class MunicipalityController {
  constructor(
    private readonly createMunicipalityUseCase: CreateMunicipalityUseCase,
    private readonly listMunicipalitiesUseCase: ListMunicipalitiesUseCase,
    private readonly getMunicipalityUseCase: GetMunicipalityUseCase,
    private readonly updateMunicipalityUseCase: UpdateMunicipalityUseCase,
    private readonly deleteMunicipalityUseCase: DeleteMunicipalityUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const municipality = await this.createMunicipalityUseCase.execute(req.body);
    res.status(201).json(municipality);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const province = req.query.province as string | undefined;
    const municipalities = await this.listMunicipalitiesUseCase.execute(province);
    res.status(200).json(municipalities);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const municipality = await this.getMunicipalityUseCase.execute(req.params.id);
    res.status(200).json(municipality);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const municipality = await this.updateMunicipalityUseCase.execute(req.params.id, req.body);
    res.status(200).json(municipality);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.deleteMunicipalityUseCase.execute(req.params.id);
    res.status(204).send();
  };
}
