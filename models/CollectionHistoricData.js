const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionHistoricData = new Schema({
  collectionName: String,
  snapShot: [
    {
      date: Date,
      costPercent: Number,
      totalCost: Number,
      totalRevenue: Number,
      totalMargin: Number,
      itemsSoldPerItem: [
        {
          item: String,
          amount: Number
        }
      ]
    }
  ],
  owner: String
});

mongoose.model('collectionHistoricData', collectionHistoricData);
