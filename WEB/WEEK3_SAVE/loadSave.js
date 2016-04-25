var sceneNum = 0;
var scenesTotal = [1, 2, 3, 4];
var allScenes = []


function init() {

    // createFr1()
    createScenes();





    // var stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMapEnabled = true;

    var knot = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3, 1));
    // add the sphere to the scene
    scene.add(knot);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(new THREE.Vector3(-20, 0, 0));

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

    // call the render function
    var step = 0;


    var loadedMesh;

    // setup the control gui
    var controls = new function() {

        console.log(knot.geometry.parameters);
        // we need the first child, since it's a multimaterial
        this.radius = knot.geometry.parameters.radius;
        this.tube = 0.3;
        this.radialSegments = knot.geometry.parameters.radialSegments;
        this.tubularSegments = knot.geometry.parameters.tubularSegments;
        this.p = knot.geometry.parameters.p;
        this.q = knot.geometry.parameters.q;
        this.heightScale = knot.geometry.parameters.heightScale;
        this.sceneNum = sceneNum;

        this.redraw = function() {
            // remove the old plane
            scene.remove(knot);
            // create a new one
            knot = createMesh(new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q), controls.heightScale));
            // add it to the scene.
            scene.add(knot);
        };

        this.save = function() {
            var result = knot.toJSON();
            //most browsers have locastorage, keeps data across browsing sessions
            ////can only store things as strings or numbers here
            //convert the object into json string
            //arguments (key, value)
            //i can store about 10MB in here
            localStorage.setItem("json", JSON.stringify(result));
        };

        this.load = function() {


            scene.remove(loadedMesh);
            //give it the same key you gave it
            var json = localStorage.getItem("json");

            if (json) {
                //the opposite of stringify, is to parse
                var loadedGeometry = JSON.parse(json);
                var loader = new THREE.ObjectLoader();

                loadedMesh = loader.parse(loadedGeometry);
                loadedMesh.position.x -= 50;
                scene.add(loadedMesh);
                // document.getElementById("fr" + sceneNum).appendChild(loadedMesh)
            }
        }
    };

    var gui = new dat.GUI();
    var ioGui = gui.addFolder('Save & Load');
    ioGui.add(controls, 'save').onChange(controls.save);
    ioGui.add(controls, 'load').onChange(controls.load);
    var meshGui = gui.addFolder('mesh');
    meshGui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
    meshGui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
    meshGui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'heightScale', 0, 5).onChange(controls.redraw);
    var sceneGui = gui.addFolder('scene');
    sceneGui.add(controls, 'sceneNum', 1, 4).onChange(controls.redraw)



    render();

    function createMesh(geom) {

        // assign two materials
        var meshMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.VertexColors,
            wireframe: true,
            wireframeLinewidth: 2,
            color: 0xaaaaaa
        });
        meshMaterial.side = THREE.DoubleSide;

        // create a multimaterial
        var mesh = new THREE.Mesh(geom, meshMaterial);

        return mesh;
    }





    function render() {
        // stats.update();

        knot.rotation.y = step += 0.01;

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }

    // function initStats() {

    //     var stats = new Stats();
    //     stats.setMode(0); // 0: fps, 1: ms

    //     // Align top-left
    //     stats.domElement.style.position = 'absolute';
    //     stats.domElement.style.left = '0px';
    //     stats.domElement.style.top = '0px';

    //     document.getElementById("Stats-output").appendChild(stats.domElement);

    //     return stats;
    // }
} //init ends


function createScenes() {
    for (i in scenesTotal) {
        var scene = new THREE.Scene();
        var container = document.getElementById(i);

        console.log(container)
        var camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);

        // create a render and set the size
        var webGLRenderer = new THREE.WebGLRenderer();
        webGLRenderer.setClearColor(new THREE.Color(0xffffff, 1));
        webGLRenderer.setSize(container.clientWidth, container.clientHeight);
        webGLRenderer.shadowMapEnabled = true;
        container.appendChild(webGLRenderer.domElement);
        allScenes.push(scene)


    }

}



// function createFr1() {
//     var container = document.getElementById('fr1');



//     // create a camera, which defines where we're looking at.
//     var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

//     // create a render and set the size
//     var webGLRenderer = new THREE.WebGLRenderer();
//     webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
//     webGLRenderer.setSize(window.innerWidth, window.innerHeight);
//     webGLRenderer.shadowMapEnabled = true;
//     container.appendChild(webGLRenderer.domElement);
//     render();

//     function render() {


//         requestAnimationFrame(render);
//         webGLRenderer.render(scene, camera);

//     }
// }






window.onload = init;
