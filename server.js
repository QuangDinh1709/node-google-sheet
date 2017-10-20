const express = require('express');
const hbs = require('hbs');

const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

var querystring = require('query-string');
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

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

  console.log('AAAA');

  res.render('home.hbs',{
    pageTitle : 'Home Page Sheet Page',
    welcomeMessage : 'Welcome to my website'
  });

});

app.get('/about',(req, res) => {
  res.render('about.hbs', {
    pageTitle : 'About Page ',
    welcomeMessage : 'Welcome to my website'
  });
});

app.get('/sheet',(req, res) => {

  res.render('sheet.hbs', {
    pageTitle : 'Fetch Data form Sheet Google Page ',
  });

});

app.get('/sheet/fetch',(req, res) => {
    var sheetkey = req.query.sheetkey;
    var sheetid = req.query.sheetid;

    for(var param  in req.query) {
      console.log(param, req.query[param]);
    };

    var doc = new GoogleSpreadsheet(req.query['sheetkey']);
    doc.useServiceAccountAuth(creds, function (err) {
      doc.getRows(req.query['sheetid'],{
        offset: 1,
        orderby: '追加設置可能数'
        // query: `computername=EA用社内PC59`
      },function(err,rows) {
        if(err) {
          console.log(err);
          return res.status(400).send()
        }

        var computername = rows[0]._cn6ca;
        var acesspoint = rows[0].接続先;
        var username = rows[0].ユーザー名;
        var password = rows[0].パスワード;

        console.log(computername,acesspoint,username,password);

        var jenkins = require('jenkins')({ baseUrl: req.query['url'], crumbIssuer: true });
        jenkins.job.build({ name :req.query['build'], parameters :
        {
          'PARAM_COMPUTERNAME' : computername,
          'PARAM_ACEES_POINT' : acesspoint,
          'PARAM_USER' : username,
          'PARAM_PASSWORD' : password
        }},(err,data) => {
          if(err)
          {
            console.log('ERROR ',err);
            return res.status(400).send();
          }
          var number = parseInt(rows[0].追加設置可能数);
          console.log(number);
          rows[0].追加設置可能数 = number + 1;
          rows[0].save((err, data) => {
              if(err) {
                console.log(err);
                return res.status(400).send();
              }
              res.status(200).send();
          });

        });
      });
    });
});


app.post('/sheet/fetch', (req,res) => {

  var doc = new GoogleSpreadsheet('1B3nZwqs7Xzd7bXlDYfT_c_PBzqwfhFdCmA7GugGR5cc');
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(2,{
      offset: 1,
      orderby: '追加設置可能数',
      // query: `computername=EA用社内PC59`
    },function(err,rows) {
      if(err) {
        return console.log(err);
      }
      res.send(rows[0]);
    });
  });
  //  console.log(req);
  // res.send('POST OK');
});


// app.get('/sheet/fetch',(req, res) => {
//     console.log(req.query.a);
//     console.log(querystring.parse(req.query));
//     res.send('Hello Get method');
// });


// app.post('/sheet/fetch', (req, res) => {
//     var body = '';
//
//     req.on('data', function (data) {
//       body += data;
//       // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
//       if (body.length > 1e6) {
//         // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
//         req.connection.destroy();
//       }
//     });
//
//     req.on('end', function () {
//       POST = querystring.parse(body);
//       console.log(POST);
//
//       // var doc = new GoogleSpreadsheet('1B3nZwqs7Xzd7bXlDYfT_c_PBzqwfhFdCmA7GugGR5cc');
//       // var temp = encodeURIComponent("Core 2 Duo E7400");
//       // console.log(temp);
//       // doc.useServiceAccountAuth(creds, function (err) {
//       //     doc.getRows(1,{
//       //       offset: 1,
//       //
//       //       // orderby: 'number',
//       //       query: `computername=EA用社内PC59`
//       //     },function(err,rows) {
//       //       if(err) {
//       //         return res.status(400).send(err);
//       //       }
//       //       // var data = {
//       //       //   'computername' : rows[0].computername,
//       //       //   'username' : rows[0].username,
//       //       //   'password' : rows[0].password
//       //       // };
//       //       // res.send(data);
//       //       var p = parseInt(rows[0].number, 10);
//       //       console.log(typeof p);
//       //       rows[0].number = p + 1;
//       //       rows[0].save(() => {
//       //           res.send(rows);
//       //       });
//       //
//       //     });
//       //   });
//     });
//
//     res.send('Hello Again ');
//
// });

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
