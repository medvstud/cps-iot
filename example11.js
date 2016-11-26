var http = require("http").createServer(handler); //on request use handler
var io = require("socket.io").listen(http); //socket library
var fs = require("fs"); //var for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){ 
    console.log("Connecting to Arduino");
    console.log("Enabling analog Pin 0");
    board.pinMode(0, board.MODES.ANALOG); // analog pin 0
    console.log("Enabling analog Pin 1");
    board.pinMode(1, board.MODES.ANALOG); // analog pin 1
    
});
 function handler (req, res){ 
 
     fs.readFile(__dirname + "/example11.html",
     function (err, data){
         if (err) {
        res.writeHead(500, {"Content-Type": "text/plain"});
        return res.end("Error loading html page");
        }
      res.writeHead(200);
      res.end(data);
     })
 }  
 //******************************************
 var desiredValue = 0;
 var actualValue = 0; // variable for actual value (output value)
 
 
 
 //******************************************
    
 http.listen(8080, "172.16.22.46");
 var sendValueViaSocket; // var for sending messages
 var clientIpAddress;
 
 board.on("ready", function(){
 board.analogRead(0, function(value){
  desiredValue = value; // continious read of analog pin 8
  
 });
 board.analogRead(1, function(value) {
    actualValue = value; // continuous read of pin 1
});
 
 io.sockets.on("connection",function(socket) {
     
       socket.emit("messageToClient", "Srv connected, brd OK");
       
      setInterval(sendValues, 40, socket); // on 40ms trigger func
      
      
      
       sendValueViaSocket = function (value){
           
           io.sockets.emit("messageToClient", value);
       }
               
    }); //end of sockets.on connection

       

 }); // end of board on ready 
 
 function sendValues (socket) {
    socket.emit("clientReadValues",
    { // json notation between curly braces
    "desiredValue": desiredValue,
    "actualValue": actualValue
    });
};
 
 
