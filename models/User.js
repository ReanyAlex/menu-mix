const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  companyName: String,
  phoneNumber: String,
  address: String
});

mongoose.model('users', userSchema);
