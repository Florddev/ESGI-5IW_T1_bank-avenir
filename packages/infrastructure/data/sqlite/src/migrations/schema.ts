import { db } from '../database';

export function runMigrations(): void {
    // Create users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('CLIENT', 'DIRECTOR')),
            status TEXT NOT NULL CHECK(status IN ('PENDING', 'ACTIVE', 'BANNED')),
            confirmation_token TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_confirmation_token ON users(confirmation_token);
    `);

    // Create stocks table
    db.exec(`
        CREATE TABLE IF NOT EXISTS stocks (
            id TEXT PRIMARY KEY,
            symbol TEXT UNIQUE NOT NULL,
            company_name TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('AVAILABLE', 'UNAVAILABLE')),
            current_price REAL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
        CREATE INDEX IF NOT EXISTS idx_stocks_status ON stocks(status);
    `);

    // Create accounts table
    db.exec(`
        CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            account_number TEXT UNIQUE NOT NULL,
            account_type TEXT NOT NULL CHECK(account_type IN ('CHECKING', 'SAVINGS')),
            balance REAL NOT NULL DEFAULT 0,
            interest_rate REAL,
            created_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
        CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);
        CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(account_type);
    `);

    // Create transactions table
    db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            account_id TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT')),
            amount REAL NOT NULL,
            description TEXT,
            recipient_account_id TEXT,
            created_at INTEGER NOT NULL,
            FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
            FOREIGN KEY (recipient_account_id) REFERENCES accounts(id) ON DELETE SET NULL
        );
        CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
    `);

    // Create loans table
    db.exec(`
        CREATE TABLE IF NOT EXISTS loans (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            interest_rate REAL NOT NULL,
            duration_months INTEGER NOT NULL,
            monthly_payment REAL NOT NULL,
            remaining_balance REAL NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED')),
            created_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
        CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
    `);

    // Create portfolios table
    db.exec(`
        CREATE TABLE IF NOT EXISTS portfolios (
            id TEXT PRIMARY KEY,
            user_id TEXT UNIQUE NOT NULL,
            created_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
    `);

    // Create portfolio_holdings table
    db.exec(`
        CREATE TABLE IF NOT EXISTS portfolio_holdings (
            portfolio_id TEXT NOT NULL,
            stock_id TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 0,
            average_buy_price REAL NOT NULL,
            PRIMARY KEY (portfolio_id, stock_id),
            FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
            FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
        );
    `);

    // Create orders table
    db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            stock_id TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('BUY', 'SELL')),
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('PENDING', 'EXECUTED', 'CANCELLED')),
            created_at INTEGER NOT NULL,
            executed_at INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_orders_stock_id ON orders(stock_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    `);

    // Create notifications table
    db.exec(`
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            read INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
        CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
    `);

    // Create conversations table
    db.exec(`
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            subject TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('OPEN', 'CLOSED')),
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
        CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
    `);

    // Create messages table
    db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            sender_id TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
    `);

    console.log('✅ SQLite migrations completed successfully');
}
