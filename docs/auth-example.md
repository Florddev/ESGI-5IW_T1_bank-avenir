# Implémentation Complète avec @workspace

## 📁 Structure

```
packages/
├── domain/
├── application/
├── shared/
├── infrastructure/
│   ├── database/
│   │   └── supabase/
│   └── adapters/
│       ├── common/
│       └── nextjs/
└── ui/
```

## 📄 Code

### 1. Domain Layer

**`packages/domain/src/entities/user.entity.ts`**

```typescript
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    private _password: Password,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole,
    public readonly isConfirmed: boolean,
    public readonly confirmationToken: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get password(): Password {
    return this._password;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  changePassword(newPassword: Password): void {
    this._password = newPassword;
  }

  confirmAccount(): User {
    return new User(
      this.id,
      this.email,
      this._password,
      this.firstName,
      this.lastName,
      this.role,
      true,
      null,
      this.createdAt,
      new Date()
    );
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email.value,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      isConfirmed: this.isConfirmed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
```

**`packages/domain/src/errors/user.errors.ts`**

```typescript
export class UserNotFoundError extends Error {
  constructor(identifier?: string) {
    super(identifier ? `User not found: ${identifier}` : 'User not found');
    this.name = 'UserNotFoundError';
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Email already exists: ${email}`);
    this.name = 'EmailAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class InvalidConfirmationTokenError extends Error {
  constructor() {
    super('Invalid or expired confirmation token');
    this.name = 'InvalidConfirmationTokenError';
  }
}

export class AccountNotConfirmedError extends Error {
  constructor() {
    super('Account not confirmed. Please check your email.');
    this.name = 'AccountNotConfirmedError';
  }
}
```

---

### 2. Application Layer

**`packages/application/src/dtos/auth/auth.dto.ts`**

```typescript
export interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ConfirmAccountDto {
  token: string;
}

export interface AuthResponseDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}
```

**`packages/application/src/ports/repositories/user.repository.interface.ts`**

```typescript
import { User, UserRole } from '@workspace/domain/entities';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByConfirmationToken(token: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByRole(role: UserRole): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
```

**`packages/application/src/ports/services/auth.service.interface.ts`**

```typescript
export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateToken(payload: { userId: string; email: string; role: string }): string;
  verifyToken(token: string): { userId: string; email: string; role: string };
}
```

**`packages/application/src/ports/services/email.service.interface.ts`**

```typescript
export interface IEmailService {
  sendConfirmationEmail(email: string, token: string): Promise<void>;
  sendWelcomeEmail(email: string, firstName: string): Promise<void>;
}
```

**`packages/application/src/use-cases/auth/register.usecase.ts`**

```typescript
import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { User, UserRole } from '@workspace/domain/entities';
import { Email } from '@workspace/domain/value-objects';
import { Password } from '@workspace/domain/value-objects';
import { EmailAlreadyExistsError } from '@workspace/domain/errors';
import type { IUserRepository } from '../../ports/repositories/user.repository.interface';
import type { IAuthService } from '../../ports/services/auth.service.interface';
import type { IEmailService } from '../../ports/services/email.service.interface';
import type { RegisterUserDto, AuthResponseDto } from '../../dtos/auth/auth.dto';

@UseCase()
export class RegisterUserUseCase {
  constructor(
    @Inject(TOKENS.IUserRepository) private userRepository: IUserRepository,
    @Inject(TOKENS.IAuthService) private authService: IAuthService,
    @Inject(TOKENS.IEmailService) private emailService: IEmailService
  ) {}

  async execute(dto: RegisterUserDto): Promise<AuthResponseDto> {
    const email = new Email(dto.email);
    
    const existingUser = await this.userRepository.findByEmail(email.value);
    if (existingUser) {
      throw new EmailAlreadyExistsError(email.value);
    }

    const hashedPassword = await this.authService.hashPassword(dto.password);
    const confirmationToken = crypto.randomUUID();
    
    const user = new User(
      crypto.randomUUID(),
      email,
      new Password(hashedPassword),
      dto.firstName,
      dto.lastName,
      UserRole.USER,
      false,
      confirmationToken,
      new Date(),
      new Date()
    );

    await this.userRepository.save(user);

    await this.emailService.sendConfirmationEmail(user.email.value, confirmationToken);

    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email.value,
      role: user.role,
    });

    return {
      userId: user.id,
      email: user.email.value,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token,
    };
  }
}
```

**`packages/application/src/use-cases/auth/login.usecase.ts`**

```typescript
import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { InvalidCredentialsError, AccountNotConfirmedError } from '@workspace/domain/errors';
import type { IUserRepository } from '../../ports/repositories/user.repository.interface';
import type { IAuthService } from '../../ports/services/auth.service.interface';
import type { LoginDto, AuthResponseDto } from '../../dtos/auth/auth.dto';

