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
})

srv.on('insertTBProducts', async (req) => {
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
      const products = response?.data?.d?.results ?? response?.data?.value ?? response?.data;
      if (!Array.isArray(products) || products.length === 0) {
        return 'No products found in response.';
      }

      // Get CAP entity definitions under alias "my"
      const { PRODUCTS } = cds.entities('my');

      for (const p of products) {
        await tx.run(
          INSERT.into('ACTIVITY1_PRODUCTS').entries({
            ProductID: String(p.ProductID),
            ProductName: String(p.ProductName),
            SupplierID: String(p.SupplierID),
            CategoryID: String(p.CategoryID),
            QuantityPerUnit: String(p.QuantityPerUnit),
            UnitPrice: String(p.UnitPrice),
            UnitsInStock: Number(p.UnitsInStock),
            UnitsOnOrder: Number(p.UnitsOnOrder),
            ReorderLevel: Number(p.ReorderLevel),
            Discontinued: String(p.Discontinued)
          })
        );
      }

      await tx.commit();
      return `Inserted ${products.length} product(s).`;
    } catch (error) {
      await tx.rollback(error);
      req.warn(error.message || String(error));
      // Match action signature: return a String
      return error.message || String(error);
    }
  });

  /** Insert Suppliers from Northwind: returns String */
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

      const suppliers = response?.data?.d?.results ?? response?.data?.value ?? response?.data;
      if (!Array.isArray(suppliers) || suppliers.length === 0) {
        return 'No suppliers found in response.';
      }
      
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
            HomePage: String(s.HomePage)
          })
        );
      }

      await tx.commit();
      return `Inserted ${suppliers.length} supplier(s).`;
    } catch (error) {
      await tx.rollback(error);
      req.warn(error.message || String(error));
      return error.message || String(error);
    }
  });

  /** Insert Categories from Northwind: returns String */
  srv.on('insertTBCategories', async (req) => {
    const tx = cds.transaction(req);
    try {
      const response = await executeHttpRequest(
        { destinationName: 'northwind' },
        {
          method: 'GET',
          url: 'https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json',
          headers: { Accept: 'application/json' },
        }
      );

      const categories = response?.data?.d?.results ?? response?.data?.value ?? response?.data;
      if (!Array.isArray(categories) || categories.length === 0) {
        return 'No categories found in response.';
      }

      const { CATEGORIES } = cds.entities('my');

      for (const c of categories) {
        await tx.run(
          INSERT.into('ACTIVITY1_CATEGORIES').entries({
            CategoryID: String(c.CategoryID),
            CategoryName: String(c.CategoryName),
            Description: String(c.Description)
          })
        );
      }

      await tx.commit();
      return `Inserted ${categories.length} category(ies).`;
    } catch (error) {
      await tx.rollback(error);
      req.warn(error.message || String(error));
      return error.message || String(error);
       }
  });


  srv.on('GetCatalog', async (req) => {
    const tx = cds.transaction(req);
    // OPTIONAL: const { SELECT } = cds; (SELECT is available via cds)
    try {
      // Use the actual namespace of the compiled model:
      const { PRODUCTS, SUPPLIERS, CATEGORIES } = cds.entities('activity1');

      // Safety check (helps during dev):
      if (!PRODUCTS || !SUPPLIERS || !CATEGORIES) {
        return req.reject(500, 'Entities not found. Check model namespace (activity1 vs my).');
      }

      const products   = await tx.run(SELECT.from(PRODUCTS));
      const suppliers  = await tx.run(SELECT.from(SUPPLIERS));
      const categories = await tx.run(SELECT.from(CATEGORIES));

      const supplierById = new Map(suppliers.map(s => [String(s.SupplierID), s]));
      const categoryById = new Map(categories.map(c => [String(c.CategoryID), c]));

      const result = products.map(p => {
        const s = supplierById.get(String(p.SupplierID));
        const c = categoryById.get(String(p.CategoryID));
        return {
          ProductID:    p?.ProductID ?? null,
          ProductName:  p?.ProductName ?? null,
          SupplierID:   p?.SupplierID ?? null,
          CompanyName:  s?.CompanyName ?? null,
          Address:      s?.Address ?? null,
          City:         s?.City ?? null,
          Region:       s?.Region ?? null,
          CategoryName: c?.CategoryName ?? null,
          Description:  c?.Description ?? null,
        };
      });

      return result; // returns many Catalog entries
    } catch (error) {
      return req.reject(500, error.message || 'Failed to fetch catalog.');
    }
  });
};








