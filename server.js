const express = require('express');
const hbs = require('hbs');

const port = 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine','hbs');

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

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
