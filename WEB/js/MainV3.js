////////////////////////////////////////////////////////////    
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////
var experiences = [1, 2, 3, 4, 5, 6]
var videos = []
var voices = []
var allvideoTextures = []
var videoImageContexts = []
var allMats = []
var scene, cameraThree, renderer;
var light;
var readyAllVideos = false
var worldRadius = 420;
var videoRadius = worldRadius * .8;
var spacing = 360 / experiences.length;
var container;
var controls, guicontrols;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var centerRadius = 10
var worldSphere
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// custom global variables
var imgScreen, screens;

var videoo, videoImage, videoImageContext, videoTexture, listener;
var videoIsLoaded = false;

var thisIsTouchDevice = false;
if (isTouchDevice()) thisIsTouchDevice = true;


//
var lastTime = Date.now();
var time, clock;


///////////////////////////////////////////////////////////

// kind of like setup()
init();



///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////

function init() {
    clock = new THREE.Clock();
    // SCENE
    // construct environment first
    scene = new THREE.Scene();

    // LIGHT
    // create light for the scene
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 1, 4000);
    scene.add(light);

    // CAMERA
    // PerspectiveCamera( field of view, aspect, near, far )
    cameraThree = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    cameraThree.position.z = 100; //set the position of the camera
    // cameraThree.position.set(0,150,400);             //can also do position.set(x, y, z)
    scene.add(cameraThree); //add camera into the scene
    // RENDERER
    container = document.createElement('div');
    document.body.appendChild(container);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 1); //set background color and alpha


    listener = new THREE.AudioListener();
    cameraThree.add(listener);


    // var sound1 = new THREE.PositionalAudio( listener );
    //                 sound1.load( 'http://evejweinberg.github.io/samples/WhyKitKat.wav' );
    //                 //fade out distance
    //                 sound1.setRefDistance( 20 );
    //                 sound1.autoplay = true;
    //                 mesh1.add( sound1 );







    buildGeo();
    DrawCenterArea();
    Floor()
    OuterSphere()
    AddGui()








    // EVENTS
    // automatically resize renderer
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // CONTROLS
    // left click to rotate, middle click/scroll to zoom, right click to pan
    // controls = new THREE.OrbitControls(cameraThree, renderer.domElement);
    controls = new THREE.FirstPersonControls(cameraThree, renderer.domElement);

    controls.movementSpeed = 70;
    controls.lookSpeed = 0.05;
    controls.noFly = true;
    controls.lookVertical = false;


    animate();

} //INIT ENDS

function animate() {
    requestAnimationFrame(animate); //http://creativejs.com/resources/requestanimationframe/
    update();
    render();
}

function update() {
    controls.update();



}
//////////////////////////////////////////////////////////////////
//    ____    U _____ u _   _    ____  U _____ u   ____     
// U |  _"\ u \| ___"|/| \ |"|  |  _"\ \| ___"|/U |  _"\ u  
//  \| |_) |/  |  _|" <|  \| |>/| | | | |  _|"   \| |_) |/  
//   |  _ <    | |___ U| |\  |uU| |_| |\| |___    |  _ <    
//   |_| \_\   |_____| |_| \_|  |____/ u|_____|   |_| \_\   
//   //   \\_  <<   >> ||   \\,-.|||_   <<   >>   //   \\_  
//  (__)  (__)(__) (__)(_")  (_/(__)_) (__) (__) (__)  (__) 
//////////////////////////////////////////////////////////////////

