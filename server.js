const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/api')
const mongoose = require('mongoose')

// Set up express app
const app = express()

// connect to mongodb
mongoose
  .connect(
    'mongodb://localhost:27017/spelling',
    { useNewUrlParser: true }
  )
  .then(console.log('mongo DB connected'))
  .catch(err => console.log(err))
mongoose.Promise = global.Promise

// express
app.use( express.static( `${__dirname}/./build` ) );

// bodyParser: Parses the text as JSON and exposes the resulting object on req.body
app.use(bodyParser.json())

// initialise routes
app.use('/api', routes)

// error handling middleware
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message })
})

// listen for requests
app.listen(process.env.port || 4000, () =>
  console.log('now listening for requests')
)
