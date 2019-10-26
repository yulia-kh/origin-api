const express = require('express');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, first_name, last_name } = req.body;
    for (const field of ['first_name', 'last_name', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    const passwordError = UsersService.validatePassword(password);
    if (passwordError)
      return res.status(400).json({error: passwordError});

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: 'Username already taken' });
        
        return UsersService.hashPassword(password)
          .then (hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
            };
            
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                const user_id = user.id;
                const newPerson = {first_name, last_name, user_id};
                return UsersService.insertPerson(req.app.get('db'), newPerson)
                  .then(person => {
                    const person_id = person[0].id;
                    const newUserPerson = {user_id, person_id};
                    return UsersService.insertUserPerson(req.app.get('db'), newUserPerson)
                      .then(userPerson => {
                        res
                          .status(201).json(userPerson[0]);
                      });
                  });  
              });
          });  
      })
      .catch(next);
  });

module.exports = usersRouter;