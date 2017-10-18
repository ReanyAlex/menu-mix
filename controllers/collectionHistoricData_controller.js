const mongoose = require('mongoose');
const CollectionHistoricData = mongoose.model('collectionHistoricData');
const moment = require('moment');

module.exports = {
  create(req, res, next) {
    const owner = req.session.passport.user;
    const { collectionName, snapShot } = req.body;
    const dataObject = req.body;
    dataObject.owner = owner;

    // Find the document
    CollectionHistoricData.findOne({ collectionName }, function(error, data) {
      if (error) return;
      if (data === null) {
        const newHistoricData = new CollectionHistoricData(dataObject);

        newHistoricData.save();
        res.send({ message: `Trend created` });
      } else {
        //if counter is not zero it means that the date was found within the document
        let counter = 0;

        if (data.snapShot.length >= 1) {
          data.snapShot.forEach(snap => {
            const currentDates = moment(snapShot.date).format('L');
            const newDate = moment(snap.date).format('L');
            if (currentDates === newDate) counter++;
          });
        }

        if (counter === 0) {
          data.snapShot.push(snapShot);

          //sort by date
          data.snapShot.sort(function(a, b) {
            return a.date - b.date;
          });

          data.save();
          res.send({ message: `Added SnapShot to ${collectionName}` });
        } else {
          res.send({ message: `SnapShot already exists for this date` });
        }
      }
    });
  },

  index(req, res, next) {
    let searchQuery;
    const owner = req.session.passport.user;
    const { search, id } = req.query;

    if (id === undefined) {
      searchQuery = { collectionName: new RegExp(search, 'i'), owner };
    } else {
      searchQuery = { _id: id, owner };
    }
    CollectionHistoricData.find(searchQuery)
      .then(collections => {
        res.send(collections);
      })
      .catch(next);
  },

  editSingleDataItem(req, res, next) {
    const id = req.params.id;
    const { collectionName, date, snapShot } = req.body;

    let indexToRemove = 999;

    CollectionHistoricData.find({ collectionName }).then(collection => {
      collection[0].snapShot.forEach((data, i) => {
        if (moment(date).format('L') === moment(data.date).format('L')) {
          indexToRemove = i;
        }
      });

      collection[0].snapShot.splice(indexToRemove, 1, snapShot);

      collection[0].save().then(() => {
        res.send(collection[0]);
      });
    });
  },

  editRemoveFromHistoricData(req, res, next) {
    const id = req.params.id;
    const { collectionName, date } = req.body;

    let indexToRemove = 999;

    CollectionHistoricData.find({ collectionName }).then(collection => {
      collection[0].snapShot.forEach((snapShot, i) => {
        if (moment(date).format('L') === moment(snapShot.date).format('L')) {
          indexToRemove = i;
        }
      });

      collection[0].snapShot.splice(indexToRemove, 1);

      collection[0].save().then(() => {
        res.send(collection[0]);
      });
    });
  },

  delete(req, res, next) {
    const id = req.params.id;

    CollectionHistoricData.findByIdAndRemove(id)
      .then(item => res.status(204).send(item))
      .catch(next);
  }
};
