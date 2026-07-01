import express from "express" 
const app = express(); //create an app using the express object
const port = 3000;

app.listen(port, () => { 
console.log(`Server running on port ${port}`);
});