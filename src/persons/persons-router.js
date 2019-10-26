const express = require('express');
const PersonsService = require('./persons-service');
const { requireAuth } = require('../middleware/jwt-auth');

const personsRouter = express.Router();
const jsonBodyParser = express.json();

personsRouter
  .route('/:id/parents')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    let { relation_to_child, first_name, last_name, date_of_birth, date_of_death, details } = req.body;
    const newParent = {first_name, last_name, date_of_birth, date_of_death, details};
    const { id } = req.params;

    if(!date_of_birth) {
      date_of_birth = null;
    }

    if(!date_of_death) {
      date_of_death = null;
    }

    if (!relation_to_child) {
      return res.status(400)
        .json({
          error: {message: 'Missing \'relation_to_child\' in request body'}
        });
    }

    newParent.user_id = req.user.id;

    PersonsService.insertParent(
      req.app.get('db'),
      newParent
    )
      .then(person => {

        const parent_id = person[0].id;
        const newRelation = {child_id:id, parent_id, relation_to_child};
        PersonsService.insertRelation(
          req.app.get('db'),
          newRelation
        )
          .then(() => {
            res.status(201).json(person[0]);
          }); 
      })
      .catch(next);
  });

personsRouter
  .route('/:id')
  .all(requireAuth)
  .delete((req, res, next) => {
    const { id } = req.params;
    PersonsService.deletePerson(req.app.get('db'), id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const { id } = req.params;
    PersonsService.getOnePerson(req.app.get('db'), id)
      .then(person => {
        res.json(person[0]);
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { relation_to_child, child_id, first_name, last_name, date_of_birth, date_of_death, details } = req.body;
    const personToUpdate = { first_name, last_name, date_of_birth, date_of_death, details };
    const { id } = req.params;

    PersonsService.updatePerson(req.app.get('db'), id, personToUpdate)
      .then(person => {
        const parent_id = person[0].id;
        const updatedRelation = {child_id, parent_id, relation_to_child};
        PersonsService.updateRelation(
          req.app.get('db'),
          id,
          updatedRelation)
          .then(() => {
            res.status(204).end();}
          );
      })
      .catch(next);
  });

module.exports = personsRouter;

