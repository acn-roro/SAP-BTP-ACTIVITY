using activity1 as my from '../db/schema';

service CatalogService{
    entity Books as  projection on my.Books;
    entity Products as projection on my.PRODUCTS;

    
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

    function GetCatalog() returns many String;

};
 

    