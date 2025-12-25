export class Email {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static fromString(email: string): Email {
        const normalized = email.trim().toLowerCase();

        if (!this.isValid(normalized)) {
            throw new Error('Invalid email format');
        }

        return new Email(normalized);
    }

    private static isValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    toString(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }
}
