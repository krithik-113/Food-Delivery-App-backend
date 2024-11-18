const foodModel = require('../models/foodModedl')
const cloudinary = require("cloudinary");

// add food item

const addFood = async (req, res) => {
    
    try {
        let imagesUrl = await Promise.all(req.files.image.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, {
              resource_type: "image",
            });
            return result.secure_url;
          })
        );
        console.log(imagesUrl.join(''));
        const food = new foodModel({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          image: imagesUrl.join(''),
        });
        await food.save()
        res.json({success:true,message:"Food Added"})
    } catch (err) {
        console.log(err)
        res.json({success:false,message:err.message})
    }
}

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({success:true,data:foods})
    } catch (err) {
        console.log(err.message)
        req.json({success:false,message:"Error"})
    }
}

// remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`, () => { })
        
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Food Removed"})
    } catch (err) {
        console.log(err.message)
        res.json(({success:false,message:"Error"}))
    }
}

module.exports = {addFood, listFood,removeFood}