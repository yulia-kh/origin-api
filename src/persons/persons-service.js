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

  getOnePerson(db, id) {
    return db
      .from('persons')
      .select('*')
      .innerJoin('parent_child', 'persons.id', 'parent_child.parent_id')
      .where({id});
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
  },

  updatePerson(db, id, newPersonsFields) {
    return db('persons')
      .where({ id })
      .update(newPersonsFields)
      .returning('*');
  },
  
  updateRelation(db, parent_id, newRelationField){
    return db('parent_child')
      .where({ parent_id })
      .update(newRelationField);
  }
};


module.exports = PersonsService;