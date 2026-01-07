export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal server error'
  console.error('Error handler:', err)
  res.status(status).json({ error: message })
}
