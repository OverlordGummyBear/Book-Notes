import express from "express"; 
import axios from "axios";
import pg from "pg";
import bodyParser from "body-parser";

const app = express(); //create an app using the express object
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "wachowiak",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let sort = "book_title";
let searchLimit = 50;

app.get("/", async (req, res) => {
    switch(sort){
        case "book_title":
            sort = "b.title ASC";
            break;
        case "author":
            sort = "b.author ASC";
            break;
        case "rating_upward":
            sort = "r.rating ASC"
            break;
        case "rating_downward":
            sort = "r.rating DESC";
            break;
        case "newest":
            sort = "r.date DESC";
            break;
        case "oldest":
            sort = "r.date ASC";
            break;
    }
    
    try {
        const result = await db.query(
            `SELECT *
            FROM reviews r
            JOIN books b ON b.book_id = r.book_id
            ORDER BY ${sort}`
    );

    const data = result.rows; //check what happens if there are no reviews
    console.log(data);

    res.render("index.ejs", {reviews: data});

    } catch (error) {
        console.log("Could not execute query: ", error);
    }
});

app.post("/sort", (req, res) => {
    sort = req.body.sort;
    res.redirect("/");
});

app.post("/search", async (req, res) => {
    const search = req.body.search;
    const page = req.body.page || 1;

    try{
        const result = await axios.get(`https://openlibrary.org/search.json?q=${search}&limit=${searchLimit}&page=${page}`);

        res.render("search.ejs", {
            total_results: result.data.num_found,
            books: result.data.docs,
            //Next three is for pagination
            pages: Math.round((result.data.num_found  / searchLimit) + 0.5), //make sure to round up
            currentPage: page,
            search: search
        });
    } catch(err){
        console.error("Failed to make request: " + err.message);
    }
});

app.post("/book", async (req, res) => {
    const title = req.body.title;
    const author = req.body.author || 'unknown';
    const year = req.body.year;
    const coverId = req.body.cover_i || 'unknown';

    const response = await db.query(
            `SELECT *
            FROM reviews r
            JOIN books b ON b.book_id = r.book_id`
    );

    //Check whether book already exists in database with a review
    const data = response.rows;
    const isFound = data.find((book) => book.title === title);
    const review = isFound == undefined ? undefined : isFound;

    console.log(review);

    res.render("book.ejs", {
        title: title,
        author: author,
        year: year,
        coverId: coverId,
        review: review
    });
});

app.post("/addBook", async (req, res) => {
    //For book
    const title = req.body.title;
    const author = req.body.author;
    const year = req.body.year;
    const coverId = req.body.coverId == 'unknown' ? null : req.body.coverId;

    //For review
    const rating0 = req.body.rating0 || false;
    const rating = rating0 ? 0 : req.body.rating; //used for checking whether the rating should be 0 stars
    const date = new Date().toISOString();
    const review_title = req.body.reviewTitle;
    const review_text = req.body.reviewText;
    
    try{
        await db.query('BEGIN'); //Use transaction to make insertions can be rolled back in cases where there is an error
        
        const newBook = await db.query(
                `INSERT INTO books(title, author, year, cover_id)
                VALUES($1, $2, $3, $4)
                RETURNING book_id`, 
                [title, author, year, coverId],
        );
        
        const newReview = await db.query(
                `INSERT INTO reviews(date, review_text, rating, review_title, book_id, user_id)
                VALUES($1, $2, $3, $4, $5, 1)`,
                [date, review_text, rating, review_title, newBook.rows[0].book_id]
        );

        await db.query('COMMIT');
    } catch(err){
        await db.query("ROLLBACK");
        console.log("An error occured: ", err);
    }

    res.redirect("/");
});

app.post("/updateReview", async (req, res) => {
    const rating0 = req.body.rating0 || false;
    const rating = rating0 ? 0 : req.body.rating; //used for checking whether the rating should be 0 stars
    const updated_date = new Date().toISOString();
    const review_title = req.body.reviewTitle;
    const review_text = req.body.reviewText;
    const book_id = req.body.bookID;

    try {
        await db.query(
            `UPDATE reviews
            SET rating = $1, review_update_date = $2, review_title = $3, review_text = $4
            WHERE book_id = $5`,
            [rating, updated_date, review_title, review_text, book_id]
        );
    } catch (error) {
        console.log("An error occured: ", err);
    }

    res.redirect("/");
});

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await db.query('BEGIN');

        await db.query(
            `DELETE FROM reviews
            WHERE book_id = $1`,
            [id]
        );

        await db.query(
            `DELETE FROM books
            WHERE book_id = $1`,
            [id]
        );

        await db.query('COMMIT');

        res.sendStatus(200);
    } catch (error) {
        await db.query('ROLLBACK');
        console.log("An error occured: ", error)
    }

    
});


app.listen(port, () => { 
console.log(`Server running on port ${port}`);
});