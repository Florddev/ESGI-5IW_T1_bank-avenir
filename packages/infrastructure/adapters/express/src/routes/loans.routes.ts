import { Router } from 'express';
import { LoansController } from '../controllers';
import { asyncHandler, requireAuth, requireRole, UserRole, AuthenticatedRequest } from '../middleware';

const router = Router();
const controller = new LoansController();

// GET /api/loans - Get user's loans
router.get('/', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const loans = await controller.getUserLoans(req.auth!.userId);
  res.json({ success: true, data: loans });
}));

// POST /api/loans - Create a loan
router.post('/', requireAuth, requireRole([UserRole.ADVISOR, UserRole.DIRECTOR]), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { userId, accountId, principal, annualInterestRate, insuranceRate, durationMonths } = req.body;
  const loan = await controller.createLoan(
    userId,
    req.auth!.userId, // advisorId
    accountId,
    principal,
    annualInterestRate,
    insuranceRate,
    durationMonths
  );
  res.status(201).json({ success: true, data: loan });
}));

// GET /api/loans/advisor/:advisorId - Get loans by advisor
router.get('/advisor/:advisorId', requireAuth, requireRole([UserRole.ADVISOR, UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const loans = await controller.getAdvisorLoans(req.params.advisorId);
  res.json({ success: true, data: loans });
}));

// GET /api/loans/client/:clientId - Get loans by client
router.get('/client/:clientId', requireAuth, requireRole([UserRole.ADVISOR, UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const loans = await controller.getClientLoans(req.params.clientId);
  res.json({ success: true, data: loans });
}));

// POST /api/loans/:id/payment - Process loan payment
router.post('/:id/payment', requireAuth, asyncHandler(async (req, res) => {
  const result = await controller.processPayment(req.params.id);
  res.json({ success: true, data: result });
}));

// POST /api/loans/:id/default - Mark loan as defaulted
router.post('/:id/default', requireAuth, requireRole([UserRole.ADVISOR, UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const result = await controller.markDefaulted(req.params.id);
  res.json({ success: true, data: result });
}));

export default router;
