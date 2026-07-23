import { Router } from 'express';
import { asyncHandler } from '../../../shared/middlewares/async-handler';
import { validate } from '../../../shared/middlewares/validate.middleware';
import { MongoMunicipalityRepository } from '../../municipality/infrastructure/mongo-municipality.repository';
import { MongoProvinceRepository } from '../../province/infrastructure/mongo-province.repository';
import { RegisterUserUseCase } from '../../user/application/register-user.use-case';
import { BcryptPasswordHasher } from '../../user/infrastructure/bcrypt-password-hasher';
import { MongoUserRepository } from '../../user/infrastructure/mongo-user.repository';
import { LoginUseCase } from '../application/login.use-case';
import { JwtTokenProvider } from '../infrastructure/jwt-token-provider';
import { AuthController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.schema';

const userRepository = new MongoUserRepository();
const provinceRepository = new MongoProvinceRepository();
const municipalityRepository = new MongoMunicipalityRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenProvider = new JwtTokenProvider();

const controller = new AuthController(
  new LoginUseCase(userRepository, passwordHasher, tokenProvider),
  new RegisterUserUseCase(userRepository, provinceRepository, municipalityRepository, passwordHasher),
);

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registar um novo utilizador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Utilizador registado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Dados inválidos ou inconsistência entre município e província (codes "PROVINCE_NOT_FOUND", "MUNICIPALITY_NOT_FOUND", "MUNICIPALITY_PROVINCE_MISMATCH", "VALIDATION_ERROR")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já registado (code "EMAIL_ALREADY_EXISTS")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', validate(registerSchema), asyncHandler(controller.register));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autenticar utilizador e obter token de acesso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos (code "VALIDATION_ERROR")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciais inválidas (code "INVALID_CREDENTIALS")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', validate(loginSchema), asyncHandler(controller.login));

export { router as authRoutes };
