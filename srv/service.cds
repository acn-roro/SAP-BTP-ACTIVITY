using activity1 as my from '../db/schema';

service CatalogService{
    entity Books as  projection on my.Books;
  //   entity Products as projection on my.PRODUCTS;
  //   entity Supplier as projection on my.SUPPLIERS;
  //   entity Category as projection on my.CATEGORIES;
    
  //   action LogBooks(
  //       borrowerName : String,
  //       bookTitle  : String,
  //       authorName : String,
  //       readDate   : Date )
  //       returns String;  
        
  //   action FetchBooks(borrowerName : String) returns many Books;

  //   action insertTBProducts() returns String;
  //   action insertTBSuppliers() returns String;
  //   action insertTBCategories() returns String;

  //   entity Catalog as select from my.PRODUCTS as p
  //   left join my.SUPPLIERS as s on s.SupplierID = p.SupplierID
  //   left join my.CATEGORIES as c on c.CategoryID = p.CategoryID
  // {
  //   p.ProductID       as ProductID,
  //   p.ProductName     as ProductName,
  //   p.SupplierID      as SupplierID,
  //   s.CompanyName     as CompanyName,
  //   s.Address         as Address,
  //   s.City            as City,
  //   s.Region          as Region,
  //   c.CategoryName    as CategoryName,
  //   c.Description     as Description
  // };

  //   function GetCatalog() returns many Catalog;

};
 

    