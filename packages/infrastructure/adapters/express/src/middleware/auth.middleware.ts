import { Request, Response, NextFunction } from 'express';
import { container, TOKENS } from '@workspace/shared/di';
import { IAuthService } from '@workspace/application/ports';

export interface AuthContext {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
}

export function extractAuth(req: Request): AuthContext | null {
  const token = req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
  
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

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const auth = extractAuth(req);
  
  if (!auth) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }
  
  req.auth = auth;
  next();
}
