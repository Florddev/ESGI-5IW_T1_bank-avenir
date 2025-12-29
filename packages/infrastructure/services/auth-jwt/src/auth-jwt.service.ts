import { Injectable } from '@workspace/shared/di';
import { IAuthService } from '@workspace/application/ports';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthJwtService implements IAuthService {
    private readonly saltRounds = 10;
    private readonly jwtSecret: string;
    private readonly jwtExpiresIn = '7d';

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    generateToken(userId: string, role: string, email: string): string {
        return jwt.sign(
            { userId, role, email },
            this.jwtSecret,
            { expiresIn: this.jwtExpiresIn }
        );
    }

    verifyToken(token: string): { userId: string; role: string; email: string } | null {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as {
                userId: string;
                role: string;
                email: string;
            };
            return decoded;
        } catch {
            return null;
        }
    }
}
