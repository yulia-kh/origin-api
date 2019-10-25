const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', function() {
  let db

  const {
    testUsers,
    testPersons,
  } = helpers.makeFamilyFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert persons', () =>
    helpers.seedPersonsTables(
      db,
      testUsers,
      testPersons,
    )
  )
 
  const protectedEndpoints = [
    {
      name: 'GET /api/tree',
      path: '/api/tree',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/persons/:id/parents',
      path: '/api/persons/1/parents',
      method: supertest(app).post,
    },
    {
      name: 'DELETE /api/persons/:id',
      path: '/api/persons/1',
      method: supertest(app).delete,
    },
    {
      name: 'PATCH /api/persons/:id',
      path: '/api/persons/1',
      method: supertest(app).patch,
    },
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { user_name: 'user-not-existy', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})