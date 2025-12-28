export class Password {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static fromPlainText(plainPassword: string): Password {
        if (!Password.isValid(plainPassword)) {
            throw new Error(
                'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
            );
        }
        return new Password(plainPassword);
    }

    static fromHash(hash: string): Password {
        return new Password(hash);
    }

    private static isValid(password: string): boolean {
        if (password.length < 8) {
            return false;
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        return hasUpperCase && hasLowerCase && hasNumbers;
    }

    getValue(): string {
        return this.value;
    }

    toString(): string {
        return this.value;
    }
}
