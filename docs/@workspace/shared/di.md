# @workspace/shared/di

Système de Dependency Injection minimaliste et production-ready basé sur [tsyringe](https://github.com/microsoft/tsyringe).

## 📦 Structure

```
di/
├── decorators.ts      # Décorateurs DI (@UseCase, @Repository, @Injectable, @Inject)
├── tokens.ts          # Tokens d'injection (TOKENS)
├── index.ts           # Container + Exports publics
└── README.md          # Documentation
```

## 🎯 Décorateurs

### `@UseCase()`

Marque une classe comme use case. Auto-résolvable sans enregistrement manuel.

```typescript
import { UseCase, Inject, TOKENS } from '@workspace/shared/di';

@UseCase()
export class CreateUserUseCase {
  constructor(
    @Inject(TOKENS.IUserRepository) private userRepo: IUserRepository
  ) {}

  async execute(data: CreateUserDto) {
    // Logic...
  }
}
```

**Utilisation :**
```typescript
import { container } from '@workspace/shared/di';

const useCase = container.resolve(CreateUserUseCase);
await useCase.execute(data);
```

### `@Repository(token)`

Marque une classe comme repository et enregistre ses métadonnées pour l'auto-enregistrement.

```typescript
import { Repository, TOKENS } from '@workspace/shared/di';
import { IUserRepository } from '@workspace/application/ports';

@Repository(TOKENS.IUserRepository)
export class InMemoryUserRepository implements IUserRepository {
  // Implementation...
}
```

**Enregistrement :**
```typescript
import { container, REPOSITORY_METADATA } from '@workspace/shared/di';
import './repositories'; // Import side-effect pour exécuter les décorateurs

export function registerInMemoryModule() {
  REPOSITORY_METADATA.forEach(({ implementation, token }) => {
    container.registerSingleton(token, implementation);
  });
}
```

### `@Injectable()`

Marque une classe comme injectable (pour services génériques).

```typescript
import { Injectable } from '@workspace/shared/di';

@Injectable()
export class EmailService {
  send(to: string, subject: string, body: string) {
    // Implementation...
  }
}
```

### `@Inject(token)`

Injecte une dépendance dans le constructeur.

```typescript
constructor(
  @Inject(TOKENS.IUserRepository) private userRepo: IUserRepository,
  @Inject(TOKENS.IEmailService) private emailService: IEmailService
) {}
```

## 🔧 Configuration

### Setup DI

```typescript
// apps/web/lib/di.ts
import 'reflect-metadata';
import { registerInMemoryModule } from '@workspace/db-in-memory';
import { container, TOKENS } from '@workspace/shared/di';
import { AuthJwtService } from '@workspace/service-auth-jwt';
import { EmailConsoleService } from '@workspace/service-email-console';

let isInitialized = false;

function initializeDI() {
  if (isInitialized) return;

  // Enregistrer les repositories
  registerInMemoryModule();

  // Enregistrer les services
  container.registerSingleton(TOKENS.IAuthService, AuthJwtService);
  container.registerSingleton(TOKENS.IEmailService, EmailConsoleService);

  isInitialized = true;
}

initializeDI();
```

### Créer un module d'enregistrement

```typescript
// packages/infrastructure/data/my-db/src/register-module.ts
import { container, REPOSITORY_METADATA } from '@workspace/shared/di';
import './repositories'; // Side-effect import

export function registerMyDbModule(): void {
  REPOSITORY_METADATA.forEach(({ implementation, token }) => {
    container.registerSingleton(token, implementation);
  });
}
```

## 📋 Tokens

Les tokens sont définis dans `tokens.ts` :

```typescript
export const TOKENS = {
  // Repositories
  IUserRepository: 'IUserRepository',
  IAccountRepository: 'IAccountRepository',
  // ...
  
  // Services
  IAuthService: 'IAuthService',
  IEmailService: 'IEmailService',
  // ...
} as const;
```

## 🎨 Patterns

### Pattern 1 : Use Case (Auto-résolution par classe)

```typescript
// ✅ Résolution directe par classe
@UseCase()
class CreateUserUseCase { }

container.resolve(CreateUserUseCase); // Fonctionne automatiquement
```

### Pattern 2 : Repository (Résolution par token string)

```typescript
// ✅ Enregistrement explicite avec token
@Repository(TOKENS.IUserRepository)
class UserRepository implements IUserRepository { }

container.registerSingleton(TOKENS.IUserRepository, UserRepository);
container.resolve(TOKENS.IUserRepository);
```

### Pattern 3 : Service (Enregistrement manuel)

```typescript
// ✅ Service sans décorateur spécial
@Injectable()
class EmailService { }

container.registerSingleton(TOKENS.IEmailService, EmailService);
container.resolve(TOKENS.IEmailService);
```

## 🚀 Avantages

- ✅ **Minimal** : Seulement 5 fichiers, ~150 lignes de code
- ✅ **Type-safe** : TypeScript strict
- ✅ **Zero config** : Les use cases s'auto-enregistrent
- ✅ **Scalable** : Pattern repository auto-découvert
- ✅ **Testable** : Facile à mocker avec tsyringe
- ✅ **Production-ready** : Pas de code mort, bien documenté

## 🧪 Tests

```typescript
import 'reflect-metadata';
import { container } from '@workspace/shared/di';

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('should create a user', async () => {
    // Mock repository
    const mockRepo = { save: jest.fn() };
    container.registerInstance(TOKENS.IUserRepository, mockRepo);

    // Resolve use case
    const useCase = container.resolve(CreateUserUseCase);
    await useCase.execute(data);

    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

## 📚 Documentation tsyringe

Pour plus d'informations sur tsyringe : https://github.com/microsoft/tsyringe
