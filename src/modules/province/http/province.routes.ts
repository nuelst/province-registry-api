import { Router } from 'express';
import { asyncHandler } from '../../../shared/middlewares/async-handler';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
import { validate } from '../../../shared/middlewares/validate.middleware';
import { MongoMunicipalityRepository } from '../../municipality/infrastructure/mongo-municipality.repository';
import { CreateProvinceUseCase } from '../application/create-province.use-case';
import { DeleteProvinceUseCase } from '../application/delete-province.use-case';
import { GetProvinceUseCase } from '../application/get-province.use-case';
import { ListProvincesUseCase } from '../application/list-provinces.use-case';
import { UpdateProvinceUseCase } from '../application/update-province.use-case';
import { MongoProvinceRepository } from '../infrastructure/mongo-province.repository';
import { ProvinceController } from './province.controller';
import { createProvinceSchema, provinceIdParamSchema, updateProvinceSchema } from './province.schema';

const provinceRepository = new MongoProvinceRepository();
const municipalityRepository = new MongoMunicipalityRepository();

const controller = new ProvinceController(
  new CreateProvinceUseCase(provinceRepository),
  new ListProvincesUseCase(provinceRepository),
  new GetProvinceUseCase(provinceRepository),
  new UpdateProvinceUseCase(provinceRepository),
  new DeleteProvinceUseCase(provinceRepository, municipalityRepository),
);

const router = Router();

/**
 * @openapi
 * /provinces:
 *   post:
 *     tags: [Provinces]
 *     summary: Criar uma nova província
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProvince'
 *     responses:
 *       201:
 *         description: Província criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProvinceResponse'
 *       400:
 *         description: Dados inválidos (code "VALIDATION_ERROR")
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
 *         description: Província já existe (code "PROVINCE_ALREADY_EXISTS")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, validate(createProvinceSchema), asyncHandler(controller.create));

/**
 * @openapi
 * /provinces:
 *   get:
 *     tags: [Provinces]
 *     summary: Listar todas as províncias
 *     responses:
 *       200:
 *         description: Lista de províncias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProvinceResponse'
 */
router.get('/', asyncHandler(controller.list));

/**
 * @openapi
 * /provinces/{id}:
 *   get:
 *     tags: [Provinces]
 *     summary: Consultar província por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Província encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProvinceResponse'
 *       404:
 *         description: Província não encontrada (code "PROVINCE_NOT_FOUND")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validate(provinceIdParamSchema), asyncHandler(controller.getById));

/**
 * @openapi
 * /provinces/{id}:
 *   put:
 *     tags: [Provinces]
 *     summary: Atualizar província
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
 *             $ref: '#/components/schemas/UpdateProvince'
 *     responses:
 *       200:
 *         description: Província atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProvinceResponse'
 *       401:
 *         description: Não autenticado (codes "MISSING_TOKEN", "INVALID_TOKEN")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Província não encontrada (code "PROVINCE_NOT_FOUND")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Nome já existente (code "PROVINCE_ALREADY_EXISTS")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authMiddleware, validate(updateProvinceSchema), asyncHandler(controller.update));

/**
 * @openapi
 * /provinces/{id}:
 *   delete:
 *     tags: [Provinces]
 *     summary: Remover província
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
 *         description: Província removida
 *       400:
 *         description: Província possui municípios associados (code "PROVINCE_HAS_MUNICIPALITIES")
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
 *         description: Província não encontrada (code "PROVINCE_NOT_FOUND")
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authMiddleware, validate(provinceIdParamSchema), asyncHandler(controller.remove));

export { router as provinceRoutes };
