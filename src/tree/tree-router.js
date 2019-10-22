const express = require('express');
//const PersonsService = require('../persons/persons-service');
const TreeService = require('./tree-service');
const { requireAuth } = require('../middleware/jwt-auth');

const treeRouter = express.Router();
//const jsonBodyParser = express.json();

treeRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.user;
    return TreeService.getUserPerson(req.app.get('db'), id)
      .then(person => {
        return TreeService.getAncestors(req.app.get('db'), person);
      })
      .then(tree => {
        console.log(tree);
        return res.json(tree);
      })
      .catch(next);
  }
  
  ); 


module.exports = treeRouter;