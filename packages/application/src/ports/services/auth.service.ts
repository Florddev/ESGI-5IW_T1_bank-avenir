export interface IAuthService {
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    generateToken(userId: string, role: string): string;
    verifyToken(token: string): { userId: string; role: string } | null;
}
