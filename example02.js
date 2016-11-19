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
    operator = parseInt(parts[1],10); 
        
    if (operator == 0) {
   console.log("Putting led to OFF");
   board.digitalWrite(13, board.LOW);
}
if (operator == 1) {
   console.log("Putting led ON");
   board.digitalWrite(13, board.HIGH);
}
if (operator == 2) {
   console.log("Putting led OFF");
   board.digitalWrite(8, board.LOW);
}
if (operator == 3) {
   console.log("Putting led ON");
   board.digitalWrite(8, board.HIGH);
}
        
    res.writeHead(200, {"Content-Type": "text/plain"}); //200=ok
    res.end("The value of operator: " + operator);
}).listen(8080, "172.16.22.46");
