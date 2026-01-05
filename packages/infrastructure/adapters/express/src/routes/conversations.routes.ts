import { Router } from 'express';
import { ConversationsController } from '../controllers';
import { asyncHandler, requireAuth, requireRole, UserRole, AuthenticatedRequest } from '../middleware';

const router = Router();
const controller = new ConversationsController();

// GET /api/conversations - Get user conversations
router.get('/', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const conversations = await controller.getUserConversations(req.auth!.userId);
  res.json({ success: true, data: conversations });
}));

// POST /api/conversations - Create conversation
router.post('/', requireAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { subject, firstMessage } = req.body;
  const conversation = await controller.createConversation(
    req.auth!.userId,
    subject,
    firstMessage
  );
  res.status(201).json({ success: true, data: conversation });
}));

// GET /api/conversations/waiting - Get waiting conversations
router.get('/waiting', requireAuth, requireRole([UserRole.ADVISOR, UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const conversations = await controller.getWaitingConversations();
  res.json({ success: true, data: conversations });
}));

// GET /api/conversations/:id/messages - Get conversation messages
router.get('/:id/messages', requireAuth, asyncHandler(async (req, res) => {
  const messages = await controller.getMessages(req.params.id);
  res.json({ success: true, data: messages });
}));

// POST /api/conversations/:id/assign - Assign conversation to advisor
router.post('/:id/assign', requireAuth, requireRole([UserRole.ADVISOR, UserRole.DIRECTOR]), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const result = await controller.assignConversation(req.params.id, req.auth!.userId);
  res.json({ success: true, data: result });
}));

// POST /api/conversations/:id/transfer - Transfer conversation
router.post('/:id/transfer', requireAuth, requireRole([UserRole.ADVISOR, UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const { newAdvisorId } = req.body;
  const result = await controller.transferConversation(req.params.id, newAdvisorId);
  res.json({ success: true, data: result });
}));

// POST /api/conversations/:id/close - Close conversation
router.post('/:id/close', requireAuth, requireRole([UserRole.ADVISOR, UserRole.DIRECTOR]), asyncHandler(async (req, res) => {
  const result = await controller.closeConversation(req.params.id);
  res.json({ success: true, data: result });
}));

export default router;
