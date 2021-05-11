const express = require('express');
const { booksController } = require('../controllers');
const { booksValidation } = require('../validations');

const booksResources = express.Router();

booksResources.get('/', booksController.getAll);
booksResources.get('/:guid', booksController.getByGuid);
booksResources.post('/', booksValidation.createBook, booksController.createBook);
booksResources.put('/:guid', booksValidation.updateBook, booksController.updateBook);
booksResources.delete('/:guid', booksController.deleteBook);

module.exports = booksResources;
