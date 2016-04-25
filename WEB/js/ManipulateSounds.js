var players = [];

for (var i = 0; i < myNotesURL.length; i++) {
    players[i] = new Tone.Player(myNotesURL[i]).connect(Tone.Master);
    players[i].loop = true;
}


$("button").on("mousedown", function(){
  var sample = this.id;
  startSample(sample);

}).on("mouseup", function(){
var sample = this.id;
  stopSample(sample);
});


function startSample(sample) {
  players[sample].start();
}

function stopSample(sample) {
  players[sample].stop();
}