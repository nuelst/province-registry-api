import type { Request, Response } from 'express';
import type { CreateProvinceUseCase } from '../application/create-province.use-case';
import type { DeleteProvinceUseCase } from '../application/delete-province.use-case';
import type { GetProvinceUseCase } from '../application/get-province.use-case';
import type { ListProvincesUseCase } from '../application/list-provinces.use-case';
import type { UpdateProvinceUseCase } from '../application/update-province.use-case';
import type { FindAllProvincesOptions } from '../domain/province.repository';

export class ProvinceController {
  constructor(
    private readonly createProvinceUseCase: CreateProvinceUseCase,
    private readonly listProvincesUseCase: ListProvincesUseCase,
    private readonly getProvinceUseCase: GetProvinceUseCase,
    private readonly updateProvinceUseCase: UpdateProvinceUseCase,
    private readonly deleteProvinceUseCase: DeleteProvinceUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const province = await this.createProvinceUseCase.execute(req.body);
    res.status(201).json(province);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const provinces = await this.listProvincesUseCase.execute(req.query as FindAllProvincesOptions);
    res.status(200).json(provinces);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const province = await this.getProvinceUseCase.execute(req.params.id);
    res.status(200).json(province);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const province = await this.updateProvinceUseCase.execute(req.params.id, req.body);
    res.status(200).json(province);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.deleteProvinceUseCase.execute(req.params.id);
    res.status(204).send();
  };
}
