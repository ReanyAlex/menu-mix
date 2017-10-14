const mongoose = require('mongoose');
const MenuItem = mongoose.model('menuItem');

module.exports = {
  create(req, res, next) {
    const owner = req.session.passport.user;

    req.body[0].map(item => {
      const { itemName, itemCategory, itemCost, itemPrice } = item;
      const name = itemName;
      const category = itemCategory;
      //values associated with money is stored in cents
      const cost = itemCost * 100;
      const price = itemPrice * 100;

      const newMenuItem = new MenuItem({ name, category, cost, price, owner });
      console.log(newMenuItem);
      newMenuItem.save();
    });
    res.send({ message: 'Items created' });
  },

  index(req, res, next) {
    const owner = req.session.passport.user;

    MenuItem.find({ name: new RegExp(req.query.search, 'i'), owner })
      .then(items => res.send(items))
      .catch(next);
  },

  edit(req, res, next) {
    const id = req.params.id;
    const itemProps = req.body;
    MenuItem.findByIdAndUpdate(id, { $set: itemProps })
      .then(() => MenuItem.findById(id))
      .then(item => {
        console.log(item);
        res.send(item);
      })
      .catch(next);
  },

  delete(req, res, next) {
    const id = req.params.id;

    MenuItem.findByIdAndRemove(id)
      .then(item => res.status(204).send(item))
      .catch(next);
  }
};
