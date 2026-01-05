import { Router } from 'express';
import { ConversationsController } from '../controllers';
import { asyncHandler, requireAuth, AuthenticatedRequest } from '../middleware';

const router = Router();
const controller = new ConversationsController();

// POST /api/messages/send - Send message
router.post('/send', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { conversationId, content } = req.body;
  const message = await controller.sendMessage(
    conversationId,
    req.auth!.userId,
    content
  );
  res.status(201).json({ success: true, data: message });
}));

export default router;
