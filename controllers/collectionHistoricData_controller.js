const mongoose = require('mongoose');
const CollectionHistoricData = mongoose.model('collectionHistoricData');

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
        // console.log('dataObject', dataObject.snapShot);
        const newHistoricData = new CollectionHistoricData(dataObject);
        // console.log('created new document');
        // console.log(newHistoricData.snapShot[0]);
        newHistoricData.save();
      } else {
        //if counter is not zero it means that the date was found within the document
        let counter = 0;

        if (data.snapShot.length >= 1) {
          // console.log('sort');
          data.snapShot.sort(function(a, b) {
            return a.date - b.date;
          });

          data.snapShot.forEach(snap => {
            if (new Date(snapShot.date).toString() === snap.date.toString()) counter++;
          });
        }

        // console.log(snapShot);
        if (counter === 0) {
          // console.log('before push', data.snapShot[0]);
          // console.log('------------------------');
          // console.log('to be pushed', snapShot);
          data.snapShot.push(snapShot);
          // console.log('------------------------');
          // console.log('after push', data.snapShot[0]);
          data.save();
          console.log('added to document');
        } else {
          console.log('already exists');
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
  }
};
