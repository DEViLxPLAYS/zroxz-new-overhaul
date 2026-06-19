import bcrypt from 'bcryptjs';

/**
 * Middleware that checks the x-admin-password header against the bcrypt hash
 * stored in ADMIN_PASSWORD_HASH env var.
 *
 * To generate a hash locally:
 *   node -e "import('bcryptjs').then(b => console.log(b.default.hashSync('your-password', 10)))"
 * Then paste the output into ADMIN_PASSWORD_HASH in Render's environment tab.
 */
export async function requireAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];

  if (!password) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error('[requireAdmin] ADMIN_PASSWORD_HASH env var not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return res.status(403).json({ error: 'Invalid admin password' });
  }

  next();
}
