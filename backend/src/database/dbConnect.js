const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongoDB = async () => {
  try {
    // const dbUri = process.env.MONGODB_URI; 
    const dbUri = "mongodb+srv://sivoc:LitCircle@litcircle.sv9ia2i.mongodb.net/LitCircle"
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
};

module.exports = connectToMongoDB;
