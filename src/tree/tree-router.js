const express = require('express');
const TreeService = require('./tree-service');
const { requireAuth } = require('../middleware/jwt-auth');

const treeRouter = express.Router();

treeRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.user;
    let rootId;
    return TreeService.getUserPerson(req.app.get('db'), id)
      .then(person => {
        rootId = person.id;
        return TreeService.getParents(req.app.get('db'), person.user_id);
      })
      .then(family => {
        const familyObj = family.reduce((obj, item) => {
          obj[item.id] = item;
          return obj;
        }, {});
        family.forEach(person => {
          if(person.child_id !== null){
            if(!Array.isArray(familyObj[person.child_id].parents)) {
              familyObj[person.child_id].parents = [];
            }
            familyObj[person.child_id].parents.push(person.id);
          }       
        });
        return res.json({
          rootId: rootId,
          family: familyObj
        });
      })
      .catch(next);
  }); 

module.exports = treeRouter;