const cds = require('@sap/cds');
const { LogBooks } = require('../srv/setter/index');
const { FetchBooks } = require('../srv/getter/index');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

module.exports = async (srv) => {
  /**
   * BEFORE CREATE on Books: logs (borrowerName + readDate).
   * This protects direct entity inserts (without using the action).
   */
  srv.before('CREATE', 'ACTIVITY1_BOOKS', async (req) => {
    const { borrowerName, bookTitle, authorName, readDate } = req.data;

    if (!borrowerName || !bookTitle || !authorName || !readDate) {
      return req.reject(400, 'Missing required parameters: borrowerName, bookTitle, authorName, readDate.');
    }

    const tx = cds.transaction(req);
    const existing = await tx.run(
      SELECT.one
        .from('ACTIVITY1_BOOKS')
        .where({ borrowerName, readDate })
    );

    if (existing) {
      return req.reject(409, `A log already exists for borrower "${borrowerName}" on "${readDate}".`);
    }
  });

  /**
   * Action: LogBooks
   * Define this in your service CDS and call it from clients to insert logs.
   * It delegates to the LogBooks function in setter/index.js and returns a message.
   */
  srv.on('LogBooks', async (req) => {
    const { borrowerName, bookTitle, authorName, readDate } = req.data;

    try {
      const message = await LogBooks(borrowerName, bookTitle, authorName, readDate);
      return message; // 'Successfully Inserted'
    } catch (err) {
      return req.reject(400, err.message || 'Failed to insert book log.');
    }
  });
  
  srv.on('LogBooks', async (req) => {
    const { borrowerName, bookTitle, authorName, readDate } = req.data;
    const result = await LogBooks(borrowerName, bookTitle, authorName, readDate);
    return result; // e.g., 'Successfully Inserted'
   });
   
   srv.on('FetchBooks', async (req) => {
    const { borrowerName } = req.data;
    const result = await FetchBooks(borrowerName);
    return result;
  });
};




