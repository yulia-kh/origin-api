const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'dunder',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_modified: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 2,
      user_name: 'joe',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_modified: new Date('2029-01-22T16:28:32.615Z')
    },
  ]
}

function makePersonsArray() {
  return [
    {
      id: 1,
      first_name: 'Dunder',
      last_name: 'Mifflin',
      date_of_birth: null,
      date_of_death: null,
      details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      user_id: 1
    },
    {
      id: 2,
      first_name: 'Joe',
      last_name: 'Doe',
      date_of_birth: null,
      date_of_death: null,
      details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      user_id: 1
    },
    {
      id: 3,
      first_name: 'Jane',
      last_name: 'Doe',
      date_of_birth: null,
      date_of_death: null,
      details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      user_id: 2
    },
    {
      id: 4,
      first_name: 'Jack',
      last_name: 'Doe',
      date_of_birth: null,
      date_of_death: null,
      details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      user_id: 2
    },
  ]
}

function makeParentChildArray(persons) {
  return [
    {
      child_id: 2,
      parent_id: 3,
      relation_to_child: 'Mother',
    },
    {
      child_id: 2,
      parent_id: 4,
      relation_to_child: 'Father',
    },
  ];
}

function makeUserPersonArray(user_id, person_id){
  return [
    {
      user_id: 1,
      person_id: 1,
    },
    {
      user_id: 2,
      person_id: 2,
    },
  ];
}

function makeExpectedPerson(users, person, comments=[]) {
  const author = users
    .find(user => user.id === person.user_id)

  return {
    id: person.id,
    first_name: person.first_name,
    last_name: person.last_name,
    details: person.details,
   
  }
}

function makeFamilyFixtures() {
  const testUsers = makeUsersArray()
  const testPersons = makePersonsArray()
  const testParentChild = makeParentChildArray()
  const testUserPerson = makeUserPersonArray()
  return { testUsers, testPersons, testParentChild, testUserPerson }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
      persons,
      parent_child,
      users,
      user_person
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE persons_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('persons_id_seq', 0)`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedPersonsTables(db, users, persons) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('persons').insert(persons)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('persons_id_seq', ?)`,
      [persons[persons.length - 1].id],
    )
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makePersonsArray,
  makeParentChildArray,
  makeUserPersonArray,
  makeExpectedPerson,
  makeFamilyFixtures,
  cleanTables,
  seedPersonsTables,
  makeAuthHeader,
  seedUsers,
}