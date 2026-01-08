export class IBAN {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(countryCode: string = 'FR'): IBAN {
        const bankCode = this.generateRandomDigits(5);
        const branchCode = this.generateRandomDigits(5);
        const accountNumber = this.generateRandomDigits(11);
        const nationalCheckDigits = this.generateRandomDigits(2);

        const bban = `${bankCode}${branchCode}${accountNumber}${nationalCheckDigits}`;
        const checkDigits = this.calculateCheckDigits(countryCode, bban);

        return new IBAN(`${countryCode}${checkDigits}${bban}`);
    }

    static fromString(value: string): IBAN {
        if (!value || typeof value !== 'string') {
            throw new Error(`Invalid IBAN format: value is ${typeof value} (${value})`);
        }

        const normalized = value.replace(/\s/g, '').toUpperCase();

        if (!this.isValid(normalized)) {
            throw new Error(`Invalid IBAN format: "${normalized}" (length: ${normalized.length})`);
        }

        return new IBAN(normalized);
    }

    private static isValid(iban: string): boolean {
        if (iban.length < 15 || iban.length > 34) {
            return false;
        }

        const rearranged = iban.slice(4) + iban.slice(0, 4);
        const numericString = rearranged
            .split('')
            .map((char) => {
                const code = char.charCodeAt(0);
                return code >= 65 && code <= 90 ? (code - 55).toString() : char;
            })
            .join('');

        return this.mod97(numericString) === 1;
    }

    private static mod97(numericString: string): number {
        let remainder = numericString;
        while (remainder.length > 2) {
            const block = remainder.slice(0, 9);
            remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(block.length);
        }
        return parseInt(remainder, 10) % 97;
    }

    private static calculateCheckDigits(countryCode: string, bban: string): string {
        const rearranged = bban + countryCode + '00';
        const numericString = rearranged
            .split('')
            .map((char) => {
                const code = char.charCodeAt(0);
                return code >= 65 && code <= 90 ? (code - 55).toString() : char;
            })
            .join('');

        const remainder = this.mod97(numericString);
        const checkDigits = 98 - remainder;
        return checkDigits.toString().padStart(2, '0');
    }

    private static generateRandomDigits(length: number): string {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    toString(): string {
        return this.value;
    }

    toFormattedString(): string {
        return this.value.match(/.{1,4}/g)?.join(' ') || this.value;
    }

    equals(other: IBAN): boolean {
        return this.value === other.value;
    }
}
