const express = require('express');
const PersonsService = require('./persons-service');
const { requireAuth } = require('../middleware/jwt-auth');

const personsRouter = express.Router();
const jsonBodyParser = express.json();




// personsRouter
//   .route('/:id/tree')
//   .all(requireAuth)
//   .get((req, res, next) => {
//     PersonsService.getAllParents(req.app.get('db'))
//       .then(persons => {
//         res.json(persons);
//       })
//       .catch(next);
//   });

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
          error: {message: 'Request body must contain \'mother or \'father\'.'}
        });
    }

    newParent.user_id = req.user.id;
    console.log(newParent);

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
      .then( deletedRow => {
        res.status(204).end();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const { id } = req.params;
    PersonsService.getOnePerson(req.app.get('db'), id)
      .then(person => {
        console.log(person)
        res.json(person[0]);
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { relation_to_child, first_name, last_name, date_of_birth, date_of_death, details } = req.body;
    const personToUpdate = { first_name, last_name, date_of_birth, date_of_death, details };
    const relationToUpdate = relation_to_child;
    const { id } = req.params;

    PersonsService.updatePerson(req.app.get('db'), id, personToUpdate)
      .then((updatedPerson) => {
        res.status(204).end();
        // json(updatedPerson[0]);
      })
      .catch(next);
  });

module.exports = personsRouter;

