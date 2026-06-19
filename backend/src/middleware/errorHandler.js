export function errorHandler(err, _req, res, _next) {
  console.error('[error]', err.stack || err.message);

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong. Please try again.'
        : err.message,
  });
}
