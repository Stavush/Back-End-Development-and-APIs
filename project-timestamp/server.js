// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

/*let responseObject = {};
app.get("/api/:date_string", (req, res) => {
  //Date String
  var date_string = req.params.date_string; 
  console.log(date_string);
    console.log("date_string: ", date_string);
  if(date_string.includes('-')){
    responseObject['unix'] = new Date(date_string).getTime();
    responseObject['utc'] = new Date(date_string).toUTCString();
  }else{
    date_string = parseInt(date_string);
     responseObject['unix'] = new Date(date_string).getTime();
    responseObject['utc'] = new Date(date_string).toUTCString();
  }
  if(!responseObject['unix'] || !responseObject['utc']){
    res.json({ error : "Invalid Date" });
  }
  res.json(responseObject);
})
app.get('/api', (req,res) => {
   responseObject['unix'] = new Date().getTime();
   responseObject['utc'] = new Date().toUTCString();
   res.json(responseObject);
}) */
app.get('/api/:dateString?', (req, res) => {
	const { dateString } = req.params;
	const timestamp = parseInt(dateString * 1, 10);
	const date = new Date(timestamp || dateString || Date.now());

	let result;
	if (isNaN(+date)) {
		result = { error: 'Invalid Date' };
	} else {
		result = {
			unix: date.getTime(),
			utc: date.toUTCString(),
		};
	}
	res.json(result);
});
  