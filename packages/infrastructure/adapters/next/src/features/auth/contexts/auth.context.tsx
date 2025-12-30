'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthClient } from '@workspace/adapter-next/client';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const authClient = getAuthClient();
                const userData = await authClient.getCurrentUser();
                setUser({
                    id: userData.userId,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                });
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