@UseCase()
export class LoginUseCase {
  constructor(
    @Inject(TOKENS.IUserRepository) private userRepository: IUserRepository,
    @Inject(TOKENS.IAuthService) private authService: IAuthService
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!user.isConfirmed) {
      throw new AccountNotConfirmedError();
    }

    const isPasswordValid = await this.authService.comparePassword(
      dto.password,
      user.password.value
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email.value,
      role: user.role,
    });

    return {
      userId: user.id,
      email: user.email.value,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token,
    };
  }
}
```

**`packages/application/src/use-cases/auth/confirm-account.usecase.ts`**

```typescript
import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { InvalidConfirmationTokenError } from '@workspace/domain/errors';
import type { IUserRepository } from '../../ports/repositories/user.repository.interface';
import type { IEmailService } from '../../ports/services/email.service.interface';
import type { ConfirmAccountDto } from '../../dtos/auth/auth.dto';

@UseCase()
export class ConfirmAccountUseCase {
  constructor(
    @Inject(TOKENS.IUserRepository) private userRepository: IUserRepository,
    @Inject(TOKENS.IEmailService) private emailService: IEmailService
  ) {}

  async execute(dto: ConfirmAccountDto): Promise<void> {
    const user = await this.userRepository.findByConfirmationToken(dto.token);
    if (!user) {
      throw new InvalidConfirmationTokenError();
    }

    const confirmedUser = user.confirmAccount();
    await this.userRepository.save(confirmedUser);

    await this.emailService.sendWelcomeEmail(
      confirmedUser.email.value,
      confirmedUser.firstName
    );
  }
}
```

**`packages/application/src/use-cases/auth/index.ts`**

```typescript
export { RegisterUserUseCase } from './register.usecase';
export { LoginUseCase } from './login.usecase';
export { ConfirmAccountUseCase } from './confirm-account.usecase';
```

---

### 3. Infrastructure - Database

**`packages/infrastructure/database/supabase/src/repositories/supabase-user.repository.ts`**

```typescript
import { Injectable, Inject } from '@workspace/shared/di';
import { SupabaseClientService } from '../supabase.client';
import { User, UserRole } from '@workspace/domain/entities';
import { Email } from '@workspace/domain/value-objects';
import { Password } from '@workspace/domain/value-objects';
import type { IUserRepository } from '@workspace/application/ports/repositories';

@Injectable()
export class SupabaseUserRepository implements IUserRepository {
  constructor(
    @Inject(SupabaseClientService) private supabaseClient: SupabaseClientService
  ) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByConfirmationToken(token: string): Promise<User | null> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('confirmation_token', token)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*');

    if (error) throw new Error(error.message);
    return data.map(this.mapToDomain);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('role', role);

