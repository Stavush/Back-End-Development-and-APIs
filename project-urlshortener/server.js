require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
var isUrl = require('is-url'); // package that validats URL

// Basic Configuration
const port = process.env.PORT || 3000;
let counter = 1;
let shortenedUrls = {};

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false}));

//send URL to server and assigning shortened URL
app.post('/api/shorturl', function(req, res){
  const url = req.body.url;
  //check if URL is valid
  if(isUrl(url)){
    shortenedUrls[counter]=url;
  res.send({ original_url: url, short_url: counter});
  counter ++;
  } else{
    res.send({ error: 'invalid url' })
  }
});

//redirected to the original URL when visiting shortened URL
app.get('/api/shorturl/:index', function(req, res) {
  const index = req.params.index;
  const url = shortenedUrls[index];
  res.redirect(url);
});

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
