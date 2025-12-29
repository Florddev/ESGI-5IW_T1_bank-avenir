import { NextRequest } from 'next/server';
import { container } from '@workspace/shared/di';
import { TOKENS } from '@workspace/shared/di';
import { IAuthService } from '@workspace/application/ports';

export interface AuthContext {
  userId: string;
  email: string;
  role: string;
}

export async function extractAuth(request: NextRequest): Promise<AuthContext | null> {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const authService = container.resolve<IAuthService>(TOKENS.IAuthService);
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return null;
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}

export function requireAuth() {
  return async (request: NextRequest): Promise<AuthContext> => {
    const auth = await extractAuth(request);
    
    if (!auth) {
      throw new Error('Authentication required');
    }
    
    return auth;
  };
}
