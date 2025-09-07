const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try { 
    await mongoose.connect("mongodb+srv://techlinker_db_user:techlinker123@cluster0.gwwnfx5.mongodb.net/");
    console.log('db connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// techlinker_db_user  ==username
// techlinker123    ==pass
// mongodb+srv://techlinker_db_user:techlinker123@cluster0.gwwnfx5.mongodb.net/
