const express = require('express');
const contact = require('../controllers/contact.controller');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const contacts = await ContactService.getAllContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.route("/")
    .get(contact.findAll)
    .post(contact.create)
    .delete(contact.deleteAll);

router.route("/favorite")
    .get(contact.findAllFavorite);

router.route("/:id")
    .get(contact.findOne)
    .put(contact.update)
    .delete(contact.delete);

module.exports = router;    