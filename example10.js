var http = require("http").createServer(handler); //on request use handler
var io = require("socket.io").listen(http); //socket library
var fs = require("fs"); //var for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){ 
    console.log("Connecting to Arduino");
    console.log("Enabling analog Pin 0");
    board.pinMode(0, board.MODES.ANALOG); // analog pin 0
    
});
 function handler (req, res){ 
 
     fs.readFile(__dirname + "/example10.html",
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
 
 
 
 
 //******************************************
    
 http.listen(8080, "172.16.22.46");
 var sendValueViaSocket; // var for sending messages
 var clientIpAddress;
 
 board.on("ready", function(){
 board.analogRead(0, function(value){
  desiredValue = value; // continious read of analog pin 8
  
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
    {
    "desiredValue": desiredValue    
    });
};
 
 
