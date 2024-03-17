const express = require('express');
const app = express();
const port = 8080;
const userRoutes = require("./routes/user");
const cors = require("cors");
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    //console.log("Link validation middleware");
    next(); 
})


app.use("/products", userRoutes);


app.get('/', (req, res) => {
    res.send("Welcome to the visual world");
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});