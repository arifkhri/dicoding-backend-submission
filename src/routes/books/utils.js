const books = require('./book');

function validatePayload(reqPayload, type = 'menambahkan') {
  return new Promise((resolve, reject) => {
    const { pageCount, readPage, name } = reqPayload;

    if (typeof pageCount === 'string' || typeof readPage === 'string') {
      reject(new Error(JSON.stringify({ code: 400, status: 'fail', message: `Gagal ${type} buku. readPage atau pageCount harus number` })));
    }

    if (pageCount < readPage) {
      reject(new Error(JSON.stringify({ code: 400, status: 'fail', message: `Gagal ${type} buku. readPage tidak boleh lebih besar dari pageCount` })));
    }
    if (!name) {
      reject(new Error(JSON.stringify({ code: 400, status: 'fail', message: `Gagal ${type} buku. Mohon isi nama buku` })));
    }

    resolve(true);
  });
}

function checkRecordExist(bookId, message) {
  return new Promise((resolve, reject) => {
    const index = books.findIndex((n) => n.id === bookId);
    if (index < 0) {
      reject(new Error(JSON.stringify({ code: 404, status: 'fail', message: message || 'Buku tidak ditemukan' })));
    }

    resolve(index);
  });
}

function filterBooks(qParams) {
  return new Promise((resolve) => {
    const bookData = [];

    [...books].forEach((book) => {
      const { id: bookID, name: bookName, publisher: bookPublisher } = book;
      const { finished = undefined, reading = undefined, name = undefined } = qParams;

      if (finished !== undefined) {
        const finishedStatus = finished === '1'; // convert to boolean
        if (book.finished === finishedStatus) {
          bookData.push({ id: bookID, name: bookName, publisher: bookPublisher });
        }
      }

      if (reading !== undefined) {
        const readingStatus = reading === '1'; // convert to boolean
        if (book.reading === readingStatus) {
          bookData.push({ id: bookID, name: bookName, publisher: bookPublisher });
        }
      }

      if (name !== undefined) {
        if (book.name.toLowerCase().includes(name.toLowerCase())) {
          bookData.push({ id: bookID, name: bookName, publisher: bookPublisher });
        }
      }

      if (finished === undefined && reading === undefined && name === undefined) {
        bookData.push({ id: bookID, name: bookName, publisher: bookPublisher });
      }
    });

    resolve(bookData);
  });
}

module.exports = { validatePayload, checkRecordExist, filterBooks };
