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
 * path:
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
*/

playerRoutes.route('/').post( playerLimit, function(req,res){
    if (req.body.player) {
        playerController.createPlayer(req.body.player.name).then( player => {
            res.status(200).json(player._id);
        },err=>{
            res.status(500).send('Something went terribly wrong');
        })
    }
    else {
        res.status(500).send();
    }
})


/**
 * @swagger
 * path:
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
*/

playerRoutes.route('/:id').get( playerLimit, function(req,res){
    if (req.params.id) {
        playerController.findById(req.params.id).then( player => {
            res.status(200).json(player);
        }, err => {
            res.status(500).send("write better error messages");
        })
    }
    else {
        res.status(500).send();
    }
})

playerRoutes.route('/stats/:id').get( playerLimit, function(req,res){
    if (req.params.id) {
        playerController.getStats(req.params.id).then( stats => {
            res.status(200).json(stats);
        }, err => {
            res.status(500).send();
        })
    }
    else {
        res.status(500).send();
    }
})


module.exports = {
    playerRoutes: playerRoutes,
};
