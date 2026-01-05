import { Router } from 'express';
import { AccountsController } from '../controllers';
import { asyncHandler, requireAuth, AuthenticatedRequest } from '../middleware';

const router = Router();
const controller = new AccountsController();

// GET /api/accounts - List user accounts
router.get('/', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const accounts = await controller.listUserAccounts(req.auth!.userId);
  res.json({ success: true, data: accounts });
}));

// POST /api/accounts - Create account
router.post('/', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { customName, type, savingsRate } = req.body;
  const account = await controller.createAccount(
    req.auth!.userId,
    customName,
    type,
    savingsRate
  );
  res.status(201).json({ success: true, data: account });
}));

// GET /api/accounts/:id - Get specific account
router.get('/:id', requireAuth, asyncHandler(async (req, res) => {
  const account = await controller.getAccount(req.params.id);
  res.json({ success: true, data: account });
}));

// PUT /api/accounts/:id/name - Update account name
router.put('/:id/name', requireAuth, asyncHandler(async (req, res) => {
  const { customName } = req.body;
  const account = await controller.updateAccountName(req.params.id, customName);
  res.json({ success: true, data: account });
}));

// DELETE /api/accounts/:id - Delete account
router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  await controller.deleteAccount(req.params.id);
  res.json({ success: true, data: { message: 'Compte supprimé' } });
}));

export default router;
