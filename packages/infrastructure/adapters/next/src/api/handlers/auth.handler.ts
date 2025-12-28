import { NextRequest, NextResponse } from 'next/server';
import { container } from '@workspace/shared/di';
import {
    RegisterUserUseCase,
    LoginUseCase,
    ConfirmAccountUseCase,
} from '@workspace/application/use-cases/auth';
import type { RegisterUserDto, LoginDto, ConfirmAccountDto } from '@workspace/application/dtos';
import { DomainError } from '@workspace/domain/errors';

export async function registerHandler(request: NextRequest): Promise<NextResponse> {
    try {
        const body: RegisterUserDto = await request.json();
        const useCase = container.resolve(RegisterUserUseCase);
        await useCase.execute(body);

        return NextResponse.json(
            { message: 'Inscription réussie. Veuillez vérifier vos emails pour confirmer votre compte.' },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof DomainError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function loginHandler(request: NextRequest): Promise<NextResponse> {
    try {
        const body: LoginDto = await request.json();
        const useCase = container.resolve(LoginUseCase);
        const authResponse = await useCase.execute(body);

        const response = NextResponse.json(authResponse, { status: 200 });

        response.cookies.set('auth_token', authResponse.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (error) {
        if (error instanceof DomainError) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function confirmAccountHandler(request: NextRequest): Promise<NextResponse> {
    try {
        const body: ConfirmAccountDto = await request.json();
        const useCase = container.resolve(ConfirmAccountUseCase);
        await useCase.execute(body);

        return NextResponse.json(
            { message: 'Compte confirmé avec succès. Vous pouvez maintenant vous connecter.' },
            { status: 200 },
        );
    } catch (error) {
        if (error instanceof DomainError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error('Confirmation error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function logoutHandler(request: NextRequest): Promise<NextResponse> {
    const response = NextResponse.json({ message: 'Déconnexion réussie' }, { status: 200 });
    response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });
    return response;
}
