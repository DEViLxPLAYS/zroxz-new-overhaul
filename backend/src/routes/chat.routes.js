import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { handleChat } from '../controllers/chat.controller.js';
import { CHAT_RATE_LIMIT_MAX, CHAT_RATE_WINDOW_MS } from '../config/constants.js';

const router = Router();

// 15 messages/min per IP — generous for real visitors, blocks cost-runaway abuse
const chatLimiter = rateLimit({
  windowMs: CHAT_RATE_WINDOW_MS,
  max: CHAT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please wait a moment before sending more.' },
});

router.post('/', chatLimiter, handleChat);

export default router;
