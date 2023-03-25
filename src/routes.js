const { 
    addBookHandler, 
    getAllBooksHandler, 
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler } = require('./handler');

const routes = [
    {
        //ADD BOOK
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },

    {
        //GET ALL BOOK
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },

    {
        //DETAIL BOOK
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdHandler,
    },

    {
        //EDIT BOOK
        method: 'PUT',
        path: '/books/{id}',
        handler: editBookByIdHandler,
    },

    {
        //DELETE BOOK
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookByIdHandler,
    },

];

module.exports = routes;