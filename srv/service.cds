using activity1 as my from '../db/schema';

service CatalogService{
    entity Books as  projection on my.Books;
    entity Products as projection on my.PRODUCTS;
    entity Supplier as projection on my.SUPPLIERS;
    entity Category as projection on my.CATEGORIES;
    
    action LogBooks(
        borrowerName : String,
        bookTitle  : String,
        authorName : String,
        readDate   : Date )
        returns String;  
        
    action FetchBooks(borrowerName : String) returns many Books;

    action insertTBProducts() returns String;
    action insertTBSuppliers() returns String;
    action insertTBCategories() returns String;

    
// Function: returns combined data in one call  
    function fetchCatalog() returns many {
        ProductID    : Integer;
        ProductName  : String;
        SupplierID   : Integer;
        CompanyName  : String;
        Address      : String;
        City         : String;
        Region       : String;
        CategoryName : String;
        Description  : String;
  };
};
 

    