import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret123';

type TokenPayload = {
  id: number;
  email: string;
  tip: string;
  clientId?: number;
  restaurantId?: number;
};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}




export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
