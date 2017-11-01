const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

require('./app/routes') (app, {});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
