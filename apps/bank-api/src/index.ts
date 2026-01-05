import 'reflect-metadata';
import { config } from 'dotenv';
import { startServer } from '@workspace/adapter-express/server';
import './di';

// Load environment variables
config();

const PORT = parseInt(process.env.PORT || '4000', 10);

// Start the Express server
startServer(PORT);
