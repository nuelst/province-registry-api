import { Router } from 'express';
import { asyncHandler } from '../../../shared/middlewares/async-handler';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
import { validate } from '../../../shared/middlewares/validate.middleware';
import { MongoProvinceRepository } from '../../province/infrastructure/mongo-province.repository';
import { MongoUserRepository } from '../../user/infrastructure/mongo-user.repository';
import { CreateMunicipalityUseCase } from '../application/create-municipality.use-case';
import { DeleteMunicipalityUseCase } from '../application/delete-municipality.use-case';
import { GetMunicipalityUseCase } from '../application/get-municipality.use-case';
import { ListMunicipalitiesUseCase } from '../application/list-municipalities.use-case';
import { UpdateMunicipalityUseCase } from '../application/update-municipality.use-case';
import { MongoMunicipalityRepository } from '../infrastructure/mongo-municipality.repository';
import { MunicipalityController } from './municipality.controller';
import {
  createMunicipalitySchema,
  listMunicipalitiesQuerySchema,
  municipalityIdParamSchema,
  updateMunicipalitySchema,
} from './municipality.schema';

const municipalityRepository = new MongoMunicipalityRepository();
const provinceRepository = new MongoProvinceRepository();
const userRepository = new MongoUserRepository();

const controller = new MunicipalityController(
  new CreateMunicipalityUseCase(municipalityRepository, provinceRepository),
  new ListMunicipalitiesUseCase(municipalityRepository),
  new GetMunicipalityUseCase(municipalityRepository),
  new UpdateMunicipalityUseCase(municipalityRepository, provinceRepository),
  new DeleteMunicipalityUseCase(municipalityRepository, userRepository),
);

const router = Router();

/**
 * @openapi
 * /municipalities:
 *   post:
 *     tags: [Municipalities]
 *     summary: Criar um novo município
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMunicipality'
 *     responses:
 *       201:
 *         description: Município criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MunicipalityResponse'
 *       400:
 *         description: Província informada não existe (codes "PROVINCE_NOT_FOUND", "VALIDATION_ERROR")
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
 *       409:
 *         description: Município duplicado nesta província (code "MUNICIPALITY_ALREADY_EXISTS")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, validate(createMunicipalitySchema), asyncHandler(controller.create));

/**
 * @openapi
 * /municipalities:
 *   get:
 *     tags: [Municipalities]
 *     summary: Listar municípios (opcionalmente filtrado por província)
 *     parameters:
 *       - in: query
 *         name: province
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de municípios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MunicipalityResponse'
 */
router.get('/', validate(listMunicipalitiesQuerySchema), asyncHandler(controller.list));

/**
 * @openapi
 * /municipalities/{id}:
 *   get:
 *     tags: [Municipalities]
 *     summary: Consultar município por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Município encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MunicipalityResponse'
 *       404:
 *         description: Município não encontrado (code "MUNICIPALITY_NOT_FOUND")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validate(municipalityIdParamSchema), asyncHandler(controller.getById));

/**
 * @openapi
 * /municipalities/{id}:
 *   put:
 *     tags: [Municipalities]
 *     summary: Atualizar município
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
 *             $ref: '#/components/schemas/UpdateMunicipality'
 *     responses:
 *       200:
 *         description: Município atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MunicipalityResponse'
 *       400:
 *         description: Província informada não existe (codes "PROVINCE_NOT_FOUND", "VALIDATION_ERROR")
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
 *       404:
 *         description: Município não encontrado (code "MUNICIPALITY_NOT_FOUND")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Município duplicado nesta província (code "MUNICIPALITY_ALREADY_EXISTS")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authMiddleware, validate(updateMunicipalitySchema), asyncHandler(controller.update));

/**
 * @openapi
 * /municipalities/{id}:
 *   delete:
 *     tags: [Municipalities]
 *     summary: Remover município
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
 *         description: Município removido
 *       400:
 *         description: Município possui utilizadores associados (code "MUNICIPALITY_HAS_USERS")
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
 *       404:
 *         description: Município não encontrado (code "MUNICIPALITY_NOT_FOUND")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authMiddleware, validate(municipalityIdParamSchema), asyncHandler(controller.remove));

export { router as municipalityRoutes };
