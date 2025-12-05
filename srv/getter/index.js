
const cds = require('@sap/cds');

async function FetchBooks({ borrowerName }, req) {
  if (!borrowerName) throw new Error('Missing required parameter: borrowerName.');

  const { Books } = cds.entities('ACTIVITY1_BOOKS');
  const tx = cds.transaction(req);

  const rows = await tx.run(
    SELECT.from('ACTIVITY1_BOOKS')
      .where({ borrowerName })
      .orderBy({borrowerName: 'desc'}) // typical for logs: latest first
  );

  if (!rows?.length) throw new Error(`No books found for borrower "${borrowerName}".`);
  return rows; // matches 'many Books'
}


module.exports = {
  FetchBooks
}