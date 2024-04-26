const express = require('express');
const Middle = require('../middleware/middleware.js');
const User = require('./users-model.js')
const Post = require('../posts/posts-model.js')


// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  const users = await User.get()
  res.status(200).json(users)
});

router.get('/:id', Middle.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', Middle.validateUser, Middle.createUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  res.status(201).json(req.newUser)
  
});

router.put('/:id', Middle.validateUserId, Middle.validateUser, Middle.updateUser,  (req, res) => {
	// RETURN THE FRESHLY UPDATED USER OBJECT
	// this needs a middleware to verify user id
	// and another middleware to check that the request body is valid
});

router.delete('/:id', Middle.validateUserId, Middle.userDelete, (req, res) => {
	// RETURN THE FRESHLY DELETED USER OBJECT
	// this needs a middleware to verify user id
});

router.get('/:id/posts', Middle.validateUserId, async (req, res, next) => {
	// RETURN THE ARRAY OF USER POSTS
	// this needs a middleware to verify user id
  const posts = await User.getUserPosts(req.params.id)
  res.status(200).json(posts)
  next()

})

router.post('/:id/posts', Middle.validateUserId, Middle.validatePost, async (req, res) => {
	// RETURN THE NEWLY CREATED USER POST
	// this needs a middleware to verify user id
	// and another middleware to check that the request body is valid
  const newPost = await Post.insert({
    text: `${req.text}`, 
    user_id: req.params.id})
  res.status(201).json(newPost)
});

router.use( (err, req, res, next) => {
  res.status(err.status || 500).json({customMessage: 'something tragic inside user router Happened',
    message: err.message,
    stack: err.stack,
})
} ) 

// do not forget to export the router
module.exports = router