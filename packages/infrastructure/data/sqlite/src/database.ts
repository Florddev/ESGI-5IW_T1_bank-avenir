import Database from 'better-sqlite3';
import { join } from 'path';

export class DatabaseConnection {
    private static instance: Database.Database;

    public static getInstance(): Database.Database {
        if (!DatabaseConnection.instance) {
            const dbPath = process.env.SQLITE_DB_PATH || join(process.cwd(), 'avenir-bank.db');
            DatabaseConnection.instance = new Database(dbPath);
            DatabaseConnection.instance.pragma('journal_mode = WAL');
            DatabaseConnection.instance.pragma('foreign_keys = ON');
        }
        return DatabaseConnection.instance;
    }

    public static close(): void {
        if (DatabaseConnection.instance) {
            DatabaseConnection.instance.close();
        }
    }
}

export const db = DatabaseConnection.getInstance();
