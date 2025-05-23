// src/lib/auth.ts
import { NextRequest } from 'next/server';
import { verifyToken } from './utils/jwt';

export function getTokenDataFromRequest(req: NextRequest) {
  const token = req.cookies.get('orchedule-auth')?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    return decoded as { id: string; name: string; part: string; role: string };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
