var http = require("http").createServer(handler); //on request use handler
var io = require("socket.io").listen(http); //socket library
var fs = require("fs"); //var for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){ 
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT);
    board.pinMode(2, board.MODES.INPUT);
});
 function handler (req, res){ 
 
     fs.readFile(__dirname + "/example07.html",
     function (err, data){
         if (err) {
        res.writeHead(500, {"Content-Type": "text/plain"});
        return res.end("Error loading html page");
        }
      res.writeHead(200);
      res.end(data);
     })
 }  
 
    
 http.listen(8080, "172.16.22.46");
 var sendValueViaSocket; // var for sending messages
 
 board.on("ready", function(){
 
 
 io.sockets.on("connection",function(socket) {
     
       socket.emit("messageToClient", "Srv connected, brd OK");
       sendValueViaSocket = function (value){
           
           io.sockets.emit("messageToClient", value);
       }
               
    }); //end of sockets connection

board.digitalRead(2, function(value){
    if (value == 0) {
            console.log("LED OFF");
            board.digitalWrite(13, board.LOW);
            sendValueViaSocket(0);
        }
        if (value == 1) {
            console.log("LED ON");
            board.digitalWrite(13, board.HIGH);
            sendValueViaSocket(1);
        }
})//end of digitalRead


 }); // end of board on ready 
 
 
