var http = require("http");
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){ 
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 8");
    board.pinMode(8, board.MODES.OUTPUT); 
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); 
});
http.createServer(function(req, res){ 
    var parts = req.url.split("/"), 
    operator1 = parseInt(parts[1],10),
    operator2 = parseInt(parts[2],10);
        
    if (operator1 == 0) {
   console.log("Putting led to OFF");
   board.digitalWrite(13, board.LOW);
}
if (operator1 == 1) {
   console.log("Putting led ON");
   board.digitalWrite(13, board.HIGH);
}
if (operator2 == 0) {
   console.log("Putting led OFF");
   board.digitalWrite(8, board.LOW);
}
if (operator2 == 1) {
   console.log("Putting led ON");
   board.digitalWrite(8, board.HIGH);
}
        
    res.writeHead(200, {"Content-Type": "text/plain"}); //200=ok
    res.end("The value of operator1: " + operator1 +"   The value of operator2: "+ operator2);
}).listen(8080, "172.16.22.46");