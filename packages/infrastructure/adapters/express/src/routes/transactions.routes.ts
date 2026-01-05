import { Router } from 'express';
import { TransactionsController } from '../controllers';
import { asyncHandler, requireAuth } from '../middleware';

const router = Router();
const controller = new TransactionsController();

// GET /api/transactions/account/:accountId - Get account transactions
router.get('/account/:accountId', requireAuth, asyncHandler(async (req, res) => {
  const transactions = await controller.getAccountTransactions(req.params.accountId);
  res.json({ success: true, data: transactions });
}));

// POST /api/transactions/transfer - Transfer money
router.post('/transfer', requireAuth, asyncHandler(async (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  const transaction = await controller.transfer(fromAccountId, toAccountId, amount);
  res.status(201).json({ success: true, data: transaction });
}));

// POST /api/transactions/deposit - Deposit money
router.post('/deposit', requireAuth, asyncHandler(async (req, res) => {
  const { accountId, amount } = req.body;
  const transaction = await controller.deposit(accountId, amount);
  res.status(201).json({ success: true, data: transaction });
}));

// POST /api/transactions/withdraw - Withdraw money
router.post('/withdraw', requireAuth, asyncHandler(async (req, res) => {
  const { accountId, amount } = req.body;
  const transaction = await controller.withdraw(accountId, amount);
  res.status(201).json({ success: true, data: transaction });
}));

export default router;
