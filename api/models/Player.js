
/**
 * @swagger
 *  components:
 *    schemas:
 *      Player:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          createdAt:
 *            type: Date
 *            default: Date.now
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Player = new Schema({
    name: {
      type: String
    },
    wins: {
      type: Number,
      default: 0
    },
    draws: {
      type: Number,
      default: 0
    },
    loses: {
      type: Number,
      default: 0
    },
    createdAt: {
       type: Date, required: true, default: Date.now
    }
},{
    collection: 'player'
    }
);

module.exports = mongoose.model('player', Player);
