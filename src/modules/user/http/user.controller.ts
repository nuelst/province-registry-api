import type { Request, Response } from 'express';
import type { DeleteUserUseCase } from '../application/delete-user.use-case';
import type { GetUserUseCase } from '../application/get-user.use-case';
import type { ListUsersUseCase } from '../application/list-users.use-case';
import type { RegisterUserUseCase } from '../application/register-user.use-case';
import type { UpdateUserUseCase } from '../application/update-user.use-case';

export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const user = await this.registerUserUseCase.execute(req.body);
    res.status(201).json(user);
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.listUsersUseCase.execute();
    res.status(200).json(users);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const user = await this.getUserUseCase.execute(req.params.id);
    res.status(200).json(user);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const user = await this.updateUserUseCase.execute(req.params.id, req.body);
    res.status(200).json(user);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.deleteUserUseCase.execute(req.params.id);
    res.status(204).send();
  };
}
