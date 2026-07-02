import express from "express"; 
import axios from "axios";
import pg from "pg";
import bodyParser from "body-parser";

const app = express(); //create an app using the express object
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => { 
console.log(`Server running on port ${port}`);
});