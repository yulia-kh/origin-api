const express = require('express');
const PersonsService = require('./persons-service');

const personsRouter = express.Router();
// const jsonBodyParser = express.json();

personsRouter
  .route('/:id/tree')
  // .get((req, res) => {
  //   res.json({"hello":"world"});
  // });
  .get((req, res, next) => {
    PersonsService.getAllParents(req.app.get('db'))
      .then(persons => {
        res.json(persons);
      })
      .catch(next);
  });

module.exports = personsRouter;

// const { first_name, last_name, date_of_birth, date_of_death, details } = req.body;