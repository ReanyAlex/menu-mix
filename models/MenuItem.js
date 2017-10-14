const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuItem = new Schema({
  name: String,
  category: String,
  cost: Number,
  price: Number,
  owner: String
});

mongoose.model('menuItem', menuItem);
