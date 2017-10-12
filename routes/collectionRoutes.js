const requireLogin = require('../middlewares/requireLogin');

const CollectionsController = require('../controllers/collections_controller');

module.exports = app => {
  app.post('/api/collection', CollectionsController.create);

  app.get('/api/collection', CollectionsController.index);

  app.put('/api/collection/:id', CollectionsController.edit);

  app.delete('/api/collection/:id', CollectionsController.delete);
};
