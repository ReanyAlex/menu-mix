// const requireLogin = require('../middlewares/requireLogin');

const ItemsController = require('../controllers/items_controller');

module.exports = app => {
  app.post('/api/item', ItemsController.create);

  app.get('/api/item', ItemsController.index);

  app.put('/api/item/:id', ItemsController.edit);

  app.delete('/api/item/:id', ItemsController.delete);
};
