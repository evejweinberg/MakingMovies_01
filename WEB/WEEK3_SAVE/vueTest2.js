//should I make one vue for each scene??
//
//

var vmScene1 = new Vue({
    el: '#scene1',
    data: {
        title: 'Scene1',
        length: 1,
        start: 0,
        end: 1,
        cameraPOV: 50,
        cameraZ: 300,
        cameraX: 300,
        player1color: 0xbbbb55,
        playing: 'true',
        selected: 'val3',
        options: "hi",
        startDistPlayer1: 400,
        endDistPlayer1: 800,
        camXslider: 0
    },
    methods: {
        changeCameraPOV: function() {
            var camPOV = this.cameraPOV
            if (camPOV) {
                this.cameraPOV = camPOV
            }
        },
        animate: function() {
            requestAnimationFrame(this.animate);
            renderer.render(scene, camera);

            var startDistPlayer1 = parseInt(this.startDistPlayer1);
            var endDistPlayer1 = parseInt(this.endDistPlayer1);

            console.log(startDistPlayer1, endDistPlayer1)

            movespeed = ((Math.abs(startDistPlayer1 - endDistPlayer1)) / parseInt(this.length, 10)) / 60


            //dont make camera go negative
            if (this.endDistPlayer1 < this.startDistPlayer1) {

                this.endDistPlayer1 = this.startDistPlayer1
            }


            if (this.playing == 'true') {


                camera.position.z = this.cameraZ += movespeed;


                if (camera.position.z > endDistPlayer1) {
                    camera.position.z = startDistPlayer1
                    this.cameraZ = startDistPlayer1
                }


                camera.position.x = this.camXslider;
                console.log(camera.position.x)
                camera.fov = parseInt(this.cameraPOV)


            } else {
                camera.position.z = camera.position.z
            }
        }
    },

    init: function() {
        console.log(' i have inited');
        container = document.getElementById('canvas1');
        camera = new THREE.PerspectiveCamera(this.cameraPOV, 16 / 9, 1, 1000);
        camera.position.z = this.startDistPlayer1;
        // camera.position.x = camXslider
        scene = new THREE.Scene();
        // var texture = new THREE.TextureLoader().load('textures/crate.gif');
        var geometry = new THREE.BoxGeometry(200, 200, 200);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff5345
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize($("#canvas1").width(), $("#canvas1").height());
        container.appendChild(renderer.domElement);

        //window.addEventListener('resize', onWindowResize, false);
        //this.animate();
    }



});

vmScene1.animate();







/////////////////////////////////////////////////////


// var container, stats;
//     var camera, scene;
//     var renderer;
//     var mesh, mesh2, helper;
//     var playing = false
//     var movespeed = 1
//     var endDistPlayer1 = 700
//     var startDistPlayer1 = 400

//     //init();

//     //animate();

//     function init() {

//         container = document.getElementById('canvas1');
//         camera = new THREE.PerspectiveCamera(vmScene1.cameraPOV, 16 / 9, 1, 1000);
//         camera.position.z = startDistPlayer1;
//         // camera.position.x = camXslider
//         scene = new THREE.Scene();
//         // var texture = new THREE.TextureLoader().load('textures/crate.gif');
//         var geometry = new THREE.BoxGeometry(200, 200, 200);
//         var material = new THREE.MeshBasicMaterial({
//             color: 0xff5345
//         });
//         mesh = new THREE.Mesh(geometry, material);
//         scene.add(mesh);
//         renderer = new THREE.WebGLRenderer();
//         renderer.setPixelRatio(window.devicePixelRatio);
//         renderer.setSize($("#canvas1").width(), $("#canvas1").height());
//         container.appendChild(renderer.domElement);

//         window.addEventListener('resize', onWindowResize, false);



//     }

//     function onWindowResize() {
//         camera.aspect = 16 / 9;
//         camera.updateProjectionMatrix();
//         renderer.setSize($("#canvas1").width(), $("#canvas1").height());
//     }


//     function animate() {
//         requestAnimationFrame(animate);
//         renderer.render(scene, camera);

//         movespeed = ((Math.abs(vmScene1.startDistPlayer1-vmScene1.endDistPlayer1))/parseInt(vmScene1.length,10))/60

//         startDistPlayer1 = vmScene1.startDistPlayer1
//         if (vmScene1.playing == 'true') {


//             camera.position.z = vmScene1.cameraZ += movespeed;
//             // console.log(camera.position.z)
//             if (camera.position.z > endDistPlayer1) {
//                 camera.position.z = startDistPlayer1
//                 vmScene1.cameraZ = startDistPlayer1
//             }


//             camera.position.x = vmScene1.camXslider;
//             console.log(camera.position.x)
//             camera.fov = parseInt(vmScene1.cameraPOV)


//         } else {
//             camera.position.z = camera.position.z
//         }
//     }
