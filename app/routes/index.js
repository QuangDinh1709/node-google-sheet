const fetchDataRoutes = require('./fetch-data-routes');

module.exports = function(app, db) {
  fetchDataRoutes(app,db);
};
