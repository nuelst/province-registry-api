import type { User } from '../domain/user.entity';
import type {
  CreateUserPersistenceProps,
  UpdateUserPersistenceProps,
  UserRepository,
} from '../domain/user.repository';
import { type UserDocument, UserModel } from './user.model';

function toEntity(doc: UserDocument): User {
  return {
    id: doc.id as string,
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    province: doc.province.toString(),
    municipality: doc.municipality.toString(),
    role: doc.role,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoUserRepository implements UserRepository {
  async create(data: CreateUserPersistenceProps): Promise<User> {
    const doc = await UserModel.create(data);
    return toEntity(doc);
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().select('+passwordHash').sort({ name: 1 });
    return docs.map(toEntity);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).select('+passwordHash');
    return doc ? toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    return doc ? toEntity(doc) : null;
  }

  async update(id: string, data: UpdateUserPersistenceProps): Promise<User | null> {
    const payload = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));

    const doc = await UserModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).select(
      '+passwordHash',
    );
    return doc ? toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async existsByMunicipality(municipalityId: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ municipality: municipalityId });
    return count > 0;
  }
}
