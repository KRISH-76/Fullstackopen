const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "First blog",
    author: "Alice",
    url: "http://example.com/1",
    likes: 5
  },
  {
    title: "Second blog",
    author: "Bob",
    url: "http://example.com/2",
    likes: 3
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb
}