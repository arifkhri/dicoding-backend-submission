const {
  addBook,
  getAllBooks,
  getBookById,
  updateNoteById,
  deleteBookById,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  }, {
    method: 'GET',
    path: '/books',
    options: {
      cors: {
        origin: ['*'],
      },
    },
    handler: getAllBooks,
  }, {
    method: 'GET',
    path: '/books/{bookId}',
    options: {
      cors: {
        origin: ['*'],
      },
    },
    handler: getBookById,
  }, {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateNoteById,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  }, {
    method: 'DELETE',
    path: '/books/{bookId}',
    options: {
      cors: {
        origin: ['*'],
      },
    },
    handler: deleteBookById,
  },
];

module.exports = routes;
