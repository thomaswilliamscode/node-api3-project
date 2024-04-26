const User = require('../users/users-model.js')



function logger(req, res, next) {
  // DO YOUR MAGIC
  const timeStamp = new Date().toString()
  console.log(timeStamp);
  console.log(`You made a ${req.method} request To URL: ${req.url} `);
  
  next()
}

async function validateUserId (req, res, next) {
  // DO YOUR MAGIC
  // if the `id` parameter is valid, store the user object as `req.user` and allow the request to continue
  // - if the `id` parameter does not match any user id in the database, respond with status `404` and `{ message: "user not found" }`
  
  const id = req.params.id
  const isValid = await User.getById(id)
  if (isValid) {
    req.user = isValid
    next()
  } else {
    res.status(404).json({message: 'user not found'})
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  //   - `validateUser` validates the `body` on a request to create or update a user
  // - if the request `body` lacks the required `name` field, respond with status `400` and `{ message: "missing required name field" }`
  const { name } = req.body
  if (name && name.trim()) {
    req.name = name.trim()
    next()
  } else {
    res.status(400).json({message: 'missing required name field'})
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  //   - `validatePost` validates the `body` on a request to create a new post
  // - if the request `body` lacks the required `text` field, respond with status `400` and `{ message: "missing required text field" }`
  const { text } = req.body
  if (text) {
    req.text = text
    next()
  } else {
    res.status(400).json({message: 'missing required text field'})
  }
}

async function createUser(req, res, next) {
  const  newUser = await User.insert({name: req.name})
  req.newUser = newUser;
  next()
}

async function updateUser (req, res, next) {
  const updatedUser = await User.update(req.user.id, { name: req.name})
  res.status(200).json(updatedUser)
  next()
}

async function userDelete (req, res, next) {
  let oldUser = req.user
  await User.remove(req.user.id)
  res.status(200).json(oldUser)
  next()
}


// do not forget to expose these functions to other modules
module.exports = {logger, validateUserId, validateUser, validatePost, createUser, updateUser, userDelete,}