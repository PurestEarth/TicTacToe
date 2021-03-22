const express = require('express'),
      playerRoutes = express.Router(),
      playerController = require('../controllers/player.controller')
      rateLimit = require("express-rate-limit");


const playerLimit = rateLimit({
    windowMs: 24*60 * 60 * 1000,
    max: 100,
    message:
      "Too many attempts"
});


/**
 * @swagger
 * paths:
 *  /player/:
 *    post:
 *      summary: Post new Player
 *      tags: [Player]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      $ref: '#/components/schemas/Player'
 *      responses:
 *        "200":
 *          description: Player
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Player'
 *        "500":
 *          description: Request didnt include required field
 *        "501":
 *          description: Controller wasnt able to add player
*/

playerRoutes.route('/').post( playerLimit, function(req,res){
    if (req.body.player) {
        playerController.createPlayer(req.body.player.name).then( player => {
            res.status(200).json(player._id);
        },err=>{
            res.status(501).send('Player could have not been saved');
        })
    }
    else {
        res.status(500).send('Missing required object');
    }
})


/**
 * @swagger
 * paths:
 *  /player/:id:
 *    get:
 *      summary: Get player with id
 *      tags: [Player]
 *      responses:
 *        "200":
 *          description: Player
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Player'
 *        "500":
 *          description: Request didnt include id
 *        "501":
 *          description: Controller wasnt able to retrieve player
*/

playerRoutes.route('/:id').get( playerLimit, function(req,res){
    if (req.params.id) {
        playerController.findById(req.params.id).then( player => {
            res.status(200).json(player);
        }, err => {
            res.status(501).send("Error while attempting to retrieve player");
        })
    }
    else {
        res.status(500).send('Missing required id');
    }
})

/**
 * @swagger
 * paths:
 *  /stats/:id:
 *    get:
 *      summary: Get stats of player with id
 *      tags: [Player]
 *      responses:
 *        "200":
 *          description: Player
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "500":
 *          description: Request didnt include id
 *        "501":
 *          description: Controller wasnt able to retrieve player
*/

playerRoutes.route('/stats/:id').get( playerLimit, function(req,res){
    if (req.params.id) {
        playerController.getStats(req.params.id).then( stats => {
            res.status(200).json(stats);
        }, err => {
            res.status(501).send('Error while attempting to retrieve player');
        })
    }
    else {
        res.status(500).send('Missing required id');
    }
})


module.exports = {
    playerRoutes: playerRoutes,
};
