import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export enum UserRole {
  CLIENT = 'CLIENT',
  ADVISOR = 'ADVISOR',
  DIRECTOR = 'DIRECTOR',
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.auth.role as UserRole)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
}
