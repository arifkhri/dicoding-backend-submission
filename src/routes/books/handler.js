const { nanoid } = require('nanoid');

const books = require('./book');
const bookHelper = require('./utils');

const addBook = async (request, h) => {
  const { pageCount, readPage, ...restPayload } = request.payload;
  let response;

  try {
    await bookHelper.validatePayload(request.payload);
    const id = nanoid(16);
    let finished = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (pageCount === readPage) {
      finished = true;
    }

    const newBook = {
      ...restPayload, finished, id, insertedAt, updatedAt, pageCount, readPage,
    };

    books.push(newBook);

    response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  } catch (e) {
    let cstmErr = e;

    if (typeof cstmErr === 'object') {
      cstmErr = JSON.parse(cstmErr.message);
    }

    if (cstmErr.code) {
      response = h.response({
        status: cstmErr.status,
        message: cstmErr.message,
      });

      response.code(cstmErr.code);
    } else {
      response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });

      response.code(500);
    }
  }
  return response;
};

const getAllBooks = async (request, h) => {
  const qParams = request.query;
  let response;

  const bookData = await bookHelper.filterBooks(qParams);

  try {
    response = h.response({
      status: 'success',
      data: {
        books: bookData,
      },
    });

    response.code(200);
  } catch (e) {
    let cstmErr = e;

    if (typeof cstmErr === 'object') {
      cstmErr = JSON.parse(cstmErr.message);
    }

    if (cstmErr.code) {
      response = h.response({
        status: cstmErr.status,
        message: cstmErr.message,
      });

      response.code(cstmErr.code);
    } else {
      response = h.response({
        status: 'fail',
        message: 'Gagal mengambil data Buku',
      });

      response.code(500);
    }
  }
  return response;
};

const getBookById = async (request, h) => {
  const { bookId } = request.params;
  let response;

  try {
    const bookIndex = await bookHelper.checkRecordExist(bookId);

    response = h.response({
      status: 'success',
      data: {
        book: books[bookIndex],
      },
    });

    response.code(200);
  } catch (e) {
    let cstmErr = e;

    if (typeof cstmErr === 'object') {
      cstmErr = JSON.parse(cstmErr.message);
    }

    if (cstmErr.code) {
      response = h.response({
        status: cstmErr.status,
        message: cstmErr.message,
      });

      response.code(cstmErr.code);
    } else {
      response = h.response({
        status: 'fail',
        message: 'Gagal mengambil data Buku',
      });

      response.code(500);
    }
  }

  return response;
};

const updateNoteById = async (request, h) => {
  const { bookId } = request.params;
  const { pageCount, readPage, ...restPayload } = request.payload;
  let response;

  try {
    const bookIndex = await bookHelper.checkRecordExist(bookId, 'Gagal memperbarui buku. Id tidak ditemukan');
    await bookHelper.validatePayload(request.payload, 'memperbarui');
    let finished = false;
    const updatedAt = new Date().toISOString();

    if (pageCount === readPage) {
      finished = true;
    }

    const bookData = {
      ...books[bookIndex],
      ...restPayload,
      finished,
      updatedAt,
      pageCount,
      readPage,
    };

    books[bookIndex] = bookData;

    response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  } catch (e) {
    let cstmErr = e;

    if (typeof cstmErr === 'object') {
      cstmErr = JSON.parse(cstmErr.message);
    }

    if (cstmErr.code) {
      response = h.response({
        status: cstmErr.status,
        message: cstmErr.message,
      });

      response.code(cstmErr.code);
    } else {
      response = h.response({
        status: 'fail',
        message: 'Buku gagal diperbarui',
      });

      response.code(500);
    }
  }
  return response;
};

const deleteBookById = async (request, h) => {
  const { bookId } = request.params;
  let response;

  try {
    const bookIndex = await bookHelper.checkRecordExist(bookId, 'Buku gagal dihapus. Id tidak ditemukan');

    books.splice(bookIndex, 1);

    response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
  } catch (e) {
    let cstmErr = e;

    if (typeof cstmErr === 'object') {
      cstmErr = JSON.parse(cstmErr.message);
    }
    if (cstmErr.code) {
      response = h.response({
        status: cstmErr.status,
        message: cstmErr.message,
      });

      response.code(cstmErr.code);
    } else {
      response = h.response({
        status: 'fail',
        message: 'Gagal menghapus Buku',
      });

      response.code(500);
    }
  }

  return response;
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateNoteById,
  deleteBookById,
};
