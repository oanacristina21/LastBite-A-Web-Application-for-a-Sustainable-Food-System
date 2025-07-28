// pages/api/docs.ts
import { NextApiRequest, NextApiResponse } from 'next'
import swaggerJSDoc from 'swagger-jsdoc'

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LastBite API',
      version: '1.0.0',
    },
  },
  apis: ['./src/pages/api/**/*.ts'], // Ajustează dacă e nevoie
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json(swaggerSpec)
}
