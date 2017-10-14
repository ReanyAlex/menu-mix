const mongoose = require('mongoose');
const { Schema } = mongoose;

const collection = new Schema({
  collectionName: String,
  category: String,
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'menuItem'
    }
  ],
  owner: String
});

mongoose.model('collections', collection);
