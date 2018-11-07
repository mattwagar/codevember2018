var effectController = {
    xRotationSpeed: 0.05,
    yRotationSpeed: 0.05,
    zRotationSpeed: 0.05,

};

var r = 800;
var particlesData = [];
var particleCount = 500;
var rHalf = r / 2;
var container, stats;

var maxParticleCount = 100;

function initGUI() {

    container = document.getElementById( 'container' );

    var gui = new dat.GUI();
    gui.add(effectController, "xRotationSpeed", 0, 0.5, 0.05);
    gui.add(effectController, "yRotationSpeed", 0, 0.5, 0.05);
    gui.add(effectController, "zRotationSpeed", 0, 0.5, 0.05);
}


function main() {

    initGUI();


    var width = window.innerWidth;
    var height = window.innerHeight;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var controls = new THREE.OrbitControls(camera);

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set(0, 5, 5);
    controls.update();


    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    // camera.position.z = 5;

    var group = new THREE.Group();
    scene.add(group);

    var pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 3,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
    });
    particles = new THREE.BufferGeometry();
    particlePositions = new Float32Array(maxParticleCount * 3);

    for (var i = 0; i < maxParticleCount; i++) {
        var x = Math.random() * r - r / 2;
        var y = Math.random() * r - r / 2;
        var z = Math.random() * r - r / 2;
        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;
        // add it to the geometry
        particlesData.push({
            velocity: new THREE.Vector3(- 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2),
            numConnections: 0
        });
    }
    particles.setDrawRange(0, particleCount);
    particles.addAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setDynamic(true));
    // create the particle system
    pointCloud = new THREE.Points(particles, pMaterial);
    group.add(pointCloud);


    // renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;

    stats = new Stats();
    container.appendChild(stats.dom);





    //game logic
    var update = function () {
        cube.rotation.x += effectController.xRotationSpeed;
        cube.rotation.y += effectController.yRotationSpeed;
        cube.rotation.z += effectController.zRotationSpeed;
    };

    //draw scene
    var render = function () {
        renderer.render(scene, camera);
    };

    //run game loop (update, render, repeat)
    var GameLoop = function () {
        requestAnimationFrame(GameLoop);

        renderer.setSize(window.innerWidth, window.innerHeight);

        controls.update();

        update();
        render();
    };

    GameLoop();
}
