const toyService = require('./toy.service.js')

const logger = require('../../services/logger.service')

const PAGE_SIZE = 5
async function gettoys(req, res) {
  console.log(req.query.labels, 'labels in controller')
  try {
    const filterBy = {
      name: req.query.name || '',
      status: req.query.status && req.query.status !== 'All' ? JSON.parse(req.query.status) : 'All',
      labels: req.query.labels || [],
    }
    const sortBy = {
      val: req.query.sortBy || 'Sort by',
      isAsc: req.query.sortOrder === 'asc',
    }
    console.log('Received sortBy object controller:', sortBy)
    const page = parseInt(req.query.page) || 0
    const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE

    logger.debug('Getting toys', filterBy)
    const { toys, totalToys } = await toyService.query(
      filterBy,
      sortBy,
      page,
      pageSize
    )
    res.json({ toys, totalToys })
  } catch (err) {
    logger.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}

async function getToyById(req, res) {
  try {
    const toyId = req.params.id
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    logger.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

async function addtoy(req, res) {
  const { loggedinUser } = req

  try {
    const toy = req.body
    toy.owner = loggedinUser
    const addedtoy = await toyService.add(toy)
    res.json(addedtoy)
  } catch (err) {
    logger.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

async function updatetoy(req, res) {
  try {
    const toy = req.body
    // logger.debug(`Updating toy (controller): ${JSON.stringify(toy)}`)
    await toyService.update(toy)
    res.json(toy)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

async function removetoy(req, res) {
  try {
    const toyId = req.params.id
    await toyService.remove(toyId)
    res.send()
  } catch (err) {
    logger.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

async function addtoyMsg(req, res) {
  const { loggedinUser } = req
  try {
    const toyId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
    }
    const savedMsg = await toyService.addtoyMsg(toyId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

async function removetoyMsg(req, res) {
  const { loggedinUser } = req
  try {
    const toyId = req.params.id
    const { msgId } = req.params

    const removedId = await toyService.removetoyMsg(toyId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove toy msg', err)
    res.status(500).send({ err: 'Failed to remove toy msg' })
  }
}

module.exports = {
  gettoys,
  gettoyById: getToyById,
  addtoy,
  updatetoy,
  removetoy,
  addtoyMsg,
  removetoyMsg,
}
