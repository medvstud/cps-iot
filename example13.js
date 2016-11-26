var http = require("http").createServer(handler); //on request use handler
var io = require("socket.io").listen(http); //socket library
var fs = require("fs"); //var for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){ 
    console.log("Connecting to Arduino");
    board.pinMode(0, board.MODES.ANALOG); // analog pin 0
    board.pinMode(1, board.MODES.ANALOG); // analog pin 1
    board.pinMode(2, board.MODES.OUTPUT); // direction of DC motor
    board.pinMode(3, board.MODES.PWM); // PWM of motor i.e. speed of rotation
    board.pinMode(4, board.MODES.OUTPUT); // direction DC motor
    
});
 function handler (req, res){ 
 
     fs.readFile(__dirname + "/example13.html",
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
 var factor = 0.1; // proportional factor that determines the speed of aproaching toward desired value
 
 
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
 
startControlAlgorithm();

 io.sockets.on("connection",function(socket) {
     
       socket.emit("messageToClient", "Srv connected, brd OK");
       
      setInterval(sendValues, 40, socket); // on 40ms trigger func
      
      
      
       sendValueViaSocket = function (value){
           
           io.sockets.emit("messageToClient", value);
       }
               
    }); //end of sockets.on connection

       

 }); // end of board on ready 
 var pwm = 0;
 function controlAlgorithm () {
    pwm = factor*(desiredValue-actualValue);
    if(pwm > 255) {pwm = 255}; // to limit the value for pwm / positive
    if(pwm < -255) {pwm = -255}; // to limit the value for pwm / negative
    if (pwm > 0) {board.digitalWrite(2,1); board.digitalWrite(4,0);}; 
    if (pwm < 0) {board.digitalWrite(2,0); board.digitalWrite(4,1);}; 
    board.analogWrite(3, Math.abs(pwm));
};
function startControlAlgorithm () {
    setInterval(function() {controlAlgorithm(); }, 30); // on 30ms call
    console.log("Control algorithm started")
};
 function sendValues (socket) {
    socket.emit("clientReadValues",
    { // json notation between curly braces
    "desiredValue": desiredValue,
    "actualValue": actualValue
    });
};
 
 
