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

// CORS — allow production domains and local development
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://zroxz.com,https://www.zroxz.com')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
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
