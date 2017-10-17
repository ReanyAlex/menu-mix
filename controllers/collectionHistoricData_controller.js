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
        const newHistoricData = new CollectionHistoricData(dataObject);
        console.log('created new document');
        // newHistoricData.save();
      } else {
        //if counter is not zero it means that the date was found within the document
        let counter = 0;

        // console.log('before', data.snapShot);

        data.snapShot.sort(function(a, b) {
          return a.date - b.date;
        });

        console.log('after', data.snapShot);

        data.snapShot.forEach(snap => {
          if (new Date(snapShot[0].date).toString() === snap.date.toString()) counter++;
        });

        if (counter === 0) {
          console.log(counter);
          data.snapShot.push(snapShot[0]);
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
