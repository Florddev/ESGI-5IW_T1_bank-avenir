import { runMigrations } from './schema';

try {
    runMigrations();
    process.exit(0);
} catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
}
