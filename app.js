require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const cors = require('cors')
const morgan = require('morgan')
const createError = require('http-errors')
const path = require("path");
// const bodyParser = require('body-parser')
const productRouter = require('./src/routers/product')
// const moviesRouter = require('./src/routers/movie')

app.use(express.urlencoded({
  extended: false
}))
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

// router
app.use('/product', productRouter)
app.use("/images", express.static(path.join(__dirname, "images")));

app.use('*', (req, res, next) => {
  const error = new createError.NotFound()
  next(error)
})

// error handling
app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500
  }
  res.json({
    message: err.message,
    status_error: err.status
  })
})

app.listen(port, () => {
  console.log('server is running port ' + port)
})
