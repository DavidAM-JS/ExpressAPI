const express = require('express');
const { booksResources } = require('../resources');

const router = express.Router();
router.use('/books', booksResources);

module.exports = router;
