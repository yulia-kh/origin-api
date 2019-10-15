// const xss = require('xss');

const PersonsService = {
  getAllParents(db) {
    return db
      .from('persons')
      .select(
        'id',
        'first_name',
        'last_name',
        'date_of_birth',
        'date_of_death',
        'details'
      );
  },

  insertParent(db, newParent){
    return db
      .insert(newParent)
      .into('persons')
      .returning('*');
  },

  insertRelation(db, newRelation) {
    return db
      .insert(newRelation)
      .into('parent_child')
      .returning('*');
  },

  deletePerson(db, id) {
    return db('persons')
      .where({id})
      .delete();
  }
    
};


module.exports = PersonsService;