const mongoose = require('mongoose')

 const connectDB = async () => {
    await mongoose.connect(
      "mongodb+srv://krithikroshan113:VhmpRtL1ZEU4TvkH@cluster0.uhu71.mongodb.net/food-del?"
    ).then(()=>console.log('DB Connected'))
}

module.exports = connectDB