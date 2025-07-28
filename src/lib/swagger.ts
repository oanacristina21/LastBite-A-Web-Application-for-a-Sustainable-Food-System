import swaggerUi from 'swagger-ui-express';
import express from 'express';
import { createServer } from 'http';
import { swaggerSpec } from './swaggerSpec.js';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = createServer(app);
server.listen(3001, () => {
  console.log('Swagger Docs on http://localhost:3001/api-docs');
});
