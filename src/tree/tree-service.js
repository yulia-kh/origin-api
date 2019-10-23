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

  // getParents(db, person) {
  //   return db
  //     .from('persons')
  //     .innerJoin('parent_child', 'persons.id', 'parent_child.parent_id')
  //     .select('*')
  //     .where('parent_child.child_id', person.id);
  // },
  getParents(db, user_id) {
    return db
      .select('*')
      .from('persons')
      .innerJoin('user_person', 'user_person.user_id', 'persons.user_id')
      .leftJoin('parent_child', 'persons.id', 'parent_child.parent_id')
      .where('user_person.user_id', user_id);
  }
  
  // getAncestors(db, person){
  //   return this.getParents(db, person).then((parents) => {
  //     return Promise.all(parents.map((parent) => {
  //       return this.getAncestors(db, parent);
  //     }))
  //       .then((resolvedParents) => {
  //         person.parents = resolvedParents;
  //         return person;
  //       });
  //   });
  // }
};


module.exports = TreeService;