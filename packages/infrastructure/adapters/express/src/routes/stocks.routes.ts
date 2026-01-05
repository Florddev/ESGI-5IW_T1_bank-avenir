import { Router } from 'express';
import { StocksController } from '../controllers';
import { asyncHandler, requireAuth, requireRole, UserRole, AuthenticatedRequest } from '../middleware';

const router = Router();
const controller = new StocksController();

// GET /api/stocks - Get all stocks
router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const stocks = await controller.getAllStocks();
  res.json({ success: true, data: stocks });
}));

// POST /api/stocks - Create stock (admin only)
router.post('/', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const { symbol, companyName } = req.body;
  const stock = await controller.createStock(symbol, companyName);
  res.status(201).json({ success: true, data: stock });
}));

// GET /api/stocks/portfolio - Get user portfolio
router.get('/portfolio', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const portfolio = await controller.getUserPortfolio(req.auth!.userId);
  res.json({ success: true, data: portfolio });
}));

// PUT /api/stocks/:id - Update stock
router.put('/:id', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const { companyName, makeAvailable } = req.body;
  const stock = await controller.updateStock(req.params.id, companyName, makeAvailable);
  res.json({ success: true, data: stock });
}));

// DELETE /api/stocks/:id - Delete stock
router.delete('/:id', requireAuth, requireRole([UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  await controller.deleteStock(req.params.id);
  res.json({ success: true, data: { message: 'Action supprimée' } });
}));

// POST /api/stocks/:id/buy - Buy stock
router.post('/:id/buy', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { quantity } = req.body;
  const result = await controller.buyStock(req.auth!.userId, req.params.id, quantity);
  res.json({ success: true, data: result });
}));

// POST /api/stocks/:id/sell - Sell stock
router.post('/:id/sell', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { quantity } = req.body;
  const result = await controller.sellStock(req.auth!.userId, req.params.id, quantity);
  res.json({ success: true, data: result });
}));

export default router;
