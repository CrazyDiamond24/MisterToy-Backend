const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  gettoys,
  gettoyById: getToyById,
  addtoy,
  updatetoy,
  removetoy,
  addtoyMsg,
  removetoyMsg,
} = require('./toy.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, gettoys)
router.get('/:id', getToyById)
router.post('/', addtoy)
router.put('/:id', updatetoy)
// router.delete('/:id', requireAuth, removetoy)
// console.log('Before router.delete')
router.delete('/:id', requireAuth, requireAdmin, removetoy)

router.post('/:id/msg', requireAuth, addtoyMsg)
router.delete('/:id/msg/:msgId', requireAuth, removetoyMsg)

module.exports = router
