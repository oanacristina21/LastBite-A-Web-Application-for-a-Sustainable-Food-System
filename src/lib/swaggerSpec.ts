import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LastBite API',
      version: '1.0.0',
    },
  },
  apis: ['./src/pages/api/**/*.ts'], // corect pentru Prisma/Next.js
});
