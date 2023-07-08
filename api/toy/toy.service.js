const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const { ObjectId } = require('mongodb')

const PAGE_SIZE = 5
async function query(filterBy = {}, sortBy = {}, page = 0, pageSize = PAGE_SIZE) {
  try {
    const criteria = _buildCriteria(filterBy);
    const collection = await dbService.getCollection('toys');
    const totalToys = await collection.countDocuments(criteria);
    const sortOptions = {};

    if (sortBy.val !== 'Sort by') {
      sortOptions[sortBy.val] = sortBy.isAsc ? 1 : -1;
    }

    console.log("sortBy", sortBy);
console.log("sortOptions", sortOptions);


    const toys = await collection
      .find(criteria)
      .sort(sortOptions)
      .skip(page * pageSize) // skip N pages, N=page
      .limit(pageSize) // limit to pageSize
      .toArray();

    return { toys, totalToys };
  } catch (err) {
    logger.error('cannot find toys', err);
    throw err;
  }
}


function _buildCriteria(filterBy = { name: '', labels: null, status: 'All' }) {
  const { name, status, labels } = filterBy;

  const criteria = {}

  if (name) {
    criteria.name = { $regex: name, $options: 'i' }
  }

  if (labels && labels.length > 0) {
    criteria.labels = { $in: labels }
  }

  if (status !== 'All') {
    criteria.inStock = status
  }

  return criteria
}


async function getById(toyId) {
  try {
    const collection = await dbService.getCollection('toys')
    // logger.debug(`Getting toy by id: ${toyId}`) // Add this log
    const toy = await collection.findOne({ _id: new ObjectId(toyId) })
    // logger.debug(`Fetched toy: ${JSON.stringify(toy)}`)
    return toy
  } catch (err) {
    logger.error(`while finding toy ${toyId}`, err)
    throw err
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection('toys')
    await collection.deleteOne({ _id: new ObjectId(toyId) })
  } catch (err) {
    logger.error(`cannot remove toy ${toyId}`, err)
    throw err
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection('toys')
    const addedToy = await collection.insertOne(toy)
    // console.log(addedToy)
    return toy
  } catch (err) {
    logger.error('cannot insert toy', err)
    throw err
  }
}

async function update(toy) {
  try {
    const toyToSave = {
      name: toy.name,
      price: toy.price,
    }

    const collection = await dbService.getCollection('toys')
    // logger.debug(`Updating toy: ${JSON.stringify(toy)}`)
    const result = await collection.updateOne(
      { _id: new ObjectId(toy._id) },
      { $set: toyToSave }
    )
    // logger.debug(`Update result: ${JSON.stringify(result)}`)

    return toy
  } catch (err) {
    logger.error(`cannot update toy ${toy._id}`, err)
    throw err
  }
}

async function addtoyMsg(toyId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('toys')
    await collection.updateOne(
      { _id: ObjectId(toyId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add toy msg ${toyId}`, err)
    throw err
  }
}

async function removetoyMsg(toyId, msgId) {
  try {
    const collection = await dbService.getCollection('toys')
    await collection.updateOne(
      { _id: ObjectId(toyId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add toy msg ${toyId}`, err)
    throw err
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addtoyMsg,
  removetoyMsg,
}
