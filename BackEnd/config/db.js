const mongoose = require('mongoose');

require('dotenv').config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Atlas Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  }
}

module.exports = connectToDB;