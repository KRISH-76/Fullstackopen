const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  console.log('POST /api/blogs called')

  const { title, author, url, likes } = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  
  console.log('blog user:', blog.user.toString())
  console.log('token user:', decodedToken.id)
  if (blog.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'not allowed' })
  }
  
  await Blog.findByIdAndDelete(request.params.id)
  
  response.status(204).end()
})

module.exports = blogsRouter