var camera, scene, renderer, element, container, effect, mesh, light, controls;
var experiences = [1, 2, 3, 4, 5, 6]
var videos = []
var video, videoImage, videoImageContext, videoTexture;
// var videoImages = [], videoTextures = []
var videoIsLoaded = false;
var thisIsTouchDevice = false;
if (isTouchDevice()) thisIsTouchDevice = true;
var framesPerSecond = 24;
var lastTime = Date.now();
var time;



init();



function init() {


    scene = new THREE.Scene();
    // LIGHT
    // create light for the scene
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 1, -1);
    scene.add(light);


    container = document.createElement('div');
    document.body.appendChild(container);
    //aspect raiot is width/height
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 10000);
    camera.position.set(0, 15, 0)
    scene.add(camera);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xfdf3a0, 1);
    container.appendChild(renderer.domElement);
    // container = document.getElementById('webglviewer');
    // container.appendChild(element);
    // effect = new THREE.StereoEffect(renderer);



    // controls = new THREE.OrbitControls(camera, element);
    // controls.target.set(
    //     camera.position.x + 0.15,
    //     camera.position.y,
    //     camera.position.z
    // );
    // controls.noPan = true;
    // controls.noZoom = true;

    // window.addEventListener('deviceorientation', setOrientationControls, true);

    animate();
    buildGeometry();

}



function buildGeometry() {
    console.log("building")
        ////////////////////////////////////////////////////////////////////////////////
        // 88      dP"Yb     db    8888b.      Yb    dP 88 8888b.  888888  dP"Yb  .dP"Y8 
        // 88     dP   Yb   dPYb    8I  Yb      Yb  dP  88  8I  Yb 88__   dP   Yb `Ybo." 
        // 88  .o Yb   dP  dP__Yb   8I  dY       YbdP   88  8I  dY 88""   Yb   dP o.`Y8b 
        // 88ood8  YbodP  dP""""Yb 8888Y"         YP    88 8888Y"  888888  YbodP  8bodP' 
        // ////////////////////////////////////////////////////////////////////////////////
    for (var i = 0; i < experiences.length; i++) {
        video = document.createElement('video');
        video.setAttribute("webkit-playsinline", "");
        video.autoplay = true;
        video.loop = true;
        video.preload = "auto";
        video.src = "http://evejweinberg.github.io/videos/" + [i + 1] + ".mov";
        videos.push(video)


    }


    videoImage = document.createElement('canvas');
    //is this the size of the origional or the new size to map it down to?
    videoImage.width = 480;
    videoImage.height = 480;
    videoImageContext = videoImage.getContext('2d');
    //what is this line?
    videoImageContext.fillStyle = '#ffffff';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

//fill a 3JS teture with the 2D image
    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    videoTexture.generateMipmaps = false;

    videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture.needsUpdate = true;

    geo = new THREE.PlaneGeometry(9, 9);
    mat = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });

    for (var i = 0; i < 10; i += 20) {
        for (var j = 0; j < 10; j += 20) {
            var mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(i, j, j)
            scene.add(mesh);
        }
    }
}

////////////////////////////////////////////////////////////////////////
//    db    88b 88 88 8b    d8    db    888888 888888 
//   dPYb   88Yb88 88 88b  d88   dPYb     88   88__   
//  dP__Yb  88 Y88 88 88YbdP88  dP__Yb    88   88""   
// dP""""Yb 88  Y8 88 88 YY 88 dP""""Yb   88   888888 
////////////////////////////////////////////////////////////////////////
function animate() {
    //this allows it to get called repeditively
    requestAnimationFrame(animate);
    controls.update();
    render();
}



function render()
{   
    if( video.readyState === video.HAVE_ENOUGH_DATA ) {
        if(whichMobile=="iOS_mobile"){

            time = Date.now();
            var elapsed = (time - lastTime) / 1000;

            // render
            if(elapsed >= ((1000/framesPerSecond)/1000)) {
                video.currentTime = video.currentTime + elapsed;
                videoImageContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                if(videoTexture)
                    videoTexture.needsUpdate = true;
                lastTime = time;
            }

            // if we are at the end of the video stop
            var currentTime = (Math.round(parseFloat(video.currentTime)*10000)/10000);
            var duration = (Math.round(parseFloat(video.duration)*10000)/10000);
            if(currentTime >= duration) {
                console.log('currentTime: ' + currentTime + ' duration: ' + video.duration);
                // restart
                video.currentTime = 0;
                return;
            }

        } else {
                videoImageContext.drawImage(video, 0, 0);
                if(videoTexture)
                    videoTexture.needsUpdate = true;
         
        }
    }

    renderer.render( scene, cameraThree );
}








function isTouchDevice() {
    return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}



// function setOrientationControls(e) {
//     if (!e.alpha) {
//         return;
//     }
