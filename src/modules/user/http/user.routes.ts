import { Router } from 'express';
import { asyncHandler } from '../../../shared/middlewares/async-handler';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
import { requireRole } from '../../../shared/middlewares/require-role.middleware';
import { requireSelfOrRole } from '../../../shared/middlewares/require-self-or-role.middleware';
import { validate } from '../../../shared/middlewares/validate.middleware';
import { MongoMunicipalityRepository } from '../../municipality/infrastructure/mongo-municipality.repository';
import { MongoProvinceRepository } from '../../province/infrastructure/mongo-province.repository';
import { DeleteUserUseCase } from '../application/delete-user.use-case';
import { GetUserUseCase } from '../application/get-user.use-case';
import { ListUsersUseCase } from '../application/list-users.use-case';
import { RegisterUserUseCase } from '../application/register-user.use-case';
import { UpdateUserUseCase } from '../application/update-user.use-case';
import { BcryptPasswordHasher } from '../infrastructure/bcrypt-password-hasher';
import { MongoUserRepository } from '../infrastructure/mongo-user.repository';
import { UserController } from './user.controller';
import { createUserSchema, updateUserSchema, userIdParamSchema } from './user.schema';

const userRepository = new MongoUserRepository();
const provinceRepository = new MongoProvinceRepository();
const municipalityRepository = new MongoMunicipalityRepository();
const passwordHasher = new BcryptPasswordHasher();

const controller = new UserController(
  new RegisterUserUseCase(userRepository, provinceRepository, municipalityRepository, passwordHasher),
  new ListUsersUseCase(userRepository, provinceRepository, municipalityRepository),
  new GetUserUseCase(userRepository, provinceRepository, municipalityRepository),
  new UpdateUserUseCase(userRepository, provinceRepository, municipalityRepository, passwordHasher),
  new DeleteUserUseCase(userRepository),
);

const router = Router();

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Criar utilizador (apenas admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminCreateUser'
 *     responses:
 *       201:
 *         description: Utilizador criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Província/Município inválido ou inconsistente (codes "PROVINCE_NOT_FOUND", "MUNICIPALITY_NOT_FOUND", "MUNICIPALITY_PROVINCE_MISMATCH", "VALIDATION_ERROR")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado (codes "MISSING_TOKEN", "INVALID_TOKEN")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado (code "FORBIDDEN")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já existente (code "EMAIL_ALREADY_EXISTS")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validate(createUserSchema),
  asyncHandler(controller.create),
);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Listar utilizadores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de utilizadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Não autenticado (codes "MISSING_TOKEN", "INVALID_TOKEN")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authMiddleware, asyncHandler(controller.list));

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Consultar utilizador por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilizador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Não autenticado (codes "MISSING_TOKEN", "INVALID_TOKEN")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilizador não encontrado (code "USER_NOT_FOUND")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authMiddleware, validate(userIdParamSchema), asyncHandler(controller.getById));

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Atualizar utilizador
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Utilizador atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Província/Município inválido ou inconsistente (codes "PROVINCE_NOT_FOUND", "MUNICIPALITY_NOT_FOUND", "MUNICIPALITY_PROVINCE_MISMATCH", "VALIDATION_ERROR")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado (codes "MISSING_TOKEN", "INVALID_TOKEN")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Só o próprio utilizador ou um admin (code "FORBIDDEN")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilizador não encontrado (code "USER_NOT_FOUND")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já existente (code "EMAIL_ALREADY_EXISTS")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  authMiddleware,
  requireSelfOrRole('id', 'admin'),
  validate(updateUserSchema),
  asyncHandler(controller.update),
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Remover utilizador
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Utilizador removido
 *       401:
 *         description: Não autenticado (codes "MISSING_TOKEN", "INVALID_TOKEN")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Só o próprio utilizador ou um admin (code "FORBIDDEN")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilizador não encontrado (code "USER_NOT_FOUND")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id',
  authMiddleware,
  requireSelfOrRole('id', 'admin'),
  validate(userIdParamSchema),
  asyncHandler(controller.remove),
);

export { router as userRoutes };
