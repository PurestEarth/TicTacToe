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

describe('Post/Get/Win Game', async () => {
  let jsonBoards = require('./data/boards.json');

  it('should not create a new post', async () => {
    const res = await request(app)
      .post('/api/game/')
      .send({
        userId: 1
      })
    expect(res.statusCode).toEqual(400)
  })
  it('should not get game', async () => {
    const res = await request(app)
    .get("/api/game/" + 1)
    expect(res.statusCode).toEqual(401)
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
    expect(res.statusCode).toEqual(400)
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
    //expect(res2.statusCode).toEqual(200)
    expect(res2.statusCode).toEqual(401)
    //expect(res2.body._id).toEqual(res.body)
  })
  it('should fail to find a player', async () => {

    const res2 = await request(app)
    .get(`/api/player`)
    expect(res2.statusCode).toEqual(404)
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
    //.get(`/api/player/stats/${res.body}`)
    .get(`/api/player/stats/6057a91db8e1273758626244`)
    expect(res2.statusCode).toEqual(200)
    expect(res2.body.wins).toEqual(0)
    expect(res2.body.draws).toEqual(0)
    expect(res2.body.loses).toEqual(0)
  })
  it('should show player stats', async () => {
    const res2 = await request(app)
    .get(`/api/player/stats/0`)
    expect(res2.statusCode).toEqual(401)
  })
})

