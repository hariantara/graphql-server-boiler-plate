require('dotenv').config()
var fs = require('fs')
var path = require('path')
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
var { makeExecutableSchema } = require('graphql-tools');
var { ApolloEngine } = require('apollo-engine');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./mysql_connection')
var jwt = require('jsonwebtoken');
var winston = require('./winston/index');
var morgan = require('morgan')
const multer = require('multer')

const PORT = process.env.PORT || 3000 // env goes here

//graphql schema 
var schema = require('./graphql/schemas')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, './winston/logs/access.log'), { flags: 'a' })

// Setup Multer destination
const storage = multer.diskStorage({
  destination: './static/uploads/',
  filename: (req, file, cb) => {
    let uploadedFileName;
    fs.stat(`./static/uploads/${file.originalname}`, (err, stat) => {
      if (err === null) {
        uploadedFileName = `${Date.now()}-${file.originalname}`;
      } else if (err.code === 'ENOENT') {
        uploadedFileName = file.originalname;
      } else {
        // logger.info('Some other error: ', err);
        console.log('error')
      }

      cb(null, uploadedFileName);
    });
  },
});

const upload = multer({ storage });

function unless(paths, middleware) {
  return function unlessCallback(req, res, next) {
    let isHave = false;
    paths.forEach(path => {
      if (path === req.path || req.path.includes(path)) {
        isHave = true;
      }
    });
    if (isHave) {
      return next();
    }
    return middleware(req, res, next);
  };
}

const authentication = async(req, db) => {
    //auth jwt token goes here
    try{
      let token = req.headers.authorization

      if (token !== null && token !== undefined){
        let decoded = jwt.verify(token, process.env.SALT)
        // console.log('decoded: ', decoded)
        return {
          id: decoded.id,
          name: decoded.name,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role
        }
      }
    }catch(err){
      return {
        error: err.message
      }
    }
}

const wrapper = async(req, res,  next) => {
    let userAuth = await authentication(req, db)
    return {
      schema,
      context: {userAuth, db, req},
      // tracing: true,
      // cacheControl: true
    }
}

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('combined', { stream: winston.stream }))

app.use(cors());
// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress(wrapper));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.post('/api/upload', (req, res) => {
  console.log('REQ: ', req.files);
  upload.any()(req, null, err => {
    if (err) {
      // logger.info(err);
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }

    const filePaths = {};

    req.files.forEach(file => {
      if (file.path.includes('\\')) {
        filePaths[file.fieldname] = `${process.env.LINK}/${file.path
          .split('\\')
          .join('/')}`;
      }
      else {
        filePaths[file.fieldname] = `${process.env.LINK}/${file.path
          .split('/')
          .join('/')}`;
      }
    });

    return res.status(200).send({
      success: true,
      filePaths,
    });
  });
});

// Start the server
app.listen({
  port: PORT,
  status: console.log('Server run in PORT = ', PORT)
});