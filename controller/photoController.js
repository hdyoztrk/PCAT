const Photo = require("../models/Photo")
const fs = require("fs")

exports.getAllPhotos = async (req, res) => {
    const page = req.query.page || 1;
    const photosPerPage = 3;
    const totalPhotos = await Photo.find().countDocuments();//total number of images
    const photos = await Photo.find({})
        .sort("-dateCreated")//multiple photo
        .skip((page - 1) * photosPerPage)
        .limit(photosPerPage)
    res.render("index", {
        photos: photos,
        currentPage: page,
        pages: Math.ceil(totalPhotos / photosPerPage)
    })//index.ejs
}

exports.getPhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id) //will find out which id value it is
    res.render("photo", {//routes
        photo
    })
}

exports.createPhoto = async (req, res) => {//add.ejs
    const uploadDir = "public/uploads";

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
    }

    let uploadeImage = req.files.image
    let uploadPath = __dirname + "/../public/uploads/" + uploadeImage.name;

    uploadeImage.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: "/uploads/" + uploadeImage.name,
        });
        res.redirect("/");
    })
}

exports.updatePhoto = async (req, res) => {//update
    const photo = await Photo.findOne({ _id: req.params.id });
    photo.title = req.body.title
    photo.description = req.body.description
    photo.save()

    res.redirect(`/photos/${req.params.id}`)
}

exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    let deletedImage = __dirname + '/../public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove(req.params.id);
    res.redirect('/');
}