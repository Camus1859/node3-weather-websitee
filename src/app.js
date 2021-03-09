const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forcast = require('./utils/forecast');
const geoCode = require('./utils/geocode');

const app = express();
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public/');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Anderson Laventure',
  });
});

const publicDirectoryPathHelp = path.join(__dirname, '../public/help.html');
const publicDirectoryPathAbout = path.join(__dirname, '../public/about.html');

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Anderson Laventure',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'Error loading page',
    title: 'help',
    name: 'Anderson Laventure',
  });
});

app.use(express.static(publicDirectoryPathHelp));
app.use(express.static(publicDirectoryPathAbout));

app.get('/help', (req, res) => {
  res.send({
    name: 'Anderson',
    age: 32,
  });
});

app.get('/about', (req, res) => {
  res.send('<h1>About</h1>');
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({ error });
  }
  geoCode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forcast(latitude, longitude, (error, forcastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        forcast: forcastData,
        location,
        address: req.query.address,
      });
    });
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide  a search term',
    });
  }

  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.send('Help article not find');
});

app.get('*', (req, res) => {
  res.send('My 404 Page');
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
