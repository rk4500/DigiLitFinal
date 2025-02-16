import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Group, Easing, Tween } from '@tweenjs/tween.js'

// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg"), alpha: false });
const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();
const group = new Group()

// scene.fog = new THREE.Fog( 0xcccccc, 500, 600);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 15;
document.body.appendChild(renderer.domElement);
// controls.enablePan = false;
// controls.enableZoom = false;
// controls.enableRotate = false;
var clock = new THREE.Clock();

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
var skeleton;
var mixer;
var actions = {};
var currentAction;

loader.load('models/fixed.glb', function(gltf) {
    // Getting wireframe
    // var object = gltf.scene;
    // object.traverse((node) => {
    //   if (!node.isMesh) return;
    //   node.material.wireframe = true;
    // });
    // scene.add(object);

    mixer = new THREE.AnimationMixer(gltf.scene);
    for (let anim of gltf.animations) {
        let action = mixer.clipAction(anim);
        actions[anim.name] = action;
    }
    manModel = gltf.scene;
    gltf.scene.position.y = -7;
    scene.add(gltf.scene)

    let animAction = actions['Appear'];
    currentAction = animAction
    animAction.clampWhenFinished = true;
    animAction.setLoop(THREE.LoopOnce);
    animAction.play();

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
        model: {position: {x: -5, y: 0, z: 0}},
        camera: {position: {x: -10, y: 0, z: 5}},
        anim: 'Sitting'
    },
    physical: {
        model: {position: {x: 0, y: 1, z: 0}},
        camera: {position: {x: 0, y: 4, z: 10}},
        anim: 'BackDouble'
    },
    home: {
        model: {position: {x: 0, y: 0, z: 0}},
        camera: {position: {x: 0, y: 0, z: 15}},
        anim: 'Appear'
    }
}
function transition(param) {
    var settings = buttonTweenSettings[param];

    // const manTween = new Tween(manModel.rotation).to(settings.model.rotation, 500).easing(Easing.Quadratic.InOut).start();

    const camManTween = new Tween(camera.position).to(settings.camera.position, 500).easing(Easing.Quadratic.InOut).start();
    const controlTween = new Tween(controls.target).to(settings.model.position, 500).easing(Easing.Quadratic.InOut).onUpdate((pos) => {controls.target.set(pos.x, pos.y, pos.z);}).start();

    // console.log(controls.target);
    // controls.target = new THREE.Vector3(-6, 0, 0);
    // controls.target = new THREE.Vector3( -10, 10, 0);
    // console.log(controls.target);

    let animAction = actions[settings.anim];
    if(currentAction != animAction) {
        console.log(animAction);
        animAction.reset();
        animAction.clampWhenFinished = true;
        animAction.setLoop(THREE.LoopOnce);
        animAction.play();
        currentAction.crossFadeTo(animAction, 1, true);
        // currentAction.stop();
        currentAction = animAction;
    }
    // animAction.timeScale = 2;
    // animAction.play();

    // group.add(manTween);
    group.add(controlTween);
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
    mixer.update(clock.getDelta());
    group.update();
    controls.update();
    renderer.render(scene, camera);
}

