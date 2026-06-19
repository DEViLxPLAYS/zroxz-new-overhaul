import { Router } from 'express';
import { getAllPosts, getPostBySlug, createPost, updatePost } from '../controllers/blog.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);

// Admin-protected routes — require x-admin-password header
router.post('/', requireAdmin, createPost);
router.put('/:id', requireAdmin, updatePost);

export default router;
