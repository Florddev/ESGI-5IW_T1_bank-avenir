import { Router } from 'express';
import { AuthController } from '../controllers';
import { asyncHandler } from '../middleware';

const router = Router();
const controller = new AuthController();

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const result = await controller.register(req.body);
  res.status(201).json({ success: true, data: result });
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const result = await controller.login(req.body);
  
  // Set HTTP-only cookie
  res.cookie('auth_token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  res.json({ success: true, data: result });
}));

// POST /api/auth/confirm
router.post('/confirm', asyncHandler(async (req, res) => {
  const result = await controller.confirmAccount(req.body);
  res.json({ success: true, data: result });
}));

// GET /api/auth/me
router.get('/me', asyncHandler(async (req, res) => {
  const token = req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }
  
  const result = await controller.getCurrentUser(token);
  res.json({ success: true, data: result });
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, data: { message: 'Déconnecté avec succès' } });
});

export default router;
