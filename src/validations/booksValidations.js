const { check, validationResult} = require('express-validator');

const createBook = [
  check('title').exists()
    .withMessage('Title can not be empty!')
    .bail().isString()
    .withMessage('Title contains invalid characters!'),
  check('author').exists()
    .withMessage('Author can not be empty!')
    .bail().isString()
    .withMessage('Author name contains invalid characters!'),
  check('year').exists()
    .withMessage('Year can not be empty!')
    .bail().isNumeric()
    .withMessage('Year must be a number!')
    .bail().custom((value) => {
      const currentYear = new Date().getFullYear();
      if (value > currentYear || value < 1455) throw new Error('Year must be greater than 1454 and not from the future!');
      return true;
    }),
  check('tags').exists()
    .withMessage('Tags required')
    .bail().isArray()
    .withMessage('Tags must be an array')
    .bail().custom((arr) => arr.length > 0)
    .withMessage('Tags array must have at least one element')
    .bail().custom((arr) => arr.every(item => typeof item === 'string'))
    .withMessage('Tags must be an array of strings'),
  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(400).json(errors);
    return next();
  },
];

const updateBook = [

  check('title').exists()
    .withMessage('Title required')
    .bail().isString()
    .withMessage('Title must be a string'),

  check('author').exists()
    .withMessage('Author required')
    .bail().isString()
    .withMessage('Author must be a string'),

  check('year').exists()
    .withMessage('Year required')
    .bail().isNumeric()
    .withMessage('Year must be a number')
    .bail().custom((value) => value > 1454 && value <= new Date().getFullYear())
    .withMessage('Invalid year'),

  check('tags').exists()
  .withMessage('Tags required')
    .bail().isArray()
    .withMessage('Tags must be an array')
    .bail().custom((arr) => arr.length > 0)
    .withMessage('Tags array must have at least one element')
    .bail().custom((arr) => arr.every(item => typeof item === 'string'))
    .withMessage('Tags must be an array of strings'),

  (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors);
  return next();
},
];

module.exports = {
  createBook,
  updateBook,
};
