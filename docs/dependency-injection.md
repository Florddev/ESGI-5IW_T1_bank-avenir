# Guide d'Utilisation - Dependency Injection

## Table des matières

- [Guide d'Utilisation - Dependency Injection](#guide-dutilisation---dependency-injection)
    - [Table des matières](#table-des-matières)
    - [Introduction](#introduction)
        - [Cas d'usage concrets](#cas-dusage-concrets)
    - [Concepts de Base](#concepts-de-base)
        - [Décorateur @UseCase](#décorateur-usecase)
        - [Décorateur @Injectable](#décorateur-injectable)
        - [Décorateur @Inject](#décorateur-inject)
    - [Création de Use Cases](#création-de-use-cases)
        - [Use Case Simple](#use-case-simple)
        - [Use Case avec Multiples Dépendances](#use-case-avec-multiples-dépendances)
    - [Création de Services](#création-de-services)
        - [Service Client (Database, API, etc.)](#service-client-database-api-etc)
        - [Service Métier](#service-métier)
    - [Création de Repositories](#création-de-repositories)
        - [Repository avec Client Injectable](#repository-avec-client-injectable)
    - [Configuration des Modules](#configuration-des-modules)
        - [Création d'un Module](#création-dun-module)
        - [Enregistrement Multiple de Repositories](#enregistrement-multiple-de-repositories)
    - [Configuration d'une Application](#configuration-dune-application)
        - [Application avec Supabase](#application-avec-supabase)
        - [Application avec MongoDB](#application-avec-mongodb)
        - [Application Hybride](#application-hybride)
    - [Utilisation dans les Handlers](#utilisation-dans-les-handlers)
        - [Next.js API Routes](#nextjs-api-routes)
        - [Express Controllers](#express-controllers)
        - [Nuxt Server Routes](#nuxt-server-routes)
    - [Tests](#tests)
        - [Test d'un Use Case](#test-dun-use-case)
        - [Test d'un Repository](#test-dun-repository)
    - [Patterns Avancés](#patterns-avancés)
        - [Override de Dépendances](#override-de-dépendances)
        - [Scopes Isolés](#scopes-isolés)
    - [Quand Utiliser](#quand-utiliser)
        - [Utilisez @UseCase quand](#utilisez-usecase-quand)
        - [Utilisez @Injectable quand](#utilisez-injectable-quand)
        - [Utilisez un Module quand](#utilisez-un-module-quand)
        - [Utilisez l'Override quand](#utilisez-loverride-quand)
        - [N'utilisez PAS la DI quand](#nutilisez-pas-la-di-quand)

---

## Introduction

Le système de Dependency Injection (DI) de NextStack permet de découpler les composants de votre application et facilite le changement d'implémentation sans modifier le code métier.

### Cas d'usage concrets

**Scénario 1 : Changer de base de données**
Vous développez avec Supabase en local, mais votre client veut MongoDB en production. Avec la DI, vous changez une ligne de config, pas 50 fichiers.

**Scénario 2 : Tests unitaires**
Vous voulez tester votre logique métier sans vraie base de données. La DI permet d'injecter des mocks facilement.

**Scénario 3 : Plusieurs applications**
Une app web Next.js et une app mobile Ionic partagent la même logique métier mais utilisent des bases de données différentes.

---

## Concepts de Base

### Décorateur @UseCase

Le décorateur `@UseCase` marque une classe comme use case et l'enregistre automatiquement dans le conteneur DI. Les use cases sont toujours des singletons.

```typescript
import { UseCase, Inject, TOKENS } from '@nextstack/shared/di';
import type { IUserRepository } from '@nextstack/application/ports/repositories';

@UseCase()
export class DeleteUserUseCase {
    constructor(@Inject(TOKENS.IUserRepository) private userRepository: IUserRepository) {}

    async execute(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.delete(userId);
    }
}
```

### Décorateur @Injectable

Le décorateur `@Injectable` marque une classe comme injectable. Utilisé pour les services et repositories qui ne sont pas des use cases.

```typescript
import { Injectable } from '@nextstack/shared/di';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseClientService {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    }

    from(table: string) {
        return this.client.from(table);
    }

    get auth() {
        return this.client.auth;
    }
}
```

### Décorateur @Inject

Le décorateur `@Inject` spécifie quelle dépendance injecter dans le constructeur. Toujours utilisé avec un token du fichier `TOKENS`.

```typescript
import { Injectable, Inject } from '@nextstack/shared/di';
import { SupabaseClientService } from '../supabase.client';

@Injectable()
export class SupabaseUserRepository {
    constructor(@Inject(SupabaseClientService) private client: SupabaseClientService) {}

    async findById(id: string) {
        const { data } = await this.client.from('users').select('*').eq('id', id).single();
        return data;
    }
}
```

---

## Création de Use Cases

### Use Case Simple

Un use case avec une seule dépendance.

```typescript
import { UseCase, Inject, TOKENS } from '@nextstack/shared/di';
import type { IProductRepository } from '@nextstack/application/ports/repositories';
import type { ProductResponseDto } from '@nextstack/application/dtos';

@UseCase()
export class ListProductsUseCase {
    constructor(
        @Inject(TOKENS.IProductRepository)
        private productRepository: IProductRepository
    ) {}

    async execute(): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findAll();
        return products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            createdAt: product.createdAt,
        }));
    }
}
```

### Use Case avec Multiples Dépendances

Un use case complexe avec plusieurs dépendances.

```typescript
import { UseCase, Inject, TOKENS } from '@nextstack/shared/di';
import type {
    IOrderRepository,
    IProductRepository,
    IUserRepository,
} from '@nextstack/application/ports/repositories';
import type { IPaymentService, IEmailService } from '@nextstack/application/ports/services';
import type { CreateOrderDto, OrderResponseDto } from '@nextstack/application/dtos';

@UseCase()
export class CreateOrderUseCase {
    constructor(
        @Inject(TOKENS.IOrderRepository) private orderRepository: IOrderRepository,
        @Inject(TOKENS.IProductRepository)
        private productRepository: IProductRepository,
        @Inject(TOKENS.IUserRepository) private userRepository: IUserRepository,
        @Inject(TOKENS.IPaymentService) private paymentService: IPaymentService,
        @Inject(TOKENS.IEmailService) private emailService: IEmailService
    ) {}

    async execute(dto: CreateOrderDto): Promise<OrderResponseDto> {
        const user = await this.userRepository.findById(dto.userId);
        if (!user) throw new Error('User not found');

        const product = await this.productRepository.findById(dto.productId);
        if (!product) throw new Error('Product not found');

        const payment = await this.paymentService.charge({
            amount: product.price,
            currency: 'EUR',
            customerId: user.id,
        });

        const order = await this.orderRepository.create({
            userId: dto.userId,
            productId: dto.productId,
            amount: product.price,
            paymentId: payment.id,
        });

        await this.emailService.sendEmail(
            user.email,
            'Order Confirmation',
            `Your order #${order.id} has been confirmed`
        );

        return {
            id: order.id,
            userId: order.userId,
            productId: order.productId,
            amount: order.amount,
            status: 'confirmed',
            createdAt: order.createdAt,
        };
    }
}
```

---

## Création de Services

### Service Client (Database, API, etc.)

Services qui gèrent les connexions aux ressources externes.

```typescript
import { Injectable } from '@nextstack/shared/di';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoDBClientService {
    private client: MongoClient;
    private db: Db;

    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI!);
        this.db = this.client.db(process.env.MONGODB_DB_NAME || 'nextstack');
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    collection(name: string) {
        return this.db.collection(name);
    }

    async close(): Promise<void> {
        await this.client.close();
    }
}
```

### Service Métier

Services qui implémentent une logique métier transverse.

```typescript
import { Injectable, Inject } from '@nextstack/shared/di';
import bcrypt from 'bcrypt';
import { JWTClientService } from './jwt.client';
import type { IAuthService } from '@nextstack/application/ports/services';

@Injectable()
export class JWTAuthService implements IAuthService {
    constructor(@Inject(JWTClientService) private jwtClient: JWTClientService) {}

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    generateToken(payload: { userId: string; email: string }): string {
        return this.jwtClient.sign(payload, '7d');
    }

    verifyToken(token: string): { userId: string; email: string } {
        return this.jwtClient.verify(token);
    }
}
```

---

## Création de Repositories

### Repository avec Client Injectable

Pattern recommandé : injecter le client plutôt que le créer.

```typescript
import { Injectable, Inject } from '@nextstack/shared/di';
import { SupabaseClientService } from '../supabase.client';
import type { IOrderRepository } from '@nextstack/application/ports/repositories';
import { Order } from '@nextstack/domain/entities';

@Injectable()
export class SupabaseOrderRepository implements IOrderRepository {
    constructor(
        @Inject(SupabaseClientService)
        private supabaseClient: SupabaseClientService
    ) {}

    async findById(id: string): Promise<Order | null> {
        const { data, error } = await this.supabaseClient
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return new Order(
            data.id,
            data.user_id,
            data.product_id,
            data.amount,
            data.status,
            new Date(data.created_at)
        );
    }

    async create(data: {
        userId: string;
        productId: string;
        amount: number;
        paymentId: string;
    }): Promise<Order> {
        const { data: order, error } = await this.supabaseClient
            .from('orders')
            .insert({
                user_id: data.userId,
                product_id: data.productId,
                amount: data.amount,
                payment_id: data.paymentId,
                status: 'pending',
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return new Order(
            order.id,
            order.user_id,
            order.product_id,
            order.amount,
            order.status,
            new Date(order.created_at)
        );
    }

    async updateStatus(id: string, status: string): Promise<void> {
        const { error } = await this.supabaseClient.from('orders').update({ status }).eq('id', id);

        if (error) throw new Error(error.message);
    }
}
```

---

## Configuration des Modules

### Création d'un Module

Un module encapsule la configuration d'un ensemble cohérent de services.

```typescript
import { DependencyContainer } from 'tsyringe';
import { TOKENS } from '@nextstack/shared/di';
import { SupabaseClientService } from './supabase.client';
import { SupabaseUserRepository } from './repositories/supabase-user.repository';
import { SupabaseProductRepository } from './repositories/supabase-product.repository';
import { SupabaseOrderRepository } from './repositories/supabase-order.repository';

export function registerSupabaseModule(container: DependencyContainer): void {
    container.registerSingleton(SupabaseClientService, SupabaseClientService);
    container.registerSingleton(TOKENS.IUserRepository, SupabaseUserRepository);
    container.registerSingleton(TOKENS.IProductRepository, SupabaseProductRepository);
    container.registerSingleton(TOKENS.IOrderRepository, SupabaseOrderRepository);
}
```

### Enregistrement Multiple de Repositories

Pour un module avec plusieurs repositories partageant le même client.

```typescript
import { DependencyContainer } from 'tsyringe';
import { TOKENS } from '@nextstack/shared/di';
import { MongoDBClientService } from './mongodb.client';
import { MongoDBUserRepository } from './repositories/mongodb-user.repository';
import { MongoDBProductRepository } from './repositories/mongodb-product.repository';
import { MongoDBOrderRepository } from './repositories/mongodb-order.repository';
import { MongoDBCategoryRepository } from './repositories/mongodb-category.repository';

export function registerMongoDBModule(container: DependencyContainer): void {
    const mongoClient = new MongoDBClientService();
    mongoClient.connect();

    container.registerInstance(MongoDBClientService, mongoClient);
    container.registerSingleton(TOKENS.IUserRepository, MongoDBUserRepository);
    container.registerSingleton(TOKENS.IProductRepository, MongoDBProductRepository);
    container.registerSingleton(TOKENS.IOrderRepository, MongoDBOrderRepository);
    container.registerSingleton(TOKENS.ICategoryRepository, MongoDBCategoryRepository);
}
```

---

## Configuration d'une Application

### Application avec Supabase

Configuration typique pour une application Next.js avec Supabase.

```typescript
import 'reflect-metadata';
import { container, autoRegisterUseCases } from '@nextstack/shared/di';
import { registerSupabaseModule } from '@nextstack/db-supabase';
import { registerJWTModule } from '@nextstack/service-auth-jwt';
import { registerSendGridModule } from '@nextstack/service-email-sendgrid';
import { registerStripeModule } from '@nextstack/service-payment-stripe';
import '@nextstack/application/use-cases';

export function setupDependencies() {
    registerSupabaseModule(container);
    registerJWTModule(container);
    registerSendGridModule(container);
    registerStripeModule(container);
    autoRegisterUseCases(container);
}
```

### Application avec MongoDB

Configuration typique pour une application Express avec MongoDB.

```typescript
import 'reflect-metadata';
import { container, autoRegisterUseCases } from '@nextstack/shared/di';
import { registerMongoDBModule } from '@nextstack/db-mongodb';
import { registerJWTModule } from '@nextstack/service-auth-jwt';
import { registerResendModule } from '@nextstack/service-email-resend';
import { registerStripeModule } from '@nextstack/service-payment-stripe';
import '@nextstack/application/use-cases';

export function setupDependencies() {
    registerMongoDBModule(container);
    registerJWTModule(container);
    registerResendModule(container);
    registerStripeModule(container);
    autoRegisterUseCases(container);
}
```

### Application Hybride

Application avec plusieurs sources de données.

```typescript
import 'reflect-metadata';
import { container, autoRegisterUseCases, TOKENS } from '@nextstack/shared/di';
import { registerSupabaseModule } from '@nextstack/db-supabase';
import { MongoDBClientService } from '@nextstack/db-mongodb';
import { MongoDBProductRepository } from '@nextstack/db-mongodb/repositories';
import { registerJWTModule } from '@nextstack/service-auth-jwt';
import '@nextstack/application/use-cases';

export function setupDependencies() {
    registerSupabaseModule(container);

    const mongoClient = new MongoDBClientService();
    mongoClient.connect();
    container.registerInstance(MongoDBClientService, mongoClient);
    container.registerSingleton(TOKENS.IProductRepository, MongoDBProductRepository);

    registerJWTModule(container);
    autoRegisterUseCases(container);
}
```

---

## Utilisation dans les Handlers

### Next.js API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { container } from '@nextstack/shared/di';
import { CreateOrderUseCase, GetOrderUseCase } from '@nextstack/application';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const useCase = container.resolve(CreateOrderUseCase);
        const order = await useCase.execute(body);
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const useCase = container.resolve(GetOrderUseCase);
        const order = await useCase.execute(params.id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
```

### Express Controllers

```typescript
import { Request, Response, NextFunction } from 'express';
import { container } from '@nextstack/shared/di';
import {
    CreateOrderUseCase,
    GetOrderUseCase,
    UpdateOrderStatusUseCase,
} from '@nextstack/application';

export class OrderController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const useCase = container.resolve(CreateOrderUseCase);
            const order = await useCase.execute(req.body);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const useCase = container.resolve(GetOrderUseCase);
            const order = await useCase.execute(req.params.id);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const useCase = container.resolve(UpdateOrderStatusUseCase);
            await useCase.execute({
                orderId: req.params.id,
                status: req.body.status,
            });
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
```

### Nuxt Server Routes

```typescript
import { container } from '@nextstack/shared/di';
import { CreateOrderUseCase, GetOrderUseCase } from '@nextstack/application';

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;

    if (method === 'POST') {
        try {
            const body = await readBody(event);
            const useCase = container.resolve(CreateOrderUseCase);
            const order = await useCase.execute(body);
            return order;
        } catch (error) {
            throw createError({
                statusCode: 400,
                message: error.message,
            });
        }
    }

    if (method === 'GET') {
        try {
            const id = getRouterParam(event, 'id');
            const useCase = container.resolve(GetOrderUseCase);
            const order = await useCase.execute(id);

            if (!order) {
                throw createError({
                    statusCode: 404,
                    message: 'Order not found',
                });
            }

            return order;
        } catch (error) {
            throw createError({
                statusCode: 500,
                message: error.message,
            });
        }
    }
});
```

---

## Tests

### Test d'un Use Case

```typescript
import 'reflect-metadata';
import { container, TOKENS } from '@nextstack/shared/di';
import { CreateOrderUseCase } from '@nextstack/application';
import type {
    IOrderRepository,
    IProductRepository,
    IUserRepository,
} from '@nextstack/application/ports/repositories';
import type { IPaymentService, IEmailService } from '@nextstack/application/ports/services';

describe('CreateOrderUseCase', () => {
    let mockOrderRepository: jest.Mocked<IOrderRepository>;
    let mockProductRepository: jest.Mocked<IProductRepository>;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockPaymentService: jest.Mocked<IPaymentService>;
    let mockEmailService: jest.Mocked<IEmailService>;

    beforeEach(() => {
        container.reset();

        mockOrderRepository = {
            findById: jest.fn(),
            create: jest.fn(),
            updateStatus: jest.fn(),
        } as any;

        mockProductRepository = {
            findById: jest.fn(),
            findAll: jest.fn(),
        } as any;

        mockUserRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
        } as any;

        mockPaymentService = {
            charge: jest.fn(),
        } as any;

        mockEmailService = {
            sendEmail: jest.fn(),
        } as any;

        container.registerInstance(TOKENS.IOrderRepository, mockOrderRepository);
        container.registerInstance(TOKENS.IProductRepository, mockProductRepository);
        container.registerInstance(TOKENS.IUserRepository, mockUserRepository);
        container.registerInstance(TOKENS.IPaymentService, mockPaymentService);
        container.registerInstance(TOKENS.IEmailService, mockEmailService);
        container.registerSingleton(CreateOrderUseCase, CreateOrderUseCase);
    });

    it('should create order successfully', async () => {
        const mockUser = { id: '1', email: 'user@example.com' };
        const mockProduct = { id: '1', name: 'Product', price: 100 };
        const mockPayment = { id: 'pay_123' };
        const mockOrder = {
            id: 'order_123',
            userId: '1',
            productId: '1',
            amount: 100,
            status: 'pending',
            createdAt: new Date(),
        };

        mockUserRepository.findById.mockResolvedValue(mockUser as any);
        mockProductRepository.findById.mockResolvedValue(mockProduct as any);
        mockPaymentService.charge.mockResolvedValue(mockPayment as any);
        mockOrderRepository.create.mockResolvedValue(mockOrder as any);
        mockEmailService.sendEmail.mockResolvedValue(undefined);

        const useCase = container.resolve(CreateOrderUseCase);
        const result = await useCase.execute({
            userId: '1',
            productId: '1',
        });

        expect(result.id).toBe('order_123');
        expect(mockPaymentService.charge).toHaveBeenCalledWith({
            amount: 100,
            currency: 'EUR',
            customerId: '1',
        });
        expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });
});
```

### Test d'un Repository

```typescript
import 'reflect-metadata';
import { container } from '@nextstack/shared/di';
import { SupabaseClientService } from '@nextstack/db-supabase';
import { SupabaseOrderRepository } from '@nextstack/db-supabase/repositories';

describe('SupabaseOrderRepository', () => {
    let mockSupabaseClient: jest.Mocked<SupabaseClientService>;
    let repository: SupabaseOrderRepository;

    beforeEach(() => {
        container.reset();

        mockSupabaseClient = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn(),
        } as any;

        container.registerInstance(SupabaseClientService, mockSupabaseClient);
        container.registerSingleton(SupabaseOrderRepository, SupabaseOrderRepository);
        repository = container.resolve(SupabaseOrderRepository);
    });

    it('should find order by id', async () => {
        const mockData = {
            id: 'order_123',
            user_id: '1',
            product_id: '1',
            amount: 100,
            status: 'confirmed',
            created_at: '2024-01-01T00:00:00Z',
        };

        mockSupabaseClient.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
                }),
            }),
        } as any);

        const order = await repository.findById('order_123');

        expect(order).toBeDefined();
        expect(order?.id).toBe('order_123');
        expect(order?.amount).toBe(100);
    });
});
```

---

## Patterns Avancés

### Override de Dépendances

Remplacer une implémentation par une autre pour un cas spécifique.

```typescript
import 'reflect-metadata';
import { container, autoRegisterUseCases, TOKENS } from '@nextstack/shared/di';
import { registerSupabaseModule } from '@nextstack/db-supabase';
import { registerJWTModule } from '@nextstack/service-auth-jwt';
import { MockEmailService } from './mocks/mock-email.service';
import '@nextstack/application/use-cases';

export function setupDependencies() {
    registerSupabaseModule(container);
    registerJWTModule(container);

    if (process.env.NODE_ENV === 'development') {
        container.register(TOKENS.IEmailService, { useClass: MockEmailService });
    }

    autoRegisterUseCases(container);
}
```

### Scopes Isolés

Créer un conteneur enfant pour isoler des dépendances.

```typescript
import { container } from '@nextstack/shared/di';
import { TOKENS } from '@nextstack/shared/di';
import { InMemoryUserRepository } from './repositories/in-memory-user.repository';
import { CreateUserUseCase } from '@nextstack/application';

export async function runIsolatedTest() {
    const childContainer = container.createChildContainer();

    childContainer.register(TOKENS.IUserRepository, {
        useClass: InMemoryUserRepository,
    });
    childContainer.registerSingleton(CreateUserUseCase, CreateUserUseCase);

    const useCase = childContainer.resolve(CreateUserUseCase);
    await useCase.execute({
        email: 'test@example.com',
        password: 'password123',
    });

    childContainer.reset();
}
```

---

## Quand Utiliser

### Utilisez @UseCase quand

- Vous créez une opération métier (créer un utilisateur, passer une commande)
- La classe contient de la logique applicative
- La classe doit être testable indépendamment

### Utilisez @Injectable quand

- Vous créez un service technique (client DB, API externe)
- Vous créez un service métier transverse (auth, email)
- Vous créez un repository

### Utilisez un Module quand

- Vous avez plusieurs classes liées (client + repositories)
- Vous voulez simplifier la configuration des apps
- Vous voulez rendre un ensemble de services réutilisable

### Utilisez l'Override quand

- Environnement de développement vs production
- Tests avec mocks
- Feature flags nécessitant différentes implémentations

### N'utilisez PAS la DI quand

- Classes utilitaires pures sans état (pure functions)
- Constants ou configurations simples
- Classes qui ne changent jamais d'implémentation
