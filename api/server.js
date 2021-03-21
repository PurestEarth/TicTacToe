
const express = require('express'),
cors = require('cors'),
mongoose = require('mongoose'),
config = require('./DB'),
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express"),
rateLimit = require("express-rate-limit");
const options = {
    // authAction :{ JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"} },
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Tic-Tac-Toe API",
        version: "0.1.0",
        description:
          "CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Purest Earth",
          url: "https://github.com/PurestEarth",
        },
      },
      servers: [
        {
            url: "http://localhost:4000",
        }
      ],
    },
    apis: [
          './models/Tile.js', './models/Player.js', './models/GameState.js',
          './routers/game.route.js', './routers/player.route.js'
         ],
         schemas: []
  };

const specs = swaggerJsdoc(options);

mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500
});

const gameRoute = require('./routes/game.route').gameRoutes;
const playerRoute = require('./routes/player.route').playerRoutes;

const app = express();
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
// parse application/json
app.use(express.json());
app.use(limiter);
app.use('/api/game', gameRoute);
app.use('/api/player', playerRoute);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );
const port = process.env.PORT || 4000;

const server = app.listen(port, function(){
console.log('Listening on port ' + port);
});


module.exports = server