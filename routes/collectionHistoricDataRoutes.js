const requireLogin = require('../middlewares/requireLogin');

const CollectionsHistoricDataController = require('../controllers/collectionHistoricData_controller');

module.exports = app => {
  app.post('/api/collectionhistoricdata', CollectionsHistoricDataController.create);

  app.get('/api/collectionhistoricdata', CollectionsHistoricDataController.index);
  //
  //   app.put('/api/collection/:id', CollectionsHistoricDataController.edit);
  //
  //   app.delete('/api/collection/:id', CollectionsHistoricDataController.delete);
};
