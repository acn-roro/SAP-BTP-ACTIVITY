using activity1 as my from '../db/schema';

service CatalogService{
    entity Books as  projection on my.Books;

    action LogBooks(
        borrowerName : String,
        bookTitle  : String,
        authorName : String,
        readDate   : Date )
        returns String;  
        
    action FetchBooks(borrowerName : String)
   
};
 

    