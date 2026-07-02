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
    //can have hidden attributes, so use that

    const page = req.body.page || 1;

    try{
        const result = await axios.get(`https://openlibrary.org/search.json?q=${search}&limit=${searchLimit}&page=${page}`);

        res.render("search.ejs", {
            total_results: result.data.num_found,
            books: result.data.docs,
            pages: Math.round((result.data.num_found  / searchLimit) + 0.5), //make sure to round up
            currentPage: page,
            search: search
        });
    } catch(err){
        console.error("Failed to make request: " + err.message);
    }
});

app.get("/new", (req, res) => {

});

app.post("/edit", (req, res) => {

});

app.post("/delete", (req, res) => {

});


app.listen(port, () => { 
console.log(`Server running on port ${port}`);
});