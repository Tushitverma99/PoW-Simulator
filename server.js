const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const config = require('./api/config.js');
const compression = require('compression');


const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(compression());


app.use('/dist', express.static(__dirname + '/dist'));
app.use('/external', express.static(__dirname + '/external'));

app.use(bodyParser.json());

// // Connect to the database
// mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true });

// // Get the default connection
// const db = mongoose.connection;

// // Event listeners for connection events
// db.on('error', (error) => {
//   console.error('Error connecting to MongoDB:', error);
// });

// db.once('open', () => {
//   console.log('Connected successfully to MongoDB');

//   // Perform database operations here

//   // Close the connection when done
//   mongoose.connection.close();
// });


mongoose.connect(config.mongodb, { useNewUrlParser: true }).then(
  () => { console.log('mongo ready'); },
  err => { console.log(err); }
);


app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

http.listen(8080, function() {
  console.log('BitcoinSimulator Port 8080.');
});


let clients = {};

require('./api/api.js')(app, express, io, clients);
