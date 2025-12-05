const cds = require('@sap/cds');
const { LogBooks } = require('../srv/setter/index');
const { FetchBooks } = require('../srv/getter/index');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');


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



module.exports = (srv) => {
  srv.on('insertTBProducts', async (req) => {
    // Start a transaction scoped to this request
    const tx = cds.transaction(req);

    try {
      const response = await executeHttpRequest(
        { destinationName: 'northwind' },
        {
          method: 'GET',
          url: 'https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json',
          headers: { Accept: 'application/json' },
        }
      );

      // OData v3: { d: { results: [...] } }, v4: { value: [...] }
      const products =
        response?.data?.d?.results ??
        response?.data?.value ??
        response?.data;

      if (!Array.isArray(products) || products.length === 0) {
        return { MESSAGE: 'No products found in response.' };
      }

      // Insert each product using a for...of loop
      for (const p of products) {
        await tx.run(
          INSERT.into('ACTIVITY1_PRODUCTS').entries({
            ProductID: String(p.ProductID),
            ProductName: String(p.ProductName),
            SupplierID: String(p.SupplierID),
            CategoryID: String (p.CategoryID),
            QuantityPerUnit: String(p.QuantityPerUnit),
            UnitPrice: String(p.UnitPrice),
            UnitsInStock: Number(p.UnitsInStock) ,
            UnitsOnOrder: Number(p.UnitsOnOrder),
            ReorderLevel: Number(p.ReorderLevel),
            Discontinued: String(p.Discontinued)
            })
        );
      }

      await tx.commit();
      return { MESSAGE: `Inserted ${products.length} product(s).` };
    } catch (error) {
      await tx.rollback(error);
      req.warn(error.message || String(error));
      return { MESSAGE: error.message || String(error) };
    }
   });


module.exports = (srv) => {
srv.on('insertTBSuppliers', async (req) => {
    const tx = cds.transaction(req);

    try {
      const response = await executeHttpRequest(
        { destinationName: 'northwind' },
        {
          method: 'GET',
          url: 'https://services.odata.org/V3/Northwind/Northwind.svc/Suppliers?$format=json',
          headers: { Accept: 'application/json' },
        }
      );
      
// OData v3: { d: { results: [...] } }, v4: { value: [...] }
      const suppliers =
        response?.data?.d?.results ??
        response?.data?.value ??
        response?.data;

      if (!Array.isArray(suppliers) || suppliers.length === 0) {
        return { MESSAGE: 'No suppliers found in response.'};
      }
      
      // Insert each supplier using a for...of loop
      for (const s of suppliers) {
        await tx.run(
          INSERT.into('ACTIVITY1_SUPPLIERS').entries({
            SupplierID: String(s.SupplierID),
            CompanyName: String(s.CompanyName),
            ContactName: String(s.ContactName),
            ContactTitle: String(s.ContactTitle),
            Address: String(s.Address),
            City: String(s.City),
            Region: String(s.Region),
            PostalCode: String(s.PostalCode),
            Country: String(s.Country),
            Phone: String(s.Phone),
            Fax: String(s.Fax),
            HomePage: String(s.HomePage),
          })
        );
      }
      await tx.commit();
      return { MESSAGE: `Inserted ${suppliers.length} supplier(s).` };
    } catch (error) {
      await tx.rollback(error);
      req.warn(error.message || String(error));
      return { MESSAGE: error.message || String(error) };
    }
  });
};
}



module.exports = (srv) => {

  // Match your action/function name in service.cds, e.g.
  // function fetchProducts() returns array of Products;
  srv.on('insertTBCategories', async (req) => {
    try {
      const response = await executeHttpRequest(
        { destinationName: 'northwind' },
        {
          method: 'GET',
          url: 'https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json',
          headers: { 'Accept': 'application/json' }
        }
      );

      // OData v3: { d: { results: [...] } }
      const data = response?.data?.d?.results ?? response?.data?.value ?? response?.data;
      return data;
    } catch (error) {
      req.warn(error.message || String(error));
      return { MESSAGE: error.message || String(error) };
       }
  });


}
