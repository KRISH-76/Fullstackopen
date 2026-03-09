require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI)
const usersRouter = require('./controllers/users')

app.use('/api/users', usersRouter)
const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
