const express = require('express');

const memberRouter = express.Router();
const jsonBodyParser = express.json();

memberRouter
  route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const { member_first_name, member_last_name, date_of_birth, date_of_death, description, parent_id, child_id } = req.body;
    const  new
  })

module.exports = memberRouter;