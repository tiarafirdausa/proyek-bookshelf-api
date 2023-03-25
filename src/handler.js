const { nanoid } = require('nanoid');
const books = require('./books');

//ADD BOOK
const addBookHandler = (request, h) => {
    //Body Request:
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };
    // books.push(newBook);

    //Server harus merespons gagal bila:
    // 1. Client tidak melampirkan properti name pada request body.
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }

    //2. Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }

    books.push(newBook);

    //Bila buku berhasil dimasukkan
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    return response;
};

//GET ALL BOOKS
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter(book => {
            return book.name.toLowerCase().includes(name.toLowerCase());
        });
    }

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
    }

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
    }

    if (books === undefined) {
        const response = h.response({
            status: 'success',
            data: {
                books: [],
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};


//DETAIL BOOK
const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((book) => book.id === id)[0];

    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};

//EDIT BOOK
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    //Body Request:
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    //Server harus merespons gagal bila:
    //1. Client tidak melampirkan properti name pada request body.
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }

    //Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
    if (readPage > pageCount) {
        // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }

    //Bila berhasil
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };
    
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        })
        response.code(200);
        return response;
    }

    //3. Id yang dilampirkan oleh client tidak ditemukkan oleh server.
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    response.code(404);
    return response;
};


//DELETE BOOK
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
        
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { 
    addBookHandler, 
    getAllBooksHandler, 
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler};
