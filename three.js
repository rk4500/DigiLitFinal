import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Group, Easing, Tween } from '@tweenjs/tween.js'

// Initialize Three.js Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#000000', 15, 18); // #232323
scene.background = new THREE.Color('#000000');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg"), alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();
const group = new Group()

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

// Adding Man
var manModel;
var skeleton;
var mixer;
var actions = {};
var currentAction;

loader.load('models/learn.glb', function(gltf) {
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


// Adding Chair
var chair;

loader.load('models/chair.glb', function(gltf) {
    chair = gltf.scene;
    chair.position.z = -5;
    chair.position.y = -7;
    buttonTweenSettings.mental.miscObj = chair.position;
    scene.add(chair);
});

// Adding Table
var table;
loader.load('models/table.glb', function(gltf) {
    table = gltf.scene;
    table.position.z = 20;
    table.position.y = -7;
    buttonTweenSettings.learning.miscObj = table.position;
    scene.add(gltf.scene);
});

// Handle Window Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

var buttonTweenSettings = {
    home: {
        model: {position: {x: 0, y: 0, z: 0}},
        camera: {position: {x: 0, y: 0, z: 15}},
        anim: 'Appear'
    },
    mental: {
        model: {position: {x: -5, y: 0, z: 0}},
        camera: {position: {x: -10, y: 0, z: 5}},
        anim: 'Sitting',
        misc: true,
        miscObj: chair,
        miscTarget: {x: 0, y: -7, z: 0}
    },
    physical: {
        model: {position: {x: 0, y: 1, z: 0}},
        camera: {position: {x: 0, y: 3, z: 11}},
        anim: 'BackDouble'
    },
    learning: {
        model: {position: {x: -5, y: 0, z: 0}},
        camera: {position: {x: -10, y: 0, z: 5}},
        anim: 'Learn',
        misc: true,
        miscObj: table,
        miscTarget: {x: 0, y: -7, z: 0}
    }
}
function transition(param) {
    var settings = buttonTweenSettings[param];
    let animAction = actions[settings.anim];
    if(currentAction != animAction) {
        animAction.reset();
        animAction.clampWhenFinished = true;
        animAction.setLoop(THREE.LoopOnce);
        animAction.play();
        currentAction.crossFadeTo(animAction, 0.5, true);
        currentAction = animAction;
    }
    
    if(settings.misc) {
        const miscTween = new Tween(settings.miscObj).to(settings.miscTarget, 500).easing(Easing.Quadratic.InOut).start();
        group.add(miscTween);
    }
    const camManTween = new Tween(camera.position).to(settings.camera.position, 500).easing(Easing.Quadratic.InOut).start();
    const controlTween = new Tween(controls.target).to(settings.model.position, 500).easing(Easing.Quadratic.InOut).onUpdate((pos) => {controls.target.set(pos.x, pos.y, pos.z);}).start();

    group.add(controlTween);
    group.add(camManTween);
}

window.transition = transition;

animate();
function animate() {
    requestAnimationFrame(animate);
    mixer.update(clock.getDelta());
    group.update();
    controls.update();
    renderer.render(scene, camera);
}

