const mongoose = require('mongoose');
const Collections = mongoose.model('collections');

module.exports = {
  create(req, res, next) {
    const owner = req.session.passport.user;
    const { collectionName, category, items } = req.body;
    const newCollection = new Collections({ collectionName, category, items, owner });
    newCollection.save();
    res.redirect('/');
  },

  index(req, res, next) {
    let searchQuery;
    const owner = req.session.passport.user;
    const { search, id } = req.query;
    if (id === undefined) {
      searchQuery = { collectionName: new RegExp(search, 'i'), owner };

      // searchQuery = { collectionName: new RegExp(search, 'i'), owner };
    } else {
      searchQuery = { _id: id, owner };
    }

    Collections.find(searchQuery)
      .populate('items')
      .then(collections => {
        res.send(collections);
      })
      .catch(next);
  },

  edit(req, res, next) {
    const id = req.params.id;
    const itemProps = req.body;
    Collections.findByIdAndUpdate(id, { $set: itemProps })
      .then(() => Collections.findById(id))
      .then(item => {
        res.send(item);
      })
      .catch(next);
  },

  delete(req, res, next) {
    const id = req.params.id;

    Collections.findByIdAndRemove(id)
      .then(item => res.status(204).send(item))
      .catch(next);
  }
};
