/**
 * @swagger
 *  components:
 *    schemas:
 *      GameState:
 *        type: object
 *        properties:
 *          player:
 *            type: ObjectId
 *            default: Date.now
 *          createdAt:
 *            type: Date
 *            default: Date.now
 *          board:
 *            type: [ObjectId]
 *            ref: 'tile'
 *            description: 'Array of tiles'
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GameState = new Schema({
    player: {
        type: Schema.Types.ObjectId, ref: 'player' 
    },
    board: [{ type: Schema.Types.ObjectId, ref: 'tile' }],
    createdAt: {
       type: Date, required: true, default: Date.now
    }
},{
    collection: 'gameState'
    }
);

module.exports = mongoose.model('gameState', GameState);
