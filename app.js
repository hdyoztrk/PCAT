const express = require("express")
const mongoose = require('mongoose');
const ejs = require("ejs")
const path = require("path")
const Photo = require("./models/Photo")

const app = express();

//connect db
mongoose.connect('mongodb://127.0.0.1:27017/pcat-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//template engine
app.set("view engine", "ejs")

//mıddlewares
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))//Allows reading the data in the url - It helped to finalize the received request
app.use(express.json())

//routes
app.get('/', async (req, res) => {
    const photos = await Photo.find({})
    res.render("index", {
        photos
    })//index.ejs
})
app.get('/about', (req, res) => {
    res.render("about")
})
app.get('/add', (req, res) => {
    res.render("add")
})
app.post('/photos', async (req, res) => {//add.ejs
    await Photo.create(req.body); //undefined
    res.redirect("/")
})

const port = 3000;

app.listen(port, () => {
    console.log(`sunucu ${port} portunda başlatıldı..`)
});