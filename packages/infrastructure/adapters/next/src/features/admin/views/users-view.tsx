'use client';

import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui-react/components/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';
import { useState } from 'react';

export function UsersView() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('CLIENT');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h2>
                    <p className="text-muted-foreground">Créez, modifiez ou supprimez des comptes utilisateurs</p>
                </div>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    {showCreateForm ? 'Annuler' : '+ Nouvel utilisateur'}
                </Button>
            </div>

            {showCreateForm && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Créer un utilisateur</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Jean"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Nom</Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Dupont"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jean.dupont@example.com"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">Rôle</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLIENT">Client</SelectItem>
                                    <SelectItem value="ADVISOR">Conseiller</SelectItem>
                                    <SelectItem value="DIRECTOR">Directeur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit">Créer l'utilisateur</Button>
                            <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                                Annuler
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="advisors">Conseillers</TabsTrigger>
                    <TabsTrigger value="directors">Directeurs</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Tous les utilisateurs</h3>
                        </div>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Aucun utilisateur trouvé</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="clients" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Clients</h3>
                        </div>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Aucun client trouvé</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="advisors" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Conseillers</h3>
                        </div>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Aucun conseiller trouvé</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="directors" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Directeurs</h3>
                        </div>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Aucun directeur trouvé</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
