const cds = require('@sap/cds');
const { LogBooks } = require('../srv/setter/index');
const { FetchBooks } = require('../srv/getter/index');


module.exports = async (srv) => {
  srv.on('LogBooks', async (req) => {
    const { borrowerName, bookTitle, authorName, readDate } = req.data;
    const result = await LogBooks(borrowerName, bookTitle, authorName, readDate);
    return result; // e.g., 'Successfully Inserted'
   });
   
   srv.on('FetchBooks', async (req) => {
    const { borrowerName } = req.data;
    try {
    const rows = await FetchBooks({ borrowerName }, req);
    return rows; // MUST return a payload
  } catch (err) {
    const isNotFound = /No books found/i.test(err.message);
    return req.reject(isNotFound ? 404 : 400, err.message);
  }
});








}
