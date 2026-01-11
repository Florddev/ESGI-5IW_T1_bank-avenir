'use client';

import { Button } from '@workspace/ui-react/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';
import { useState } from 'react';
import { useAllUsers, useCreateUser } from '../hooks';
import { CreateUserForm } from '../components';
import type { CreateUserFormData } from '@workspace/adapter-common/validators';

export function UsersView() {
    const { users, isLoading, error: fetchError, refetch } = useAllUsers();
    const { createUser, isLoading: isCreating, error: createError } = useCreateUser();

    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleSubmit = async (data: CreateUserFormData) => {
        try {
            await createUser(data);
            setShowCreateForm(false);
            await refetch();
        } catch (err) {
            // Error is handled by the hook
        }
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
                <CreateUserForm
                    onSubmit={handleSubmit}
                    onCancel={() => setShowCreateForm(false)}
                    isLoading={isCreating}
                />
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
                            <h3 className="text-xl font-semibold">Tous les utilisateurs ({users.length})</h3>
                        </div>
                        {isLoading ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>Chargement...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>Aucun utilisateur trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nom</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rôle</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-muted/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.firstName} {user.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="clients" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">
                                Clients ({users.filter(u => u.role === 'CLIENT').length})
                            </h3>
                        </div>
                        {users.filter(u => u.role === 'CLIENT').length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>Aucun client trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nom</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {users.filter(u => u.role === 'CLIENT').map((user) => (
                                            <tr key={user.id} className="hover:bg-muted/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.firstName} {user.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="advisors" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">
                                Conseillers ({users.filter(u => u.role === 'ADVISOR').length})
                            </h3>
                        </div>
                        {users.filter(u => u.role === 'ADVISOR').length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>Aucun conseiller trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nom</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {users.filter(u => u.role === 'ADVISOR').map((user) => (
                                            <tr key={user.id} className="hover:bg-muted/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.firstName} {user.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="directors" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">
                                Directeurs ({users.filter(u => u.role === 'DIRECTOR').length})
                            </h3>
                        </div>
                        {users.filter(u => u.role === 'DIRECTOR').length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>Aucun directeur trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nom</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {users.filter(u => u.role === 'DIRECTOR').map((user) => (
                                            <tr key={user.id} className="hover:bg-muted/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.firstName} {user.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
