const logger = require('../services/logger.service')
const authService = require('../api/auth/auth.service')
const config = require('../config')

async function requireAuth(req, res, next) {
  if (!req?.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.validateToken(req.cookies.loginToken)

  console.log('LoggedinUser in requireAuth:', loggedinUser) // Add this line to debug

  if (!loggedinUser) return res.status(401).send('Not Authenticated')

  req.loggedinUser = loggedinUser
  next()
}


async function requireAdmin(req, res, next) {
  const user = req.loggedinUser
  console.log('User in requireAdmin:', user) // Add this line to debug
  if (!user || !user.isAdmin) {
      console.log('Admin access denied') // Add this line to debug
      return res.status(401).send('Admin access denied')
  }
  next()
}




// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin
}
