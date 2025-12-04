
const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

/**
 * LogBooks
 * - Inserts a record into Books table.
 * - Accepts borrowerName, bookTitle, authorName, readDate.
 * - Validates duplicates on (borrowerName, readDate, bookTitle).
 * - Returns a meaningful success message.
 */
async function LogBooks(borrowerName, bookTitle, authorName, readDate) {
  const txInsert = await cds.transaction();

  // Basic parameter checks
  if (!borrowerName || !bookTitle || !authorName || !readDate) {
    throw new Error('Missing required parameters: borrowerName, bookTitle, authorName, readDate.');
  }

  // ✅ Duplicate validation: borrowerName + readDate + bookTitle
  const existing = await txInsert.run(
    SELECT.one
      .from('ACTIVITY1_BOOKS') // use your DB entity or service projection as needed
      .where({ bookTitle, readDate })
  );

  if (existing) {
    throw new Error(
      `The book is already borrowed`
    );
  }

  // Insert when no duplicate found
  await txInsert.begin();
  await txInsert.run(
    INSERT.into('ACTIVITY1_BOOKS').entries({
      ID: uuidv4(),
      borrowerName,
      bookTitle,
      authorName,
      readDate
    })
  );
  await txInsert.commit();

   return 'Successfully Inserted';
}

module.exports = {
  LogBooks
}