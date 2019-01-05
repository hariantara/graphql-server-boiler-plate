require('dotenv').config()

const { createServer } = require('http');
const fs = require('fs')
const path = require('path')
const express = require('express');

const { execute, subscribe } = require('graphql');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const { SubscriptionServer } = require('subscriptions-transport-ws');

const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./mysql_connection')
const jwt = require('jsonwebtoken');
const winston = require('./winston/index');
const morgan = require('morgan')
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
      console.log('req.headers: ', req.headers)
      let token = req.headers.authorization
      console.log('token -x-x-x> :', req.headers.authorization)
      if (token !== null && token !== undefined){
        let decoded = jwt.verify(token, process.env.SALT)
        // console.log('decoded: ', decoded)
        return {
          id: decoded.id,
          name: decoded.name,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
          photo: decoded.photo
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
    let file
    if (req.file) {
      file = req.file
    } else {
      file = []
    }
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
app.use('/static/uploads', express.static('static/uploads'))

app.use('*', cors({ origin: `http://localhost:3000` }));
// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress(wrapper));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ 
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:4000/subscriptions` 
}));

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
const ws = createServer(app)
ws.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}/graphiql to run queries!`);

  SubscriptionServer.create({
    execute,
    subscribe,
    schema,
    onConnect: () => console.log("Client connected!")
  }, {
      server: ws,
      path: '/subscriptions',
  });
});