function render() {
    cameraThree.position.x += (mouseX - cameraThree.position.x) * .0005;
    cameraThree.position.y += (-mouseY - cameraThree.position.y) * .0005;
    var delta = clock.getDelta();

    controls.update(delta);

    //update GUI
    // cube.rotation.x += controls.rotationSpeed;
    // cube.rotation.y += controls.rotationSpeed;
    // cube.rotation.z += controls.rotationSpeed;
    // step += controls.bouncingSpeed;
    // sphere.position.x = 20 + (10 * (Math.cos(step)));
    // sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));
    // worldSphere.radius = guicontrols.worldradius
    // worldSphere = createMesh(new THREE.SphereGeometry(worldRadius, 10, 10));

    worldRadius = guicontrols.worldradius
        //gui ends
    for (var i = 0; i < experiences.length; i++) {
        if (videos[i].readyState === videos[i].HAVE_ENOUGH_DATA) {
            if (readyAllVideos == true) {

                // for (var k = 0; k < experiences.length; k++) {

                // if (whichMobile == "iOS_mobile") {

                //     time = Date.now();
                //     var elapsed = (time - lastTime) / 1000;

                //     // render
                //     if (elapsed >= ((1000 / framesPerSecond) / 1000)) {
                //         videos[i].currentTime = videos[i].currentTime + elapsed;
                //         videoImageContexts[i].drawImage(videos[i], 0, 0, videos[i].videoWidth, videos[i].videoHeight);
                //         if (allvideoTextures[i])
                //             allvideoTextures[i].needsUpdate = true;
                //         lastTime = time;
                //     }

                //     // if we are at the end of the video stop
                //     var currentTime = (Math.round(parseFloat(videos[i].currentTime) * 10000) / 10000);
                //     var duration = (Math.round(parseFloat(videos[i].duration) * 10000) / 10000);
                //     if (currentTime >= duration) {
                //         // console.log('currentTime: ' + currentTime + ' duration: ' + videoo.duration);
                //         // restart
                //         videos[i].currentTime = 0;
                //         return;
                //     }

                // } else {

                if (videos[i].readyState === videos[i].HAVE_ENOUGH_DATA) {
                    videoImageContexts[i].drawImage(videos[i], 0, 0);
                    if (allvideoTextures[i])
                        allvideoTextures[i].needsUpdate = true;
                }
                // }
                // }
            }


        }
    }
    renderer.render(scene, cameraThree);
}




//--------------------------------------------------------------------------------------------------//                                                                                           
//--------------------------------------------------------------------------------------------------//                                                                                              
// ((_)_  _ ((_)(_)) (_)) (_))_   _(())\_)() ((_) (_)) (_)) (_))_     
//  | _ )| | | ||_ _|| |   |   \  \ \((_)/ // _ \ | _ \| |   |   \    
//  | _ \| |_| | | | | |__ | |) |  \ \/\/ /| (_) ||   /| |__ | |) |   
//  |___/ \___/ |___||____||___/    \_/\_/  \___/ |_|_\|____||___/                                                                      
//--------------------------------------------------------------------------------------------------//                                                                                           
//--------------------------------------------------------------------------------------------------//                                                                                           


function buildGeo() {


    //make all video textures
    for (var i = 0; i < experiences.length; i++) {
        video = document.createElement('video');
        // video.setAttribute("webkit-playsinline", "");
        video.setAttribute('crossorigin', 'anonymous');

        video.autoplay = true;
        video.loop = true;
        video.preload = "auto";
        video.src = "https://evejweinberg.github.io/videos/" + [i + 1] + ".mov";
        videos.push(video)


        videoImage = document.createElement('canvas');
        videoImage.width = 720;
        videoImage.height = 720;
        videoImageContext = videoImage.getContext('2d');
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
        videoImageContexts.push(videoImageContext)

        videoTexture = new THREE.Texture(videoImage);
        allvideoTextures.push(videoTexture)

        var sound1 = new THREE.PositionalAudio(listener);
        sound1.load("http://evejweinberg.github.io/samples/" + [i + 1] + ".wav");
        //fade out distance
        sound1.setRefDistance(20);
        sound1.autoplay = true;
        sound1.setLoop(true);
        voices.push(sound1)
            // mesh1.add(sound1);

        mat = new THREE.MeshBasicMaterial({ color: 0x808080, map: videoTexture, side: THREE.DoubleSide, opacity: 0.8 });
        // mat.blending = THREE["AdditiveBlending"];

        allMats.push(mat);



    } //FOR LOOP OVER



    readyAllVideos = true


    //place all cubes

    for (var k = 0; k < experiences.length; k++) {
        var xCenter = Math.cos(toRadians(k * spacing))

        var zCenter = Math.sin(toRadians(k * spacing))

        for (var j = 0; j < 10; j++) {



            var randOffset = Math.floor((Math.random() * 50) + -55);
            var size = 5 + 20 * Math.random();

            geo = new THREE.BoxGeometry(size, size, size);
            var mesh = new THREE.Mesh(geo, allMats[k]);
            mesh.position.set(videoRadius * xCenter + randOffset, 50 + randOffset, randOffset + (videoRadius * zCenter))
            mesh.rotateZ(randOffset)
            mesh.rotateX(randOffset)
            if (j == 0) {
                // console.log('added a voice')
                mesh.add(voices[k])
            }

            scene.add(mesh);

        }
        // }
    }

}





