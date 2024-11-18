const { v2: cloudinary } = require("cloudinary");

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: "dxvracvvl",
    api_key: 441959863866417,
    api_secret: "X4jvJig_cGDyzqdaZB8bgWjbNPs",
  });
};

module.exports = connectCloudinary;
