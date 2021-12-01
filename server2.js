var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const axios = require('axios');

// app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  name : String,
  message : String
})

var dbUrl = 'mongodb://localhost:27017/DC-Chat-App2'

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  axios
  .post('http://localhost:3000/communicate', req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

app.post('/communicate', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})


io.on('connection', (socket) =>{
  console.log(io.engine.clientsCount + ' users are connected');
})

app.get("/load", (req, res) => {
  var count = io.engine.clientsCount;
  res.send({load: count});
})

mongoose.connect(dbUrl ,(err) => {
  console.log('mongodb connected',err);
})

app.get("/", (req, res)=>{
  res.sendFile(__dirname + "/index2.html");
})

var server = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});