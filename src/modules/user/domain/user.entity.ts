export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  province: string;
  municipality: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
  province: string;
  municipality: string;
  role?: Role;
}

export interface UpdateUserProps {
  name?: string;
  email?: string;
  password?: string;
  province?: string;
  municipality?: string;
  role?: Role;
}

export function toSafeUser(user: User): SafeUser {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}
