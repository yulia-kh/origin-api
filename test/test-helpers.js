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

function makePersonsArray(users) {
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
      relation_to_child,
    },
    {
      child_id: 2,
      parent_id: 4,
      relation_to_child,
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

function makeExpectedArticle(users, article, comments=[]) {
  const author = users
    .find(user => user.id === article.author_id)

  const number_of_comments = comments
    .filter(comment => comment.article_id === article.id)
    .length

  return {
    id: article.id,
    style: article.style,
    title: article.title,
    content: article.content,
    date_created: article.date_created.toISOString(),
    number_of_comments,
    author: {
      id: author.id,
      user_name: author.user_name,
      full_name: author.full_name,
      nickname: author.nickname,
      date_created: author.date_created.toISOString(),
      date_modified: author.date_modified || null,
    },
  }
}

function makeExpectedArticleComments(users, articleId, comments) {
  const expectedComments = comments
    .filter(comment => comment.article_id === articleId)

  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.user_id)
    return {
      id: comment.id,
      text: comment.text,
      date_created: comment.date_created.toISOString(),
      user: {
        id: commentUser.id,
        user_name: commentUser.user_name,
        full_name: commentUser.full_name,
        nickname: commentUser.nickname,
        date_created: commentUser.date_created.toISOString(),
        date_modified: commentUser.date_modified || null,
      }
    }
  })
}

function makeMaliciousArticle(user) {
  const maliciousArticle = {
    id: 911,
    style: 'How-to',
    date_created: new Date(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedArticle = {
    ...makeExpectedArticle([user], maliciousArticle),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousArticle,
    expectedArticle,
  }
}

function makeFamilyFixtures() {
  const testUsers = makeUsersArray()
  const testPersons = makePersonsArray(testUsers)
  const testParentChild = makeParentChildArray(testPersons)
  const testUserPerson = makeUserPersonArray()
  return { testUsers, testPersons, testParentChild, testUserPerson }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        blogful_articles,
        blogful_users,
        blogful_comments
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE blogful_articles_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE blogful_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE blogful_comments_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('blogful_articles_id_seq', 0)`),
        trx.raw(`SELECT setval('blogful_users_id_seq', 0)`),
        trx.raw(`SELECT setval('blogful_comments_id_seq', 0)`),
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
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedArticlesTables(db, users, articles, comments=[]) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('blogful_articles').insert(articles)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('blogful_articles_id_seq', ?)`,
      [articles[articles.length - 1].id],
    )
    // only insert comments if there are some, also update the sequence counter
    if (comments.length) {
      await trx.into('blogful_comments').insert(comments)
      await trx.raw(
        `SELECT setval('blogful_comments_id_seq', ?)`,
        [comments[comments.length - 1].id],
      )
    }
  })
}

function seedMaliciousArticle(db, user, article) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('blogful_articles')
        .insert([article])
    )
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
  makeArticlesArray,
  makeExpectedArticle,
  makeExpectedArticleComments,
  makeMaliciousArticle,
  makeCommentsArray,

  makeFamilyFixtures,
  cleanTables,
  seedArticlesTables,
  seedMaliciousArticle,
  makeAuthHeader,
  seedUsers,
}