const requireLogin = require('../middlewares/requireLogin');

const CollectionsHistoricDataController = require('../controllers/collectionHistoricData_controller');

module.exports = app => {
  app.post('/api/collectionhistoricdata', CollectionsHistoricDataController.create);

  app.get('/api/collectionhistoricdata', CollectionsHistoricDataController.index);

  app.put('/api/collectionhistoricdata/edit/:id', CollectionsHistoricDataController.editSingleDataItem);

  app.put(
    '/api/collectionhistoricdata/removeoneTrend/:id',
    CollectionsHistoricDataController.editRemoveFromHistoricData
  );

  app.delete('/api/collectionhistoricdata/:id', CollectionsHistoricDataController.delete);
};
