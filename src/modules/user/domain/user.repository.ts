import type { UserExistenceChecker } from '../../municipality/application/delete-municipality.use-case';
import type { User } from './user.entity';

export interface CreateUserPersistenceProps {
  name: string;
  email: string;
  passwordHash: string;
  province: string;
  municipality: string;
}

export interface UpdateUserPersistenceProps {
  name?: string;
  email?: string;
  passwordHash?: string;
  province?: string;
  municipality?: string;
}

export interface UserRepository extends UserExistenceChecker {
  create(data: CreateUserPersistenceProps): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserPersistenceProps): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
