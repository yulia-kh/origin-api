const express = require('express');
const PersonsService = require('./persons-service');

const personsRouter = express.Router();
const jsonBodyParser = express.json();

personsRouter
  .route('/:id/tree')
  .get((req, res, next) => {
    PersonsService.getAllParents(req.app.get('db'))
      .then(persons => {
        res.json(persons);
      })
      .catch(next);
  });

personsRouter
  .route('/:id/parents')
  .post(jsonBodyParser, (req, res, next) => {
    const { first_name, last_name, date_of_birth, date_of_death, details } = req.body;
    const newParent = {first_name, last_name, date_of_birth, date_of_death, details};
    PersonsService.insertParent(
      req.app.get('db'),
      newParent
    )
      .then(person => {
        console.log(person);
        const { id } = req.params;
        const parent_id = person[0].id;
        const { relation } = req.query;
        const newRelation = {child_id:id, parent_id, relation_to_child:relation};
        console.log(newRelation);
        PersonsService.insertRelation(
          req.app.get('db'),
          newRelation
        )
          .then(() => {
            res.status(201).end();
          });
      
        
      })
      .catch(next);
  });

personsRouter
  .route('/:id')
  .delete((req, res, next) => {
    const { id } = req.params;
    PersonsService.deletePerson(req.app.get('db'), id)
      .then( deletedRow => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = personsRouter;

