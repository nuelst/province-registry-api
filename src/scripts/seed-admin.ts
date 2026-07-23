import { MongoMunicipalityRepository } from '../modules/municipality/infrastructure/mongo-municipality.repository';
import { MongoProvinceRepository } from '../modules/province/infrastructure/mongo-province.repository';
import { BcryptPasswordHasher } from '../modules/user/infrastructure/bcrypt-password-hasher';
import { MongoUserRepository } from '../modules/user/infrastructure/mongo-user.repository';
import { connectDatabase, disconnectDatabase } from '../shared/infra/database';

async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Administrador';

  if (!email || !password) {
    console.error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de correr o seed.');
    process.exit(1);
  }

  await connectDatabase();

  const userRepository = new MongoUserRepository();
  const provinceRepository = new MongoProvinceRepository();
  const municipalityRepository = new MongoMunicipalityRepository();
  const passwordHasher = new BcryptPasswordHasher();

  const existingAdmin = await userRepository.findByEmail(email);
  if (existingAdmin) {
    console.log(`Utilizador "${email}" já existe. Nada a fazer.`);
    await disconnectDatabase();
    process.exit(0);
  }

  let provinces = await provinceRepository.findAll();
  if (provinces.length === 0) {
    console.log('Nenhuma província encontrada — a criar província por omissão "Luanda"...');
    await provinceRepository.create({ name: 'Luanda' });
    provinces = await provinceRepository.findAll();
  }
  const province = provinces[0];

  let municipalities = await municipalityRepository.findAll(province.id);
  if (municipalities.length === 0) {
    console.log('Nenhum município encontrado nessa província — a criar município por omissão "Talatona"...');
    await municipalityRepository.create({ name: 'Talatona', province: province.id });
    municipalities = await municipalityRepository.findAll(province.id);
  }
  const municipality = municipalities[0];

  const passwordHash = await passwordHasher.hash(password);

  await userRepository.create({
    name,
    email,
    passwordHash,
    province: province.id,
    municipality: municipality.id,
    role: 'admin',
  });

  console.log(
    `Admin "${email}" criado com sucesso (província: ${province.name}, município: ${municipality.name}).`,
  );
  await disconnectDatabase();
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error('Falha ao correr o seed do admin:', error);
  process.exit(1);
});
