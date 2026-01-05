import { Router } from 'express';
import { NotificationsController } from '../controllers';
import { asyncHandler, requireAuth, AuthenticatedRequest } from '../middleware';

const router = Router();
const controller = new NotificationsController();

// GET /api/notifications - Get user notifications
router.get('/', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const notifications = await controller.getUserNotifications(req.auth!.userId);
  res.json({ success: true, data: notifications });
}));

// POST /api/notifications/:id/read - Mark notification as read
router.post('/:id/read', requireAuth, asyncHandler(async (req, res) => {
  const result = await controller.markAsRead(req.params.id);
  res.json({ success: true, data: result });
}));

export default router;
