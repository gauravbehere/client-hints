const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express();
const PORT = 4002;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * The app that serves the paypal page can set the CH headers
 */
app.get('/', (req, res) => {
  res.header('ACCEPT-CH', "UA-Full-Version, UA-Mobile, UA-Model, UA-Arch, UA-Platform, ECT, Device-Memory, RTT");
  res.sendFile('index.html');
});

/**
 * Dummy call just to set the CH headers as the first call
 */
app.get('/firstAPI', (req, res) => {
  res.header('ACCEPT-CH', "UA-Full-Version, UA-Mobile, UA-Model, UA-Arch, UA-Platform, ECT, Device-Memory, RTT");
  res.sendStatus(200);
});

/**
 * We get the UA info in the subsequent calls
 */
app.get('/secondAPI', (req, res) => {
  // Observe that in headers we have 
  // sec-ch-ua, device-memory, rtt, sec-ch-ua-mobile, sec-ch-ua-arch, 
  // sec-ch-ua-full-version, ect, sec-ch-ua-model, sec-ch-ua-platform
  console.log(req.headers);
  res.sendStatus(200);
});

/**
 * UA information can also be passed using the JS API
 * Using Post as an example
 */
app.post('/postUA', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

// You can generate your ssl cert & key using the below command
// openssl req -nodes -new -x509 -keyout server.key -out server.cert

// https.createServer({
//   key: fs.readFileSync('ssl-cert/server.key'),
//   cert: fs.readFileSync('ssl-cert/server.cert')
// }, app)
//   .listen(PORT, () => {
//     console.log('Server Started : https://localhost:' + PORT);
//   });

// For some reason in canary, Version 84.0.4137.2 (Official Build) canary (64-bit)
// CH headers are not passed back from browser over https, starting a http server
app.listen(PORT, () => {
    console.log('Server Started : http://localhost:'+ PORT);
});
