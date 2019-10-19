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
  
  getUserParents(db, user){
    return db
      .from('persons')
      .innerJoin('parent_child', 'persons.id', 'parent_child.parent_id')
      .innerJoin('user_person', 'user_person.person_id', 'parent_child.child_id')
      .select('*')
      .where('user_person.user_id', user.id)
      .then( parents => {
        user.parents = parents;
        console.log(user);
        return user;
      });
  }
   
  
 
};

module.exports = TreeService;