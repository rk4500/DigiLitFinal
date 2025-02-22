import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Group, Easing, Tween } from '@tweenjs/tween.js'

// Initialize Three.js Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#000000', 15, 18); // #232323
scene.background = new THREE.Color('#000000');

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
camera.position.y = 7;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg"), alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Orbit control Setup
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

loader.load('models/physical.glb', function(gltf) {
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
    chair.position.z = -15;
    chair.position.y = -7;
    buttonTweenSettings.objects.chair.object = chair.position;
    scene.add(chair);
});

// Adding Table
var table;
loader.load('models/table.glb', function(gltf) {
    table = gltf.scene;
    table.position.z = 30;
    table.position.y = -7;
    buttonTweenSettings.objects.table.object = table.position;
    scene.add(gltf.scene);
});

// Adding Apple
var apple;
loader.load('models/apple.glb', function(gltf) {
    apple = gltf.scene;
    apple.position.z = 0;
    apple.position.y = 5;
    buttonTweenSettings.objects.apple.object = apple.position;
    scene.add(gltf.scene);
});

// Adding Dumbell
var dumbell;
loader.load('models/dumbell.glb', function(gltf) {
    dumbell = gltf.scene;
    dumbell.position.z = 0;
    dumbell.position.y = 5;
    buttonTweenSettings.objects.dumbell.object = dumbell.position;
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
        camera: {position: {x: 0, y: 0, z: 13}},
        anim: 'Appear'
    },
    mental: {
        model: {position: {x: -5, y: 0, z: 0}},
        camera: {position: {x: -10, y: 0, z: 5}},
        anim: 'Sitting',
        miscObjs: ['chair'],
    },
    mentalHealth: {
        model: {position: {x: -5, y: 0, z: 0}},
        camera: {position: {x: -10, y: 0, z: 0}},
        anim: 'Sitting',
        miscObjs: ['chair']
    },
    learning: {
        model: {position: {x: -8, y: 0, z: 0}},
        camera: {position: {x: -12, y: 0, z: 5}},
        anim: 'Learn',
        miscObjs: ['table', 'chair']
    },
    physical: {
        model: {position: {x: 0, y: 2, z: 0}},
        camera: {position: {x: 0, y: 6, z: 9}},
        anim: 'BackDouble'
    },
    fitness: {
        model: {position: {x: 0, y: 3.6, z: 5.2}},
        camera: {position: {x: -4.5, y: 5.3, z: 8.8}},
        anim: 'Dumbell',
        miscObjs: ['dumbell']
    },
    nutrition: {
        model: {position: {x: -6.2, y: 1.3, z: 4.6}},
        camera: {position: {x: 6.6, y: 4.4, z: 11.7}},
        anim: 'Apple',
        miscObjs: ['apple']
    },
    about: {
        model: {position: {x: 0, y: 0, z: 0}},
        camera: {position: {x: 0, y: 5, z: 20}},
        anim: 'Appear'
    },
    objects: {
        chair: {
            object: chair,
            position: {x: 0, y: -7, z: 0},
            default: {x: 0, y: -7, z: -15}
        },
        table: {
            object: table,
            position: {x: 0, y: -7, z: 0},
            default: {x: 0, y: -7, z: 30}
        },
        apple: {
            object: apple,
            position: {x: 0, y: -7, z: 0},
            default: {x: 0, y: 5, z: 0}
        },
        dumbell: {
            object: dumbell,
            position: {x: 0, y: -7, z: 0},
            default: {x: 0, y: 5, z: 0}
        }
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
    
    if(settings.miscObjs) {
        for(const obj of settings.miscObjs) {
            let item = buttonTweenSettings.objects[obj];
            group.add(new Tween(item.object).to(item.position, 500).easing(Easing.Quadratic.Out).start());
        };

        for(const obj in buttonTweenSettings.objects){
            if(!settings.miscObjs.includes(obj)) {
                let item = buttonTweenSettings.objects[obj];
                group.add(new Tween(item.object).to(item.default, 500).easing(Easing.Quadratic.In).start());
            }
        }
    }
    else {
        for(const obj in buttonTweenSettings.objects){
            let item = buttonTweenSettings.objects[obj];
            group.add(new Tween(item.object).to(item.default, 500).easing(Easing.Quadratic.In).start());
        }
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

