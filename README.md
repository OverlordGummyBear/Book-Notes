# Book-Notes
A booknote/review site where it is possible to search for specific books, write a review and save it to a database. Reviews can be edited and deleted. All current reviews will show up on the front page and can be sorted through.

It showcases the use of REST API calls, sever-side rendering with EJS and queries to the database. 

## Features
It is possible to
* Search for books using the Open Library API
* View book covers fetched from the Open Library Covers API
* Write, edit and delete book reviews
* Rate books with a star rating system
* Sort reviews by title, author, rating or date
* View all reviews on the front page

## Setup
1. Clone the repo 
```bash
git clone https://github.com/OverlordGummyBear/Book-Notes.git
```
2. Create a PostgreSQL database with the name "books"
3. Run the script books.sql in the query tool in pgAdmin (or another tool)
4. Change the db = new pg.Client password to your own
5. Run the installation
```bash
cd Book-Notes
npm i
nodemon index.js
```

## Usage
Open `http://localhost:3000` in your browser to view book note website