function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}


function DrawCenterArea() {
    var map = new THREE.TextureLoader().load('../textures/fbtxt.png');
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 10;
    var material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide });
    object = new THREE.Mesh(new THREE.CylinderGeometry(centerRadius, centerRadius, 10, experiences.length, 1), material);
    object.position.set(0, 0, 0);
    scene.add(object);

}


function Floor() {
    floorMat = new THREE.MeshStandardMaterial({
        roughness: 0.8,
        color: 0xffffff,
        metalness: 0.2,
        bumpScale: 0.0005,
    });
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load("../textures/hardwood2_diffuse.jpg", function(map) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(10, 24);
        floorMat.map = map;
        floorMat.needsUpdate = true;
    });
    textureLoader.load("../textures/hardwood2_bump.jpg", function(map) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(10, 24);
        floorMat.bumpMap = map;
        floorMat.needsUpdate = true;
    });
    textureLoader.load("../textures/hardwood2_roughness.jpg", function(map) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(10, 24);
        floorMat.roughnessMap = map;
        floorMat.needsUpdate = true;
    });

    var floorGeometry = new THREE.PlaneBufferGeometry(worldRadius * 2, worldRadius * 2);
    var floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x = -Math.PI / 2.0;
    scene.add(floorMesh);
}




function OuterSphere() {
    var map = new THREE.TextureLoader().load('../textures/fbtxt.png');
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 10;
    var material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide });
    // object = new THREE.Mesh(new THREE.CylinderGeometry(centerRadius, centerRadius, 10, experiences.length, 1), material);

    //radius, width segments, height segments
    worldSphere = createMesh(new THREE.SphereGeometry(worldRadius, 10, 10));
    // add the sphere to the scene
    scene.add(worldSphere);

}


function createMesh(geom) {

    // assign two materials
    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // create a multimaterial
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return mesh;
}


















function onWindowResize() {
    windowHalfX = window.innerWidth / 2
    windowHalfY = window.innerHeight / 2
    cameraThree.aspect = window.innerWidth / window.innerHeight;
    cameraThree.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) * 10;
    mouseY = (event.clientY - windowHalfY) * 10;

}

function isTouchDevice() {
    return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
}

/////////////////////////////////////////////////////////////
//    ____     _   _             
// U /"___|uU |"|u| |   ___      
// \| |  _ / \| |\| |  |_"_|     
//  | |_| |   | |_| |   | |      
//   \____|  <<\___/  U/| |\u    
//   _)(|_  (__) )(.-,_|___|_,-. 
//  (__)__)     (__)\_)-' '-(_/  
/////////////////////////////////////////////////////////////
///

function AddGui() {

    guicontrols = new function() {
        //default values
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.worldradius = 400;
    }

    var gui = new dat.GUI();
    gui.add(guicontrols, 'rotationSpeed', 0, 0.5);
    gui.add(guicontrols, 'bouncingSpeed', 0, 0.5);
    gui.add(guicontrols, 'worldradius', 50, 1000)
} //GUI ENDS
