const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Persons Endpoints', function() {
  let db;

  const {
    testPersons,
    testUsers,
  } = helpers.makeFamilyFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/persons/:id/parents', () => {
    beforeEach('insert persons', () =>
      helpers.seedPersonsTables(
        db,
        testUsers,
        testPersons
      )
    );

    it.only('creates a person, responding with 201 and the new person', function() {
      this.retries(3);
      const testPerson = testPersons[0];
      const testUser = testUsers[0];
      const newPerson = {
        first_name: 'test name',
        last_name: 'test last name',
        relation_to_child: 'Father',
      };
      return supertest(app)
        .post('/api/persons/1/parents')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newPerson)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.first_name).to.eql(newPerson.first_name);
          expect(res.body.last_name).to.eql(newPerson.last_name);
          expect(res.body.id).to.eql(newPerson.id);
          // expect(res.body.user_id).to.eql(testUser.id);
          // expect(res.headers.location).to.eql(`/api/persons/${res.body.id}/parents`);
        })
        .expect(res =>
          db
            .from('persons')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.first_name).to.eql(newPerson.first_name);
              // expect(row.id).to.eql(newPerson.id);
              // expect(row.user_id).to.eql(testUser.id);
            })
        );
    });

    const requiredFields = ['relation_to_child'];

    requiredFields.forEach(field => {
      const testPerson = testPersons[0];
      const testUser = testUsers[0];
      const newPerson = {
        first_name: 'test name',
        last_name: 'test last name',
        relation_to_child: 'Father',
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newPerson[field];

        return supertest(app)
          .post('/api/persons/1/parents')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newComment)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });
  });
});