//set the 
Tone.setContext()


//or we can try hrtf panning model
// tone.js implements stereo panner mode
// spatial panner nodes

//this gives us a spatial panner mode
var panner = Tone.context.createPanner();

panner.coneInnerAngle = 90;
panner.coneOuterAngle = 100;
panner.setOrientation(rx, ry, rz);
panner.setPosition(x, y, z);//same world coordinates as three.js
// panner.rolloff


//this applied shape of our ear. Use this if you're NOT doing mobile
panner.panningModel = "HRTF"


player.connect(panner);


listener = new THREE.AudioListener();


// panner.setPosition(mesh.position.x,)
// position.setOrientation(mesh.rotation.x)
// 





// 

