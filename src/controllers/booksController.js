const { Book } = require('../models');

const getAll = (request, response) => {
  const keys = Object.keys(request.query);
  let filteredBooks = [];
  let filters = [];
  if (keys.length !== 0) {
    Book.getAll((allBooks) => {
      for (let book of allBooks) {
        filters = keys.filter((key) => {
          if (key === 'title' || key === 'author') {
            return book[key].toLowerCase().split(' ').join('') === request.query[key].toLowerCase().split(' ').join('');
          } else if (key === 'year') {
            return book[key] === Number(request.query[key]);
          } else if (key === 'tag') {
            return book.tags.includes(request.query[key])
          }
        });
        if (filters.length > 0) {
          filteredBooks.push(book);
        }
      }
      if (filteredBooks.length !== 0) {
        return response.status(200).send(filteredBooks);
      }
      console.log(filteredBooks.length);

      return response.status(404).send(
        { message: 'There is no any book that match!!!' }
      );
    });
  } else {
    Book.getAll((allBooks) => {
      response.send(allBooks);
    });
  }
};

const createBook = (request, response) => {
  const body = request.body;
  const newBook = new Book(body);
  Book.getAll((allBooks) => {
    if (allBooks.some((book) => {
      const bookInfo = Object.entries(book).slice(0, 3);
      return bookInfo.every((data) => data[1] === newBook[data[0]]);
    })) {
      return response.status(409).send({
        message: 'This books already exists and books can not be duplicated',
      });
    }
    newBook.save();
    response.status(201).send({
      message: 'Book has been created!',
      guid: newBook.getGuid(),
    });
  });
};

const getByGuid = (request, response) => {
  const { guid } = request.params;
  Book.getAll((allBooks) => {
    const selectedBook = allBooks.find((book) => book.guid === guid);
    if (selectedBook) {
      return response.status(200).send(selectedBook);
    }
    return response.status(404).send({
      message: 'There was no any book with that Guid',
    });
  });
}

const updateBook = (request, response) => {
  const { guid } = request.params;
  const body = request.body;
  Book.getAll((allBooks) => {
    console.log(guid)
    const book = allBooks.find((book) => {
      return book.guid === guid;
    });
    if (book) {
      const duplicatedBook = allBooks.filter((book) => {
        if (book.title === body.title && book.author === body.author && book.year === body.year) {
          return book;
        }
      })
      if (duplicatedBook.length > 0) {
        return response.status(409).send({
          message: 'This books already exists and books can not be duplicated',
        });
      }
      Object.assign(book, body);
      Book.update(allBooks);
      response.send({
        message: 'Book has been updated!',
      });
    } else {
      response.status(404).send({
        message: 'There was no any book with that Guid',
      });
    }
  });
};

const deleteBook = (request, response) => {
  const { guid } = request.params;
  Book.getAll((allBooks) => {
    const bookGuid = allBooks.findIndex((book) => {
      return book.guid === guid
    });
    if (bookGuid !== -1) {
      allBooks.splice(bookGuid, 1);
      Book.update(allBooks);
      return response.status(200).send({
        message: 'Book has been deleted',
      });
    }
    return response.status(404).send({
      message: 'There was no any book with that Guid',
    });
  });
};

module.exports = {
  getAll,
  getByGuid,
  createBook,
  updateBook,
  deleteBook,
};
