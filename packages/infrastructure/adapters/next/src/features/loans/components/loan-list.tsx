'use client';

import type { LoanDto } from '@workspace/application/dtos';
import { Button } from '@workspace/ui-react/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';

interface LoanListProps {
    loans: LoanDto[];
    onProcessPayment?: (loanId: string) => void;
}

export function LoanList({ loans, onProcessPayment }: LoanListProps) {
    if (loans.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucun prêt trouvé
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {loans.map((loan) => (
                <Card key={loan.id}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Prêt {loan.id.slice(0, 8)}</span>
                            <span className={`text-sm px-2 py-1 rounded ${
                                loan.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                loan.status === 'DEFAULTED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {loan.status}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Capital initial:</span>
                            <span className="font-medium">{loan.principal.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Capital restant:</span>
                            <span className="font-medium">{loan.remainingPrincipal.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Mensualité:</span>
                            <span className="font-medium">{loan.monthlyPayment.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Durée:</span>
                            <span className="font-medium">{loan.remainingMonths} / {loan.durationMonths} mois</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Taux:</span>
                            <span className="font-medium">{loan.annualInterestRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Prochaine échéance:</span>
                            <span className="font-medium">
                                {new Date(loan.nextPaymentDate).toLocaleDateString()}
                            </span>
                        </div>
                        {onProcessPayment && loan.status === 'ACTIVE' && (
                            <Button 
                                onClick={() => onProcessPayment(loan.id)} 
                                className="w-full mt-4"
                            >
                                Effectuer le paiement
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
