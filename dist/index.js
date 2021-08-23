import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({
    color:0x00ff00
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)




const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.set(0, 1, 2);
scene.add(camera);

const renderer = new THREE.WebGL1Renderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.shadowMap.enabled = true;


window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectMatrix();

    renderer.setSize(window.innerWidth, windowHeight);
}


function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}

animate();