import swaggerJSDoc from 'swagger-jsdoc';
import { baseUrl, env } from './env';

const objectIdExample = '6a4e7a856c166ae5f85a7950';

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Province Registry API',
    version: '1.0.0',
    description:
      'API RESTful para gestão de utilizadores, províncias e municípios de Angola. ' +
      'Construída com Node.js, TypeScript, Express, MongoDB e Mongoose, seguindo uma ' +
      'arquitetura modular monolítica inspirada em Clean Architecture (domain, application, infrastructure, http).',
  },
  servers: [
    {
      url: `${baseUrl}/api`,
      description: env.NODE_ENV === 'production' ? 'Servidor em produção' : 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Já existe um utilizador com este email' },
          code: { type: 'string', example: 'EMAIL_ALREADY_EXISTS' },
          details: { type: 'object', nullable: true },
        },
      },
      CreateUser: {
        type: 'object',
        required: ['name', 'email', 'password', 'province', 'municipality'],
        properties: {
          name: { type: 'string', example: 'João Silva' },
          email: { type: 'string', example: 'joao@email.com' },
          password: { type: 'string', example: 'password123' },
          province: { type: 'string', example: objectIdExample },
          municipality: { type: 'string', example: '6a563455b28473c835a1b3c1' },
        },
      },
      UpdateUser: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'João Silva' },
          email: { type: 'string', example: 'joao@email.com' },
          password: { type: 'string', example: 'novaPassword123' },
          province: { type: 'string', example: objectIdExample },
          municipality: { type: 'string', example: '6a563455b28473c835a1b3c1' },
          role: {
            type: 'string',
            enum: ['admin', 'user'],
            example: 'user',
            description: 'Apenas um administrador pode alterar este campo.',
          },
        },
      },
      AdminCreateUser: {
        type: 'object',
        required: ['name', 'email', 'password', 'province', 'municipality'],
        properties: {
          name: { type: 'string', example: 'João Silva' },
          email: { type: 'string', example: 'joao@email.com' },
          password: { type: 'string', example: 'password123' },
          province: { type: 'string', example: objectIdExample },
          municipality: { type: 'string', example: '6a563455b28473c835a1b3c1' },
          role: {
            type: 'string',
            enum: ['admin', 'user'],
            example: 'user',
            description: 'Apenas administradores podem definir. Default: user.',
          },
        },
      },
      RelationRef: {
        type: 'object',
        properties: {
          id: { type: 'string', example: objectIdExample },
          name: { type: 'string', example: 'Luanda' },
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: objectIdExample },
          name: { type: 'string', example: 'João Silva' },
          email: { type: 'string', example: 'joao@email.com' },
          province: { $ref: '#/components/schemas/RelationRef' },
          municipality: { $ref: '#/components/schemas/RelationRef' },
          role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'joao@email.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      CreateProvince: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Luanda' },
        },
      },
      UpdateProvince: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Luanda' },
        },
      },
      ProvinceResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: objectIdExample },
          name: { type: 'string', example: 'Luanda' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateMunicipality: {
        type: 'object',
        required: ['name', 'province'],
        properties: {
          name: { type: 'string', example: 'Talatona' },
          province: { type: 'string', example: objectIdExample },
        },
      },
      UpdateMunicipality: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Talatona' },
          province: { type: 'string', example: objectIdExample },
        },
      },
      MunicipalityResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6a563455b28473c835a1b3c1' },
          name: { type: 'string', example: 'Talatona' },
          province: { type: 'string', example: objectIdExample },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./src/modules/**/http/*.routes.ts', './dist/modules/**/http/*.routes.js'],
});
