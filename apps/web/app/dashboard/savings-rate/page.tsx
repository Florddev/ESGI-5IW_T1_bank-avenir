'use client';

import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Textarea } from '@workspace/ui-react/components/textarea';
import { useState } from 'react';

export default function SavingsRatePage() {
    const [currentRate, setCurrentRate] = useState('2.5');
    const [newRate, setNewRate] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setIsUpdating(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Taux d'épargne</h2>
                <p className="text-muted-foreground">Modifiez le taux d'intérêt appliqué aux comptes d'épargne</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Taux actuel</h3>
                    <p className="text-5xl font-bold text-primary">{currentRate}%</p>
                    <p className="text-xs text-muted-foreground mt-2">Par an</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Comptes d'épargne actifs</h3>
                    <p className="text-5xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-2">Seront notifiés</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Dernière modification</h3>
                    <p className="text-2xl font-bold">--/--/----</p>
                    <p className="text-xs text-muted-foreground mt-2">Date</p>
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Modifier le taux d'épargne</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="newRate">Nouveau taux annuel (%)</Label>
                        <Input
                            id="newRate"
                            type="number"
                            step="0.01"
                            value={newRate}
                            onChange={(e) => setNewRate(e.target.value)}
                            placeholder="Ex: 3.0"
                            required
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Le taux est appliqué quotidiennement sur les comptes d'épargne
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="message">Message de notification</Label>
                        <Textarea
                            id="message"
                            value={notificationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                            placeholder="Message qui sera envoyé à tous les clients possédant un compte d'épargne..."
                            rows={4}
                            required
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Ce message sera envoyé comme notification à tous les détenteurs de comptes d'épargne
                        </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Attention</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            La modification du taux d'épargne :
                        </p>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside mt-2 space-y-1">
                            <li>Sera appliquée immédiatement à tous les comptes d'épargne</li>
                            <li>Déclenchera l'envoi d'une notification à tous les clients concernés</li>
                            <li>Ne peut pas être annulée (mais peut être modifiée à nouveau)</li>
                        </ul>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? 'Modification en cours...' : 'Modifier le taux'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => {
                            setNewRate('');
                            setNotificationMessage('');
                        }}>
                            Réinitialiser
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Historique des modifications</h3>
                <div className="space-y-3">
                    <div className="p-12 text-center text-muted-foreground">
                        <p>Aucune modification enregistrée</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Fonctionnement</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li>Le taux est appliqué quotidiennement sur le solde de fin de journée</li>
                    <li>Les intérêts sont calculés prorata temporis (au prorata du temps)</li>
                    <li>Les intérêts sont versés automatiquement sur le compte d'épargne</li>
                    <li>Formule: Intérêts quotidiens = Solde × (Taux annuel / 365)</li>
                </ul>
            </div>
        </div>
    );
}
