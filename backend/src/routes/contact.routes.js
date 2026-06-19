import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { handleContact } from '../controllers/contact.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { CONTACT_RATE_LIMIT_MAX, CONTACT_RATE_WINDOW_MS } from '../config/constants.js';

const router = Router();

// 5 submissions per 15 minutes per IP — prevents spam
const contactLimiter = rateLimit({
  windowMs: CONTACT_RATE_WINDOW_MS,
  max: CONTACT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  validateRequest,
  handleContact
);

export default router;
