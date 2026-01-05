import { Router } from 'express';
import authRoutes from './auth.routes';
import accountsRoutes from './accounts.routes';
import transactionsRoutes from './transactions.routes';
import loansRoutes from './loans.routes';
import stocksRoutes from './stocks.routes';
import notificationsRoutes from './notifications.routes';
import conversationsRoutes from './conversations.routes';
import messagesRoutes from './messages.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/accounts', accountsRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/loans', loansRoutes);
router.use('/stocks', stocksRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/conversations', conversationsRoutes);
router.use('/messages', messagesRoutes);
router.use('/admin', adminRoutes);

export default router;
