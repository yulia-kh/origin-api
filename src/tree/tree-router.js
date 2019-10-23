const express = require('express');
const TreeService = require('./tree-service');
const { requireAuth } = require('../middleware/jwt-auth');

const treeRouter = express.Router();

treeRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.user;
    return TreeService.getUserPerson(req.app.get('db'), id)
      .then(person => {
        return TreeService.getParents(req.app.get('db'), person.user_id);
      })
      .then(family => {
        family.map(person => {
          let parents = (family.filter(parent => parent.child_id === person.id));
          let parentsIdArr = [];
          for (let i=0; i<parents.length; i++) {
            parentsIdArr.push(parents[i].id);
          }
          person.parents = parentsIdArr;
       
        });
        console.log(family);
        return res.json(family);

      })
      .catch(next);
  }
  
  ); 


module.exports = treeRouter;