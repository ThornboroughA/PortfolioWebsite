import './style.css'

import * as THREE from 'three';
import {OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { Scene } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    
    canvas: document.querySelector('canvas.webgl')

})


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);

//mesh
/*const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial ({color: 0x0C7373});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

torus.position.z = -28;*/

//gltf 1
const gltfLoader = new GLTFLoader();
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

)


//stars
function AddStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(AddStar);

//bg texture
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


//lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

//debugging
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.maxPolarAngle = (Math.PI / 5) * 2;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 50;
controls.minDistance = 2;

//resize
//TODO: needs a separate function for phones
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight)
}


const clock = new THREE.Clock();
let previousTime = 0;

//update
function animate() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    //update animation mixer
    if (mixer !== null) {
        mixer.update(deltaTime);
    }


    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
