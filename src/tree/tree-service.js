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
  
  getAncestors(db, userId){
    return db
      .from('persons')
      .leftJoin('parent_child', 'persons.id', 'parent_child.parent_id')
      .select('*')
      .where('persons.user_id', userId);
  }
};


module.exports = TreeService;