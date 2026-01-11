import { useMemo } from 'react';

interface LoanCalculationParams {
    principal: number;
    annualInterestRate: number;
    insuranceRate: number;
    durationMonths: number;
}

interface LoanCalculationResult {
    monthlyPayment: number;
    totalCost: number;
    totalInterest: number;
}

export function useLoanCalculation(params: Partial<LoanCalculationParams>): LoanCalculationResult | null {
    return useMemo(() => {
        const { principal, annualInterestRate, insuranceRate, durationMonths } = params;

        if (
            !principal ||
            principal <= 0 ||
            annualInterestRate === undefined ||
            annualInterestRate < 0 ||
            insuranceRate === undefined ||
            insuranceRate < 0 ||
            !durationMonths ||
            durationMonths <= 0
        ) {
            return null;
        }

        const monthlyInterestRate = annualInterestRate / 100 / 12;
        const monthlyInsuranceRate = insuranceRate / 100 / 12;

        let monthlyPayment: number;

        if (monthlyInterestRate === 0) {
            monthlyPayment = principal / durationMonths;
        } else {
            const factor = Math.pow(1 + monthlyInterestRate, durationMonths);
            monthlyPayment = (principal * monthlyInterestRate * factor) / (factor - 1);
        }

        monthlyPayment += principal * monthlyInsuranceRate;

        const totalCost = monthlyPayment * durationMonths;
        const totalInterest = totalCost - principal;

        return {
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalCost: Math.round(totalCost * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100,
        };
    }, [params.principal, params.annualInterestRate, params.insuranceRate, params.durationMonths]);
}
