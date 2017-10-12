const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuItem = new Schema({
  name: String,
  cost: Number,
  price: Number
});

mongoose.model('menuItem', menuItem);
