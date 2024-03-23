const express = require("express");
const router = express.Router();
const data = require('../data/product.json')
const fs =require("fs");
const uniqid = require("uniqid");
const path = require('path');
const productPath = path.join(__dirname, '..', 'data', 'product.json');
const orderPath =  path.join(__dirname, '..', 'data', 'order.json');

function readJson(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading JSON file: ${filePath}`);
        console.error(error);
        return []; // Return an empty array or handle the error accordingly
    }
}


function getCategories() {
    const products=readProducts();
    const catogories = [...new Set(products.map(item=> item.category))];
    return catogories;
}


router.get("/",(req, res) => {
    res.status(200).json(data);
})

router.get("/categories",(req, res) => {
    let categories=getCategories();
    res.status(200).json(categories);
})

router.get("/:id",(req, res) => {
    const id =req.params.id;
    const products = readJson(productPath);
    const product = products.find((product) => product.id==id) || "not found";

    if(product){res.status(200).json(product);}
    else { res.status(403).json({message:"Product is not available"});}
})

router.post("/placeOrder", (req, res) => {
    const { firstName, lastName, country, streetAddress1, city, zipcode, subTotal, shipHandling, Total, products, email, phone } = req.body;

    if (!firstName || !lastName || !country || !streetAddress1 || !city || !zipcode || !subTotal || !shipHandling || !Total || !products || !email || phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }
const newOrder = {
    id:uniqid(),
    firstName : firstName,
    lastName :  lastName,
    companyName : req.body.companyName || "",
    country : country,
    StreetAddress1 : streetAddress1,
    StreetAddress2 : req.body.streetAddress2 || "",
    StreetAddress3 : req.body.StreetAddress3 || "",
    city : city,
    Zipcode : zipcode,
    email : email,
    phone : phone,
    products : products,
    subtotal : subTotal,
    shipHandling : shipHandling,
    Total : Total
}
const orders = readJson(orderPath);
orders.push(newOrder);
fs.writeFileSync(orderPath,JSON.stringify(orders));
res.status(201).json(newOrder);
})


module.exports = router;