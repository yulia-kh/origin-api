const TreeService = {
  getUserPerson(db, userId) {
    return db
      .select('*')
      .from('persons')
      .innerJoin('user_person', 'persons.id', 'user_person.person_id')
      .where('user_person.user_id', userId)
      .then( result => {
        return result[0];
      });
  },

  getParents(db, person) {
    return db
      .from('persons')
      .innerJoin('parent_child', 'persons.id', 'parent_child.parent_id')
      .select('*')
      .where('parent_child.child_id', person.id);
  },
  
  getAncestors(db, person){
    // person.name = `${person.first_name} ${person.last_name}`;
    return this.getParents(db, person).then((parents) => {
      return Promise.all(parents.map((parent) => {
        return this.getAncestors(db, parent);
      }))
        .then((resolvedParents) => {
          person.parents = resolvedParents;
          return person;
        });
    });
  }
};


module.exports = TreeService;