    if (error) throw new Error(error.message);
    return data.map(this.mapToDomain);
  }

  async save(user: User): Promise<User> {
    const model = this.mapToModel(user);

    const { data: existing } = await this.supabaseClient
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existing) {
      const { data, error } = await this.supabaseClient
        .from('users')
        .update(model)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return this.mapToDomain(data);
    } else {
      const { data, error } = await this.supabaseClient
        .from('users')
        .insert(model)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return this.mapToDomain(data);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  private mapToDomain(data: any): User {
    return new User(
      data.id,
      new Email(data.email),
      new Password(data.password),
      data.first_name,
      data.last_name,
      data.role as UserRole,
      data.is_confirmed,
      data.confirmation_token,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  private mapToModel(user: User): any {
    return {
      id: user.id,
      email: user.email.value,
      password: user.password.value,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      is_confirmed: user.isConfirmed,
      confirmation_token: user.confirmationToken,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }
}
```

**`packages/infrastructure/database/supabase/src/supabase.module.ts`**

```typescript
import { DependencyContainer } from 'tsyringe';
import { TOKENS } from '@workspace/shared/di';
import { SupabaseClientService } from './supabase.client';
import { SupabaseUserRepository } from './repositories/supabase-user.repository';

export function registerSupabaseModule(container: DependencyContainer): void {
  container.registerSingleton(SupabaseClientService, SupabaseClientService);
  container.registerSingleton(TOKENS.IUserRepository, SupabaseUserRepository);
}
```

---

### 4. Infrastructure - Adapters Common

**`packages/infrastructure/adapters/common/src/validators/auth.validator.ts`**

```typescript
import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre'),
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const confirmAccountSchema = z.object({
  token: z.string().uuid('Token invalide'),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ConfirmAccountInput = z.infer<typeof confirmAccountSchema>;
```

---

### 5. Infrastructure - Adapters Next.js

**`packages/infrastructure/adapters/nextjs/src/client/config/routes.config.ts`**

```typescript
export interface RoutesConfig {
  auth: {
    register: string;
    login: string;
    logout: string;
    confirmAccount: string;
    me: string;
  };
  users: {
    list: string;
    detail: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
}

export const defaultRoutes: RoutesConfig = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    confirmAccount: '/api/auth/confirm',
    me: '/api/auth/me',
  },
  users: {
    list: '/api/users',
    detail: (id) => `/api/users/${id}`,
    update: (id) => `/api/users/${id}`,
    delete: (id) => `/api/users/${id}`,
  },
};

export class RoutesConfigService {
  constructor(private config: RoutesConfig = defaultRoutes) {}

  getRoutes(): RoutesConfig {
    return this.config;
  }

  getAuthRoutes() {
    return this.config.auth;
  }

  getUserRoutes() {
    return this.config.users;
  }
}
```

**`packages/infrastructure/adapters/nextjs/src/client/base.client.ts`**

```typescript
export class BaseClient {
  protected async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  protected async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }
}
```

**`packages/infrastructure/adapters/nextjs/src/client/auth.client.ts`**

```typescript
import { Injectable, Inject } from '@workspace/shared/di';
import { BaseClient } from './base.client';
import { RoutesConfigService } from './config/routes.config';
import type { RegisterUserInput, LoginInput, ConfirmAccountInput } from '@workspace/adapter-common/validators';
import type { AuthResponseDto } from '@workspace/application/dtos';

@Injectable()
export class AuthClient extends BaseClient {
  constructor(
    @Inject(RoutesConfigService) private routesConfig: RoutesConfigService
  ) {
    super();
  }

  async register(data: RegisterUserInput): Promise<AuthResponseDto> {
    const routes = this.routesConfig.getAuthRoutes();
    return this.post<AuthResponseDto>(routes.register, data);
  }

  async login(data: LoginInput): Promise<AuthResponseDto> {
    const routes = this.routesConfig.getAuthRoutes();
    return this.post<AuthResponseDto>(routes.login, data);
  }

  async confirmAccount(data: ConfirmAccountInput): Promise<void> {
    const routes = this.routesConfig.getAuthRoutes();
    return this.post<void>(routes.confirmAccount, data);
  }

  async logout(): Promise<void> {
    const routes = this.routesConfig.getAuthRoutes();
    return this.post<void>(routes.logout);
  }

  async getCurrentUser(): Promise<{ user: Omit<AuthResponseDto, 'token'> }> {
    const routes = this.routesConfig.getAuthRoutes();
    return this.get(routes.me);
  }
}
```

**`packages/infrastructure/adapters/nextjs/src/api/handlers/auth.handler.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { container } from '@workspace/shared/di';
import { RegisterUserUseCase, LoginUseCase, ConfirmAccountUseCase } from '@workspace/application';
import { registerUserSchema, loginSchema, confirmAccountSchema } from '@workspace/adapter-common/validators';
import { 
  InvalidCredentialsError, 
  EmailAlreadyExistsError, 
  AccountNotConfirmedError,
  InvalidConfirmationTokenError 
} from '@workspace/domain/errors';

export async function registerHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerUserSchema.parse(body);

    const useCase = container.resolve(RegisterUserUseCase);
    const result = await useCase.execute(validatedData);

    const response = NextResponse.json(result, { status: 201 });
    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}

export async function loginHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const useCase = container.resolve(LoginUseCase);
    const result = await useCase.execute(validatedData);

    const response = NextResponse.json(result);
    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    if (error instanceof AccountNotConfirmedError) {
      return NextResponse.json(
        { error: 'Compte non confirmé. Vérifiez vos emails.' },
        { status: 403 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}

export async function confirmAccountHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = confirmAccountSchema.parse(body);

    const useCase = container.resolve(ConfirmAccountUseCase);
    await useCase.execute(validatedData);

    return NextResponse.json({ message: 'Compte confirmé avec succès' });
  } catch (error) {
    if (error instanceof InvalidConfirmationTokenError) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Confirm account error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la confirmation du compte' },
      { status: 500 }
    );
  }
}

export async function logoutHandler() {
  const response = NextResponse.json({ message: 'Déconnecté avec succès' });
  response.cookies.delete('auth_token');
  return response;
}
```

**`packages/infrastructure/adapters/nextjs/src/ui/hooks/useRegister.ts`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { container } from '@workspace/shared/di';
import { AuthClient } from '../../client/auth.client';
import type { RegisterUserInput } from '@workspace/adapter-common/validators';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const router = useRouter();

  const register = async (data: RegisterUserInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const authClient = container.resolve(AuthClient);
      const result = await authClient.register(data);
      
      setUser({
        id: result.userId,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
      });
      
      router.push('/confirm-email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
```

**`packages/infrastructure/adapters/nextjs/src/ui/hooks/useLogin.ts`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { container } from '@workspace/shared/di';
import { AuthClient } from '../../client/auth.client';
import type { LoginInput } from '@workspace/adapter-common/validators';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const router = useRouter();

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const authClient = container.resolve(AuthClient);
      const result = await authClient.login(data);
      
      setUser({
        id: result.userId,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
      });
      
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
```

**`packages/infrastructure/adapters/nextjs/src/ui/components/auth/RegisterForm.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRegister } from '../../hooks/useRegister';
import { Button } from '@workspace/ui-react';
import { Input } from '@workspace/ui-react';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { register, isLoading, error } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({ email, password, firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            Prénom
          </label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Nom
          </label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Mot de passe
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Inscription...' : 'S\'inscrire'}
      </Button>
    </form>
  );
}
```

---

### 6. Tokens

**`packages/shared/src/di/tokens.ts`**

```typescript
export const TOKENS = {
  IUserRepository: 'IUserRepository',
  
  IAuthService: 'IAuthService',
  IEmailService: 'IEmailService',
} as const;

