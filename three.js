import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Group, Easing, Tween } from '@tweenjs/tween.js'

// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg"), alpha: false });
// const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();
const group = new Group()

// scene.fog = new THREE.Fog( 0xcccccc, 500, 600);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 15;
document.body.appendChild(renderer.domElement);

// Adding Light
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.z = 1;
directionalLight.position.y = 3;
const backDirectionalLight = new THREE.DirectionalLight(0xffffff);
backDirectionalLight.position.z = -1;
backDirectionalLight.position.y = 3;
scene.add(directionalLight);
scene.add(backDirectionalLight)

// Adding Random Taurus
// const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
// const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true });
// const torus = new THREE.Mesh(geometry, material);
// scene.add(torus);


// Adding Man
var manModel;
loader.load('/models/scene.gltf', function(gltf) {
    // Getting wireframe
    // var object = gltf.scene;
    // object.traverse((node) => {
    //   if (!node.isMesh) return;
    //   node.material.wireframe = true;
    // });
    // scene.add(object);
    
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            manModel = child;
        }
    })
    gltf.scene.position.y = -7;
    scene.add(gltf.scene)

}, undefined, function(error) {
    console.error(error);
});

// Handle Window Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

var buttonTweenSettings = {
    mental: {
        model: {rotation: {x: 0, y: 0.25 * Math.PI, z: 0}},
        camera: {position: {x: 0, y: 5, z: 7}},
    },
    physical: {
        model: {rotation: {x: 0, y: 0, z: 0}},
        camera: {position: {x: 0, y: 2, z: 9}}
    },
    home: {
        model: {rotation: {x: 0, y: 0, z: 0}},
        camera: {position: {x: 0, y: 0, z: 15}}
    }
}
function transition(param) {
    var settings = buttonTweenSettings[param];

    const manTween = new Tween(manModel.rotation).to(settings.model.rotation, 500).easing(Easing.Quadratic.InOut).start();

    const camManTween = new Tween(camera.position).to(settings.camera.position, 500).easing(Easing.Quadratic.InOut).start();

    group.add(manTween);
    group.add(camManTween);
}

window.transition = transition;

// Old method of transitioning between scenes
// var mentalBtn = document.getElementById('mental');
// mentalBtn.addEventListener('click', () => transition('mental'))


animate();

function animate() {
    requestAnimationFrame(animate);
    // torus.rotation.x += 0.01;
    // torus.rotation.y += 0.01;
    group.update();
    renderer.render(scene, camera);
}
