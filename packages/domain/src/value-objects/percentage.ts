export class Percentage {
    private readonly value: number;

    private constructor(value: number) {
        if (value < 0 || value > 100) {
            throw new Error('Percentage must be between 0 and 100');
        }
        this.value = Math.round(value * 10000) / 10000;
    }

    static fromValue(value: number): Percentage {
        return new Percentage(value);
    }

    static fromDecimal(decimal: number): Percentage {
        return new Percentage(decimal * 100);
    }

    toDecimal(): number {
        return this.value / 100;
    }

    getValue(): number {
        return this.value;
    }

    equals(other: Percentage): boolean {
        return this.value === other.value;
    }
}
