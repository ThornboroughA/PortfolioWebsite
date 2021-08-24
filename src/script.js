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
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial ({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

torus.position.z = -28;

//seona
const loader = new GLTFLoader();
loader.load('Seona.gltf', function (gltf) {
scene.add(gltf.scene)
}, 
undefined, function (error) {
    console.error(error);
}
);


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
/*const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);*/

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;


//resize
//TODO: needs a separate function for phones
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight)
}

//update
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
