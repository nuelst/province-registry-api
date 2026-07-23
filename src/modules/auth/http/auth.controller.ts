import type { Request, Response } from 'express';
import type { RegisterUserUseCase } from '../../user/application/register-user.use-case';
import type { LoginUseCase } from '../application/login.use-case';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.loginUseCase.execute(req.body);
    res.status(200).json(result);
  };

  register = async (req: Request, res: Response): Promise<void> => {
    const user = await this.registerUserUseCase.execute(req.body);
    res.status(201).json(user);
  };
}
