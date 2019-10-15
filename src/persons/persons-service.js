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
  }
};

module.exports = PersonsService;