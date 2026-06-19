import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import chatRoutes from './routes/chat.routes.js';
import contactRoutes from './routes/contact.routes.js';
import blogRoutes from './routes/blog.routes.js';
import healthRoutes from './routes/health.routes.js';
import sitemapRoutes from './routes/sitemap.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(helmet());

// Gzip compression — reduces payload size on every response
app.use(compression());

// CORS — only the production domain (or localhost for dev)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://zroxz.com',
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
}));

// Body parsing — cap at 1mb to prevent abuse
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/', sitemapRoutes); // serves /sitemap.xml at root

// Central error handler — must be registered last
app.use(errorHandler);

export default app;
