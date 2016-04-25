var experiences = [1, 2, 3, 4, 5, 6]
////////////////////////////////////////////////////////////////////////////////
// 88      dP"Yb     db    8888b.      Yb    dP 88 8888b.  888888  dP"Yb  .dP"Y8 
// 88     dP   Yb   dPYb    8I  Yb      Yb  dP  88  8I  Yb 88__   dP   Yb `Ybo." 
// 88  .o Yb   dP  dP__Yb   8I  dY       YbdP   88  8I  dY 88""   Yb   dP o.`Y8b 
// 88ood8  YbodP  dP""""Yb 8888Y"         YP    88 8888Y"  888888  YbodP  8bodP' 
// ////////////////////////////////////////////////////////////////////////////////
var video, videoImage, videoImageContext, videoTexture;
var videoIsLoaded = false;
for (var i = 0; i < experiences.length; i++) {
    video = document.createElement('video');
    video.setAttribute("webkit-playsinline", "");
    video.autoplay = true;
    video.loop = true;
    video.preload = "auto";
    video.src = "http://evejweinberg.github.io/videos/" + [i+1] + ".mov";


}


videoImage = document.createElement('canvas');
videoImage.width = 480;
videoImage.height = 480;
videoImageContext = videoImage.getContext('2d');
videoImageContext.fillStyle = '#ffffff';
videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

// videoTexture = new THREE.Texture( videoo );
videoTexture = new THREE.Texture(videoImage);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;
videoTexture.generateMipmaps = false;

videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
videoTexture.needsUpdate = true;

geo = new THREE.PlaneGeometry(16, 9);
mat = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });

for (var i = 0; i < 100; i += 20) {
    for (var j = 0; j < 100; j += 20) {
        var mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(i, j, j)
        // scene.add(mesh);
    }
}


/////////////////////////////////////////////////////                                                       
///////|) () |\| [-   |_ () /\ |) | |\| (_,   \/ | |) [- () _\~ 
/////////////////////////////////////////////////////                                                       


if (!Detector.webgl) Detector.addGetWebGLMessage();
var container, raycaster, stats;
var camera, scene, renderer, composer, controls, velocity;
var blocker, instructions;
var moveLeft, moveForward, moveBackward, moveRight;
initKeyDown
var loader;
var audioListener, soundFilter;
var soundArea, collisionArea;
// Initialize Three.JS
initPointerLock();
initKeyDown();
init();
//
// SEA3D Loader
//
loader = new THREE.SEA3D({
    autoPlay: true, // Auto play animations
    container: scene // Container to add models
});
loader.onComplete = function(e) {
    audioListener = loader.audioListener;
    soundFilter = audioListener.context.createBiquadFilter();
    soundFilter.type = 'lowpass';
    soundFilter.Q.value = 10;
    soundFilter.frequency.value = 440;
    soundArea = loader.getSound3D("Point002");
    collisionArea = loader.getMesh("Torus003");
    animate();
};
loader.load('.././models/sea3d/sound.tjs.sea');
//
function initPointerLock() {
    blocker = document.getElementById('blocker');
    instructions = document.getElementById('instructions');
    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if (havePointerLock) {
        var element = document.body;
        var pointerlockchange = function(event) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                controlsEnabled = true;
                controls.enabled = true;
                blocker.style.display = 'none';
            } else {
                controls.enabled = false;
                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'box';
                instructions.style.display = '';
            }
        };
        var pointerlockerror = function(event) {
            instructions.style.display = '';
        };
        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
        instructions.addEventListener('click', function(event) {
            instructions.style.display = 'none';
            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            if (/Firefox/i.test(navigator.userAgent)) {
                var fullscreenchange = function(event) {
                    if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                        document.removeEventListener('fullscreenchange', fullscreenchange);
                        document.removeEventListener('mozfullscreenchange', fullscreenchange);
                        element.requestPointerLock();
                    }
                };
                document.addEventListener('fullscreenchange', fullscreenchange, false);
                document.addEventListener('mozfullscreenchange', fullscreenchange, false);
                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                element.requestFullscreen();
            } else {
                element.requestPointerLock();
            }
        }, false);
    } else {
        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
}

function initKeyDown() {
    function onKeyDown(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
        }
    };

    function onKeyUp(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
}

function init() {
    raycaster = new THREE.Raycaster();
    scene = new THREE.Scene();
    velocity = new THREE.Vector3();
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    controls.getObject().translateX(250);
    controls.getObject().translateZ(250);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x333333, 1);
    container.appendChild(renderer.domElement);
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
    // post-processing
    composer = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(scene, camera);
    var copyPass = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(renderPass);
    var vh = 1.4,
        vl = 1.2;
    var colorCorrectionPass = new THREE.ShaderPass(THREE.ColorCorrectionShader);
    colorCorrectionPass.uniforms["powRGB"].value = new THREE.Vector3(vh, vh, vh);
    colorCorrectionPass.uniforms["mulRGB"].value = new THREE.Vector3(vl, vl, vl);
    composer.addPass(colorCorrectionPass);
    var vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
    vignettePass.uniforms["darkness"].value = 1.0;
    composer.addPass(vignettePass);
    composer.addPass(copyPass);
    copyPass.renderToScreen = true;
    // events
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//
function animateCamera(delta) {
    var scale = 1400;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    if (moveForward) velocity.z -= scale * delta;
    if (moveBackward) velocity.z += scale * delta;
    if (moveLeft) velocity.x -= scale * delta;
    if (moveRight) velocity.x += scale * delta;
    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateZ(velocity.z * delta);
}
var clock = new THREE.Clock();
var audioPos = new THREE.Vector3();
var audioRot = new THREE.Euler();

function updateSoundFilter(collision, sound3d) {
    // difference position between sound and listener
    var difPos = new THREE.Vector3().setFromMatrixPosition(sound3d.matrixWorld).sub(audioPos);
    var length = difPos.length();
    // pick a vector from camera to sound
    raycaster.set(audioPos, difPos.normalize());
    // intersecting sound1
    if (length > 50 && raycaster.intersectObjects([collision]).length) {
        if (sound3d.getFilter() !== soundFilter) sound3d.setFilter(soundFilter);
    } else if (sound3d.getFilter() !== undefined) {
        sound3d.setFilter();
    }
}
//
function animate() {
    var delta = clock.getDelta();
    animateCamera(delta);
    // Sound3D Spatial Transform Update
    loader.audioListener.position.copy(audioPos.setFromMatrixPosition(camera.matrixWorld));
    loader.audioListener.rotation.copy(audioRot.setFromRotationMatrix(camera.matrixWorld));
    // Update sound filter from raycaster intersecting
    updateSoundFilter(collisionArea, soundArea);
    // Update SEA3D Animations
    THREE.SEA3D.AnimationHandler.update(delta);
    render(delta);
    stats.update();
    requestAnimationFrame(animate);
}

function render(delta) {
    //renderer.render( scene, camera );
    composer.render(delta);
}
