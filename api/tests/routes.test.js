const gameRoute = require('../routes/game.route');
const request = require('supertest')
const app = require('../server')

function winGame(board, moves) {
  return new Promise((resolve, reject) => {
    request(app)
    .post('/api/game/')
    .send({
      gameState: {'playerId': 1, 'board': board}
    }).then(
      res => {
        let gameId = res.body._id;
        request(app)
        .get(`/api/game/makeMove/${gameId}/${moves[0]}`).then( res2 =>{
          request(app)
          .get(`/api/game/makeMove/${gameId}/${moves[1]}`).then( res3 =>{
            request(app)
              .get(`/api/game/makeMove/${gameId}/${moves[2]}`).then( res4 =>{
                request(app)
                .get(`/api/game/makeMove/${gameId}/${moves[3]}`).then( res5 => {
                  request(app)
                  .get(`/api/game/makeMove/${gameId}/${moves[4]}`).then( res6 => {
                    resolve(res6.statusCode)
                  })
                })
              })
            })
          })
        })
  });
}

describe('Winning sequence test', () => {
    it('should return true for winning sequences', () => {
      expect(gameRoute.isWinningSequence([true,true,true,true,true])).toBe(true)
      expect(gameRoute.isWinningSequence([true,true,false,true,true])).toBe(false)
      expect(gameRoute.isWinningSequence([false,true,true,true,true])).toBe(false)
      expect(gameRoute.isWinningSequence([false,true,true,true,true,true])).toBe(true)
      expect(gameRoute.isWinningSequence([false,true,true,true,true,true,false,true,true,true,true,true])).toBe(true)
      expect(gameRoute.isWinningSequence([false,true,true,false,true,true,false,true,true,true,false,true])).toBe(false)
    })
})

describe('Test methods ability to validate winning state', () => {
  it('should return true for winning sequences', () => {
    let jsonBoards = require('./data/boards.json');
    Object.keys(jsonBoards).forEach( key => {
      let board = gameRoute.arrayToBoard(jsonBoards[key]['board'])
      expect(gameRoute.checkForWinners(board, jsonBoards[key]['last_i'], jsonBoards[key]['player'])).toBe(jsonBoards[key]['expected_result'])
    })
  })
})

describe('Post/Get/Win Game', async () => {
  let jsonBoards = require('./data/boards.json');

  it('should not create a new post', async () => {
    const res = await request(app)
      .post('/api/game/')
      .send({
        userId: 1
      })
    expect(res.statusCode).toEqual(500)
  })
  it('should not get a post', async () => {
    const res = await request(app)
    .get("/api/game/" + 1)
    expect(res.statusCode).toEqual(500)
  })
  it('should create a new game, and find it', async () => {
    const res = await request(app)
      .post('/api/game/')
      .send({
        gameState: {'playerId': 1, 'board': [jsonBoards[1]['board']]}
      })
    expect(res.statusCode).toEqual(200)

    const res2 = await request(app)
    .get(`/api/game/${res.body._id}`)
    expect(res2.statusCode).toEqual(200)
    expect(res2.body._id).toEqual(res.body._id)
  })
  it('should create a new game, successfully make moves, win the game',  () => {
    return winGame(jsonBoards[1]['board'], [24,34,44,54,64]).then(status => expect(status).toEqual(201))
  })
})


describe('Player Route', async () => {
  it('should not create player', async () => {
    const res = await request(app)
      .post('/api/player/')
      .send({
        name: "Andrzej"
      })
    expect(res.statusCode).toEqual(500)
  })
  it('should create player', async () => {
    const res = await request(app)
      .post('/api/player/')
      .send({
        "player": {
            name: "Andrzej"
        }
      })
    expect(res.statusCode).toEqual(200)
  })
  it('should create player, and find it', async () => {
    //expect.assertions(2);
    const res = await request(app)
      .post('/api/player/')
      .send({
        "player": {
            name: "Andrzej"
        }
      })
    expect(res.statusCode).toEqual(200)

    const res2 = await request(app)
    .get(`/api/player/${res.body}`)
    expect(res2.statusCode).toEqual(200)
    expect(res2.body._id).toEqual(res.body)
  })
  it('should show player stats', async () => {
    const res = await request(app)
      .post('/api/player/')
      .send({
        "player": {
            name: "Andrzej"
        }
      })
    expect(res.statusCode).toEqual(200)

    const res2 = await request(app)
    .get(`/api/player/stats/${res.body}`)
    expect(res2.statusCode).toEqual(200)
    expect(res2.body.wins).toEqual(0)
    expect(res2.body.draws).toEqual(0)
    expect(res2.body.loses).toEqual(0)
  })
})

