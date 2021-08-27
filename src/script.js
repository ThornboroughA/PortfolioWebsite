import './style.css'

import * as THREE from 'three';
import {OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js'; //interaction

import { DoubleSide, InterpolateDiscrete, Raycaster, Scene } from 'three';


const gltfLoader = new GLTFLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    
    canvas: document.querySelector('canvas.webgl')

})
/**
 * debugging
 */
/*
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);
*/


//interaction init
let raycaster, stats, container;
let INTERSECTED;
let theta = 0;
const pointer = new THREE.Vector2();
const radius = 100;

container = document.createElement('div');
document.body.appendChild(container);

init();
//TODO: write this better for the final version
function init() {
    //gltf lighting settings
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.setZ(30);
    renderer.render(scene, camera);

}


/**
 * Resizing
 */
//TODO: needs a separate function for phones
window.addEventListener('resize', onWindowResize);
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight)
}

/**
 * BG Image
 */
const texture = new THREE.TextureLoader().load('dabin/bg_stars.png', () => {
    cover(texture, window.innerWidth / window.innerHeight);
    scene.background = texture;
} );
texture.matrixAutoUpdate = false;

function cover(texture, aspect) {
    var imageAspect = texture.image.width / texture.image.height;
    if (aspect < imageAspect)
    {
        texture.matrix.setUvTransform(0,0, aspect/imageAspect,0.9,0,0.5,0.5);
    } else {
        texture.matrix.setUvTransform(0,0,0.9,imageAspect / aspect,0,0.5,0.5);
    }
}




//image plane
const ppkTexture = new THREE.TextureLoader().load('dabin/DabinXander.png');

const planeGeometry = new THREE.PlaneGeometry(25, 25, 1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ map: ppkTexture, transparent: true, side: DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(plane);
//plane 2
const saranghae = new THREE.TextureLoader().load('dabin/LoveYou.png');
const textGeo = new THREE.PlaneGeometry(25, 25, 1, 1);
const textMat = new THREE.MeshBasicMaterial({map: saranghae, transparent: true, side: DoubleSide});
const textPlane = new THREE.Mesh(textGeo, textMat);
textPlane.position.y = -20;
textPlane.position.z = 5;
scene.add(textPlane);

/*
let mixer = null;

gltfLoader.load(
    'models/Fox/glTF/Fox.gltf',

    (gltf) =>
    {   
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[1]);
        action.play();
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.position.set(10, 0, 0);
        scene.add(gltf.scene);
        
    }

)
gltfLoader.load(
    'models/seona.gltf',

    (gltf) => {
        gltf.scene.scale.set(8, 8, 8);
        gltf.scene.position.set(-10, 0, 0);
        
        scene.add(gltf.scene);
        
    }

)*/

function AddHeart() {
gltfLoader.load(
    'dabin/Heart.glb',
    (gltf) => {
        gltf.scene.scale.set(1.5,1.5,1.5);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
        gltf.scene.position.set(x, y, z);
        scene.add(gltf.scene);
    }
)
}

Array(50).fill().forEach(AddHeart);

/**
 * Lights
 */
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 5;

scene.add(pointLight, ambientLight);

/**
 * Camera Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.maxPolarAngle = (Math.PI / 5) * 2;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 50;
controls.minDistance = 2;

/**
 * Raycasting for Interaction
 */
raycaster = new THREE.Raycaster();
container.appendChild(renderer.domElement);

stats = new Stats();
//container.appendChild(stats.dom); //stats box

document.addEventListener('mousemove', onPointerMove);

function onPointerMove(event) {
    pointer.x = (event.clientX/ window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1; 
}




//timer for animation
const clock = new THREE.Clock();
let previousTime = 0;

/**
 * Update Loop
 */
 animate();
function animate() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    /*
    //update animation mixer
    if (mixer !== null) {
        mixer.update(deltaTime);
    }*/


    requestAnimationFrame(animate);
    controls.update();
    stats.update();
    //RaycastInteract();
    renderer.render(scene, camera);
}



function RaycastInteract() {

    theta += 0.1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    console.log("raycast: " + raycaster.intersectObjects);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[ 0 ].object) {
            if (INTERSECTED);
            INTERSECTED = intersects[0].object;
            console.log(INTERSECTED);
        }
    } else {
        
        INTERSECTED = null;

    }

}


