export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  province: string;
  municipality: string;
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
}

export interface UpdateUserProps {
  name?: string;
  email?: string;
  password?: string;
  province?: string;
  municipality?: string;
}

export function toSafeUser(user: User): SafeUser {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}
