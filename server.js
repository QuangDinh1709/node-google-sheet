const express = require('express');
const hbs = require('hbs');

const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const googleapis = require('./google-sheet/quickstart');

var querystring = require('query-string');
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine','hbs');

app.use(bodyParser.json());

hbs.registerHelper('getCurrentYear',() => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text) =>{
  return text.toUpperCase();
});

app.get('/',(req, res) => {

  res.render('home.hbs',{
    pageTitle : 'Home Page Sheet Page',
    welcomeMessage : 'Welcome to my website'
  });

});

app.get('/about',(req, res) => {
  res.send('Pending');
});

app.get('/sheet',(req, res) => {

  res.render('sheet.hbs');

});

app.post('/sheet/fetch', (req, res) => {
    var body = '';
    var POST = '';
    req.on('data', function (data) {
      body += data;
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        req.connection.destroy();
      }
    });
    req.on('end', function () {
      POST = querystring.parse(body);
      console.log(POST);
    });

    googleapis.readSheet((rowData) => {
      // for (var i = 0; i < rowData.length; i++) {
      //   var rowColum = rowData[i];
      //   // Print columns A and E, which correspond to indices 0 and 4.
      //   console.log('%s', rowColum[1]);
        res.send(rowData);
      //}
    });
    //var rows = googleapis.getData();
    //res.send('Hello');

});

app.get('/sheet/:sheetId',(req , res) => {
  var sheetId = req.params.sheetId;
  res.send(`Fetch Data from Sheet Google sheet ${sheetId}`);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
