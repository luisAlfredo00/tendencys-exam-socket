const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var contries; 
var states;
var guides = 0;

app.use('/public', express.static(path.join(__dirname, 'front-side')));
app.set('view engine', 'ejs');  
app.get('/', (req, res) => {

    const request = require('request');
    request('https://queries.envia.com/country', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
        contries = body.data;
        
    });
    const request2 = require('request');
    request2('http://queries.envia.com/state?country_code=MX', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
        states = body.data;
    });
    if(states != null && contries != null){
        res.render('index', {data: {datacountry: contries, datastates : states}});
        
    }
    
});

io.on('connection', (socket) => {
    console.log("Connect");
    socket.on('newGuide', (guid) => {
        guides = guides + guid;
        io.emit('newGuide', guides);
        
        
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
}); 




