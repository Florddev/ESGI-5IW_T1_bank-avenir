'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui-react/components/select';
import { createUserSchema, type CreateUserFormData } from '@workspace/adapter-common/validators';

interface CreateUserFormProps {
    onSubmit: (data: CreateUserFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CreateUserForm({ onSubmit, onCancel, isLoading }: CreateUserFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            role: 'CLIENT',
        },
    });

    const role = watch('role');

    return (
        <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Créer un utilisateur</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                            id="firstName"
                            {...register('firstName')}
                            placeholder="Jean"
                            disabled={isLoading}
                        />
                        {errors.firstName && (
                            <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                            id="lastName"
                            {...register('lastName')}
                            placeholder="Dupont"
                            disabled={isLoading}
                        />
                        {errors.lastName && (
                            <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="jean.dupont@example.com"
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        disabled={isLoading}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Select
                        value={role}
                        onValueChange={(value) => setValue('role', value as 'CLIENT' | 'ADVISOR' | 'DIRECTOR')}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CLIENT">Client</SelectItem>
                            <SelectItem value="ADVISOR">Conseiller</SelectItem>
                            <SelectItem value="DIRECTOR">Directeur</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.role && (
                        <p className="text-sm text-destructive mt-1">{errors.role.message}</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Création...' : "Créer l'utilisateur"}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Annuler
                    </Button>
                </div>
            </form>
        </div>
    );
}
