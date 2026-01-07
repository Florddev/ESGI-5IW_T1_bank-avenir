import { Router } from 'express';
import { AdminController } from '../controllers';
import { asyncHandler, requireAuth, requireRole, UserRole } from '../middleware';

const router = Router();
const controller = new AdminController();

router.get('/users', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const users = await controller.getAllUsers();
  res.json({ success: true, data: users });
}));

// POST /api/admin/users - Create user
router.post('/users', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  const user = await controller.createUser(email, password, firstName, lastName, role);
  res.status(201).json({ success: true, data: user });
}));

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
  const user = await controller.updateUser(req.params.id, firstName, lastName);
  res.json({ success: true, data: user });
}));

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  await controller.deleteUser(req.params.id);
  res.json({ success: true, data: { message: 'Utilisateur supprimé' } });
}));

// POST /api/admin/users/:id/ban - Ban user
router.post('/users/:id/ban', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  await controller.banUser(req.params.id);
  res.json({ success: true, data: { message: 'Utilisateur banni' } });
}));

// PATCH /api/admin/savings/rate - Update savings rate
router.patch('/savings/rate', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const { newRate, message } = req.body;
  const result = await controller.updateSavingsRate(newRate, message);
  res.json({ success: true, data: result });
}));

// POST /api/admin/savings/apply-interest - Apply savings interest
router.post('/savings/apply-interest', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const result = await controller.applySavingsInterest();
  res.json({ success: true, data: result });
}));

export default router;
