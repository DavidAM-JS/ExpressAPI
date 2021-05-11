const { check, validationResult} = require('express-validator');

const validateBook = [
  check('title').exists()
    .withMessage('The title can not be empty')
    .bail().isString()
    .withMessage('The title contains invalid characters'),
  check('author').exists()
    .withMessage('There are invalid characters in author name')
    .bail().isString()
    .withMessage('There are invalid characters in author name'),
  check('year').exists()
    .withMessage('The year can not be empty')
    .bail().isNumeric()
    .withMessage('The year has to be a number')
    .bail().custom((value) => {
      const currentYear = new Date().getFullYear();
      if (value > currentYear || value < 1455) throw new Error('The book year has to be greater than 1454 and smaller from the current Date');
      return true;
    }),
  check('tags').exists()
    .withMessage('Some tags are required')
    .bail().isArray()
    .withMessage('The tags have to be an array')
    .bail().custom((arr) => arr.length > 0)
    .withMessage('The array of tags must contain at least one element')
    .bail().custom((arr) => arr.every(item => typeof item === 'string'))
    .withMessage('The tags must be an array of strings'),
  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(400).json(errors);
    return next();
  },
];

module.exports = {
  validateBook,
};
