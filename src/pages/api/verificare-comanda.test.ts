// src/pages/api/verificare-comanda.test.ts

import { PrismaClient } from '@prisma/client';
import handler from './verificare-comanda'; 
import { createMocks } from 'node-mocks-http'; 
import type { NextApiRequest, NextApiResponse } from 'next'; 

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    cOMANDA: {
      findFirst: jest.fn(), 
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe('/api/verificare-comanda', () => {

  beforeEach(() => {
    (prisma.cOMANDA.findFirst as jest.Mock).mockClear();
  });

  it('ar trebui sa returneze datele comenzii si status 200 pentru un cod valid', async () => {
    const comandaMock = { NrComanda: 'CMD-123', StatusComanda: 'Gata', CodRidicare: 'VALID123' };

    (prisma.cOMANDA.findFirst as jest.Mock).mockResolvedValue(comandaMock);

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        cod: 'VALID123',
      },
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(comandaMock);
    expect(prisma.cOMANDA.findFirst).toHaveBeenCalledWith({
      where: { CodRidicare: 'VALID123' },
      select: {
          NrComanda: true,
          StatusComanda: true,
          CodRidicare: true,
      }
    });
  });

  it('ar trebui sa returneze un mesaj de eroare si status 404 pentru un cod invalid', async () => {
    (prisma.cOMANDA.findFirst as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        cod: 'INVALID', 
      },
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({ mesaj: 'Comandă inexistentă' });
    expect(prisma.cOMANDA.findFirst).toHaveBeenCalledWith({
      where: { CodRidicare: 'INVALID' },
      select: {
          NrComanda: true,
          StatusComanda: true,
          CodRidicare: true,
      }
    });
  });
});