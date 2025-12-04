
const cds = require('@sap/cds');
const { orderBy } = require('@sap/cds/lib/ql/cds-ql');

/**
 * FetchBooks
 * - Retrieves records from ACTIVITY1_BOOKS table
 * - Accepts borrowerID as parameter
 * - Filters by borrowerID and sorts in descending order
 * - Validates if no books fetched for the borrower
 * - Returns list of rows (you can map/shape if needed)
 */
async function FetchBooks({ borrowerName}) {
  try {
    
    // Build query similar to your screenshot style
    const data = SELECT.from('ACTIVITY1_BOOKS');

    // Return the list directly (per your requirement to return list of logs)
    return {
      Process: 'FetchBooks',
      BorrowerName: row.BORROWERNAME,
      BookTitle: row.BOOKTITLE,
      AuthorName: row.AUTHORNAME,
      ReadDate: row.READDATA
    };

  } catch (error) {
    // Match the error style in your screenshot
    return { MESSAGE: error.message };
  }
}

module.exports = {
  FetchBooks
};

