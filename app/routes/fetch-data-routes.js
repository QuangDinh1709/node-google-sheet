const {getData, updateData} = require('./../../service/data');

module.exports = function(app, db) {
  app.get('/',(req, res) => {
    res.send('Hello');
  }),

  app.post('/getData',(req, res) => {
    getData(req.body)
      .then((result) => {
        res.send(result);
      }).catch((err) => {
        res.status(400).send(err);
      });
  }),

  app.post('/updateData', (req, res) => {
    updateData(req.body)
      .then((result) => {
        res.send(result);
      }).catch((err) => {
        res.status(400).send(err);
      })
  })
};
