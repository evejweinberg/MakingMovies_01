////////////////////////////////////////////////////////////    
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////
var scene1 = true,
    scene2 = false,
    headspin = false;
var scene3count = 0;
var scene4ready = false
var headZstart = -50;
var loadingOvervid = document.getElementById("tunnel-vid");



if (scene1) {
    Scene1();
    $("#blocker").hide();
    loadingOvervid.pause();
    console.log('scene1')
    $('#next-button').click(function() {

        scene2 = true
        headspin = true;
        // switchscenes(2)
        $("#intro").hide();
    });
}

// if (scene4ready){
//     console.log('scene4 switch')
//     switchscenes(4)
//     scene4ready = false
//     console.log('scene4 is' + scene4ready)
// }

function switchscenes(newscene) {
    //change this to a switch case with 'breaks'
    if (newscene == 2) {
        scene1 = false;
        // console.log('head is spinning')
        // Scene2()
        // $('#loadingvideo').show();
    } else if (newscene == 3) {
        scene1 = false;
        $('#loadingvideo').show();
        $("scene1").hide();
        $('#tunnel').show();
        // Scene3()
        console.log('scene3')
    } else if (newscene == 4) {
        if (scene4ready) {
            scene1 = false;
            $('#loadingvideo').hide();
            $("#blocker").show();
            console.log('scene4')
            Scene4()
            scene4ready = false
             console.log('scene4 is '+ scene4ready)
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////
// //    _   __   __    _____ _ __ ___   ___  ___   __  ___   ___   ___  __   __ _  __  ___
//   .' \ / /  / /   /_  _//// // o | / _/ / _/  / /,' _/  / o.) / _/,'_/  / // |/ /,' _/
//  / o // /_ / /_    / / / ` //  ,' / _/ / _/n_/ /_\ `.  / o \ / _// /_n / // || /_\ `. 
// /_n_//___//___/   /_/ /_n_//_/`_\/___//___/\_,'/___,' /___,'/___/|__,'/_//_/|_//___,' 
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function Scene4() {

    console.log('scene4 was called')

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
    var lastTime = Date.now();
    var time, clock;
    var worldCenter = new THREE.Vector3(0, 0, 0);


    /////variables/////for////controllers///////////////////////////////////////////
    var controlsEnabled = false;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;
    var prevTime = performance.now();
    var velocity = new THREE.Vector3();
    var raycaster;
    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    //////////////////////////////////////////////////////////









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
                //origin, direction, near, far
                raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                element.requestFullscreen();

            } else {

                element.requestPointerLock();

            }

        }, false);

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }


    ///////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    //set it up and kick off animation
    init();
    animate();



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
        // cameraThree.position.z = 100; //set the position of the camera
        // cameraThree.position.set(0,150,400);             //can also do position.set(x, y, z)
        scene.add(cameraThree); //add camera into the scene
        // RENDERER
        var container = document.getElementById('scene4');
        document.body.appendChild(container);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        renderer.setClearColor(0x000000, 1); //set background color and alpha


        //////////CONNECT TONE TO THREE.JS LISTENERS
        ///   __
        // /,-
        // ||)
        // \\_, )
        //  `--'
        listener = new THREE.AudioListener();
        //Tone.setContext(listener.context);
        cameraThree.add(listener);
        ////////////////////////////////



        raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);


        buildGeo();
        DrawCenterArea();
        Floor()
        OuterSphere()
        // AddGui()








        // EVENTS
        // automatically resize renderer
        window.addEventListener('resize', onWindowResize, false);


        controls = new THREE.PointerLockControls(cameraThree);
        scene.add(controls.getObject());

        var onKeyDown = function(event) {

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

                case 32: // space
                    if (canJump === true) velocity.y += 350;
                    canJump = false;
                    break;

            }

        };

        var onKeyUp = function(event) {

            switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    moveForward = false;
                    console.log('up')
                    break;

                case 37: // left
                case 65: // a
                    console.log('left')
                    moveLeft = false;
                    break;

                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = false;
                    console.log('right')
                    break;

            }

        };

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);


        /////////controls over



        // animate();

    } //INIT ENDS

    function animate() {
        requestAnimationFrame(animate); //http://creativejs.com/resources/requestanimationframe/
        ///CONTROLS
        if (controlsEnabled) {
            console.log('controls enabled')
            console.log(raycaster)
                //copies the value of what is inside
            raycaster.ray.origin.copy(controls.getObject().position);
            raycaster.ray.origin.y -= 10;



            //looking for every object
            var objects = scene.children
            var intersections = raycaster.intersectObjects(objects);

            var isOnObject = intersections.length > 0;

            var time = performance.now();
            var delta = (time - prevTime) / 1000;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            if (moveForward) velocity.z -= 400.0 * delta;
            if (moveBackward) velocity.z += 400.0 * delta;

            if (moveLeft) velocity.x -= 400.0 * delta;
            if (moveRight) velocity.x += 400.0 * delta;

            if (isOnObject === true) {
                velocity.y = Math.max(0, velocity.y);

                canJump = true;
            }

            if (controls.getObject().position.distanceTo(worldCenter) < videoRadius) {
                controls.getObject().translateX(velocity.x * delta);
                controls.getObject().translateY(velocity.y * delta);
                controls.getObject().translateZ(velocity.z * delta);
            } else {
                velocity.multiplyScalar(-1);
                controls.getObject().translateX(velocity.x * delta);
                controls.getObject().translateY(velocity.y * delta);
                controls.getObject().translateZ(velocity.z * delta);
            }

            if (controls.getObject().position.y < 10) {

                velocity.y = 0;
                controls.getObject().position.y = 10;

                canJump = true;

            }

            prevTime = time;

        }


        ///CONTROLS ENS 
        ///
        ///

        update();
        render();
    }

    function update() {
        // controls.update();



                                                  
                                                  
                                                  
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

        // 
        // worldRadius = guicontrols.worldradius
        //gui ends
        for (var i = 0; i < experiences.length; i++) {
            if (videos[i].readyState === videos[i].HAVE_ENOUGH_DATA) {
                if (readyAllVideos == true) {


                    if (videos[i].readyState === videos[i].HAVE_ENOUGH_DATA) {
                        videoImageContexts[i].drawImage(videos[i], 0, 0);
                        if (allvideoTextures[i])
                            allvideoTextures[i].needsUpdate = true;
                    }

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
            video.src = "https://evejweinberg.github.io/videos/" + [i + 1] + "b.mov";
            videos.push(video)


            videoImage = document.createElement('canvas');
            videoImage.width = 512;
            videoImage.height = 512;
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
        textureLoader.load("../textures/wallpaper1.png", function(map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(10, 10);
            floorMat.map = map;
            floorMat.needsUpdate = true;
        });
        // textureLoader.load("../textures/hardwood2_bump.jpg", function(map) {
        //     map.wrapS = THREE.RepeatWrapping;
        //     map.wrapT = THREE.RepeatWrapping;
        //     map.anisotropy = 4;
        //     map.repeat.set(10, 24);
        //     floorMat.bumpMap = map;
        //     floorMat.needsUpdate = true;
        // });
        // textureLoader.load("../textures/hardwood2_roughness.jpg", function(map) {
        //     map.wrapS = THREE.RepeatWrapping;
        //     map.wrapT = THREE.RepeatWrapping;
        //     map.anisotropy = 4;
        //     map.repeat.set(10, 24);
        //     floorMat.roughnessMap = map;
        //     floorMat.needsUpdate = true;
        // });

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

    }

    // function onDocumentMouseMove(event) {
    //     // mouseX = (event.clientX - windowHalfX) * 10;
    //     // mouseY = (event.clientY - windowHalfY) * 10;
    // }

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


} ////ALL OF SCENE 2 IS OVER