export type Token = typeof TOKENS[keyof typeof TOKENS];
```

---

### 7. Configuration App

**`apps/web-nextjs-supabase/src/config/dependencies.config.ts`**

```typescript
import 'reflect-metadata';
import { container, autoRegisterUseCases } from '@workspace/shared/di';
import { registerSupabaseModule } from '@workspace/db-supabase';
import { registerJWTModule } from '@workspace/service-auth-jwt';
import { registerSendGridModule } from '@workspace/service-email-sendgrid';
import { RoutesConfigService, defaultRoutes } from '@workspace/adapter-nextjs/client/config';
import { AuthClient } from '@workspace/adapter-nextjs/client';
import '@workspace/application/use-cases';

export function setupDependencies() {
  registerSupabaseModule(container);
  registerJWTModule(container);
  registerSendGridModule(container);

  container.registerInstance(
    RoutesConfigService,
    new RoutesConfigService(defaultRoutes)
  );

  container.registerSingleton(AuthClient, AuthClient);

  autoRegisterUseCases(container);
}
```

**`apps/web-nextjs-supabase/src/app/api/auth/register/route.ts`**

```typescript
import { registerHandler } from '@workspace/adapter-nextjs/api/handlers';

export const POST = registerHandler;
```

**`apps/web-nextjs-supabase/src/app/api/auth/login/route.ts`**

```typescript
import { loginHandler } from '@workspace/adapter-nextjs/api/handlers';

export const POST = loginHandler;
```

**`apps/web-nextjs-supabase/src/app/api/auth/confirm/route.ts`**

```typescript
import { confirmAccountHandler } from '@workspace/adapter-nextjs/api/handlers';

export const POST = confirmAccountHandler;
```

**`apps/web-nextjs-supabase/src/app/(auth)/register/page.tsx`**

```typescript
import { RegisterForm } from '@workspace/adapter-nextjs/ui/components';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Créer un compte
          </h2>
        </div>
        <RegisterForm />
        <div className="text-center">
          <a href="/login" className="text-blue-600 hover:underline">
            Déjà un compte ? Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}
```