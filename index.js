import express from "express"; 
import axios from "axios";
import pg from "pg";
import bodyParser from "body-parser";

const app = express(); //create an app using the express object
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let sort = "review_id";
let searchLimit = 50;

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/sort", (req, res) => {
    sort = req.body.sort;
    console.log(sort);
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

    res.render("book.ejs", {
        title: title,
        author: author,
        year: year,
        coverId: coverId
    });
});

app.post("/addBook", (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const year = req.body.year;
    const coverId = req.body.coverId;
    const rating0 = req.body.rating0 || false;
    const rating = rating0 ? 0 : req.body.rating;

});

app.post("/updateReview", (req, res) => {

});

app.delete("/delete", (req, res) => {

});


app.listen(port, () => { 
console.log(`Server running on port ${port}`);
});