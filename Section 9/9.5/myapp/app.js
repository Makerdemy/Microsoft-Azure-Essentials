const CosmosClient = require('@azure/cosmos').CosmosClient
const config = require('./config')
const Services = require('./routes/services')
const Db = require('./models/db')
const methodOverride = require('method-override');

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));

const cosmosClient = new CosmosClient({
  endpoint: config.host,
  key: config.authKey
})
const db = new Db(cosmosClient, config.databaseId, config.containerId, config.partitionKey)
const services = new Services(db)
db
  .init(err => {
    console.error(err)
  })
  .catch(err => {
    console.error(err)
    console.error(
      'Shutting down because there was an error setting up the database.'
    )
    process.exit(1)
  })
//*********************************************************    * */
app.get('/get', (req, res) => services.getArticles(req, res))
app.get('/getname', (req, res) => services.queryArticleByName(req, res))
app.post('/post', (req, res) => services.postArticles(req, res))
app.get('/put', (req, res) => services.putArticle(req, res))
app.get('/delete', (req, res) => services.deleteArticle(req, res))
//************************************************************** */
app.set('view engine', 'jade')

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app