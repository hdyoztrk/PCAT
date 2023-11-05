const express = require("express")
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const ejs = require("ejs")
const photoController = require('./controller/photoController')
const pageController = require('./controller/pageController')

const app = express();

//connect db
mongoose.connect('DB Connection Uri', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//template engine
app.set("view engine", "ejs")

//mıddlewares
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))//Allows reading the data in the url - It helped to finalize the received request
app.use(express.json())
app.use(fileUpload());
app.use(methodOverride('_method', {
    methods: ["POST", "GET"]
}));

//routes
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto)
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage)
app.get('/add', pageController.getAddPage)
app.get('/photos/edit/:id', pageController.getEditPage)

const port = 3000;

app.listen(port, () => {
    console.log(`The server is started on port ${port}.`)
});