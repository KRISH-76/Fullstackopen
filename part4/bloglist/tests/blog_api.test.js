const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('GET /api/blogs', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blogs returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog has id property', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].id !== undefined)
  })

})

describe('POST /api/blogs', () => {

  test('a valid blog can be added', async () => {

    const newBlog = {
      title: "Async/Await Blog",
      author: "Tester",
      url: "http://test.com",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  })

  test('likes default to 0 if missing', async () => {

    const newBlog = {
      title: "No Likes Blog",
      author: "Tester",
      url: "http://nolikes.com"
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added', async () => {

    const newBlog = {
      author: "Tester",
      url: "http://fail.com"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

})

describe('DELETE /api/blogs', () => {

  test('a blog can be deleted', async () => {

    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()

    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length - 1)
  })

})

describe('PUT /api/blogs', () => {

  test('likes can be updated', async () => {

    const blogs = await helper.blogsInDb()
    const blog = blogs[0]

    const updatedBlog = {
      ...blog,
      likes: 99
    }

    const response = await api
      .put(`/api/blogs/${blog.id}`)
      .send(updatedBlog)
      .expect(200)

    assert.strictEqual(response.body.likes, 99)
  })

})

after(async () => {
  await mongoose.connection.close()
})