const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
  let db

  const { testUsers } = helpers.makeFamilyFixtures()
  const testUser = testUsers[0]

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

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['first_name', 'last_name', 'user_name', 'password']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: 'test password',
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '1234567',
        }
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must be longer than 8 characters` })
      })

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '*'.repeat(73),
        }
        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` })
      })

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: ' 1Aa!2Bb@',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '1Aa!2Bb@ ',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '11AAaabb',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
      })

      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
        const duplicateUser = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: testUser.user_name,
          password: '11AAaa!!',
        }
        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` })
      })
    })

    context(`Happy path`, () => {
      it(`responds 201, user_id and person_id, storing bcryped password`, () => {
        const newUser = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '11AAaa!!',
        }
        const newPerson = {
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          user_id: newUser.id,
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('user_id')
            expect(res.body).to.have.property('person_id')
        })     
      })
    })
  })
})