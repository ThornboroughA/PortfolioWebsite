import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'



/**
 * BASE
 */
let originalY = 0


// Raycaster
const raycaster = new THREE.Raycaster()
let activeIntersect = null

let objSocialMedia, objModeling, objGames, objContact
let objectsToIntersect

// Canvas
const modelLoader = new GLTFLoader(); 
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()



/**
 * HTML Text Points
 */
const textPoints = [
    // Modeling
    {
        position: new THREE.Vector3(2, 3.5, -1.6),
        element: document.querySelector('.point-0')
    },
    // Contact
    {
        position: new THREE.Vector3(-2.8, 3.4, 3.8),
        element: document.querySelector('.point-1')
    },
    // Games
    {
        position: new THREE.Vector3(-1.6, 5.5, -1.8),
        element: document.querySelector('.point-2')
    }
]


/**
 * OBJECTS
 */

const objectGroup = new THREE.Group()
scene.add(objectGroup)

// Materials
const material = new THREE.MeshToonMaterial({
    color: '#ffeded'
})

// Particles
const particlesCount = 130;

// function for generating location
const generateRandomExclusive = (min, max, range) => {
    let ranNum = (Math.random() - 0.5) * range;
    if (ranNum < max && ranNum > min) return -4;
    return ranNum;
};

const particlesPositions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i++) {

    let ranX = generateRandomExclusive(-0.2, 0.2, 20)
    let ranY = generateRandomExclusive(-0.2, 3, 20)
    let ranZ = generateRandomExclusive(-0.2, 0.2, 20)

    particlesPositions[i * 3 + 0] = ranX
    particlesPositions[i * 3 + 1] = ranY
    particlesPositions[i * 3 + 2] = ranZ
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3))
// Particle material
const particlesMaterial = new THREE.PointsMaterial
({
    color: '#ffeded',
    sizeAttenuation: true,
    size: 0.1
})
// Particle Instantiation
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
objectGroup.add(particles)


// Model loading
let palaceModel
modelLoader.load(
    'models/PalaceBackground_ComputerConcept.glb',
    (palace) => {
        palaceModel = palace.scene,
        objectGroup.add(palaceModel),
        
        palaceModel.position.set(0,0,0)
        
        // Assign interactive objects
        objSocialMedia = palaceModel.children[0]
        bjSocialMedia.name = 'objSocialMedia';
        objGames = palaceModel.children[1]
        objGames.name = 'objGames';
        objContact = palaceModel.children[2]
        objContact.name = 'objContact';
        objModeling = palaceModel.children[3]
        objModeling.name = 'objModeling';
         
        objectsToIntersect = [objSocialMedia, objModeling, objGames]

        objectsToIntersect.forEach(obj => {
            obj.originalHeight = obj.position.y
            obj.isActive = false
            obj.url = objectURLs[obj.name]
        })

        originalY = palaceModel.rotation.y 
        
    }
)
// URL click functionality
const objectURLs = {
    objSocialMedia: '/about.html',
    objModeling: 'https://www.behance.net/torneberge',
    objGames: '/games.html'
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
scene.add(ambientLight, directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', throttle (() =>
{  
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}))

/**
 * Cursor
 */
const cursor = new THREE.Vector2(0, 1)

window.addEventListener('click', (event) => {
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(cursor, camera);
    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(objectsToIntersect);

    if (intersects.length > 0) {
        const intersect = intersects[0]; // Get the first intersected object
        if (intersect.object.url) {
            window.location.href = intersect.object.url; // Redirect to the URL
        }
    }
});

window.addEventListener('mousemove', throttle((event) =>
{
    const maxWidth = event.clientX / sizes.width * 2 - 1

    cursor.x = maxWidth
    cursor.y = - (event.clientY / sizes.height) * 2 + 1
},100))

function throttle(callback, limit) {
    let waiting = false; 
    return function () {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(function () {
                waiting = false;
            }, limit);
        }
    }
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(12, 12, 12)
scene.add(camera)
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false

// Camera limits
controls.maxDistance = 14
controls.minDistance = 5

controls.maxPolarAngle = (Math.PI * 0.38) // 0.35 is default
controls.minPolarAngle = (Math.PI * 0.32)
controls.minAzimuthAngle = Math.PI * 0.2 // Math.PI * 0.25 is default
controls.maxAzimuthAngle = Math.PI * 0.3


/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Post-processing
 */

 let composer

 function PostProcessing() {
    composer = new EffectComposer( renderer )
    composer.addPass(new RenderPass( scene, camera))
    
    // RGB Shift
    const effectRGB = new ShaderPass(RGBShiftShader)
    effectRGB.uniforms['amount'].value = 0.0015
    effectRGB.uniforms['angle'].value = Math.PI * 0.75
    
    // Sobel lines and luminosity
    const effectSobel = new ShaderPass(SobelOperatorShader)
    effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio
    effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio
    composer.addPass(effectSobel)

    

    // Bloom pass
    
    const params = {
        exposure: 1, 
        bloomStrength: 0.492,
        bloomThreshold: 0.422,
        bloomRadius: 0.94
    }



    const bloomPass = new UnrealBloomPass (new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    composer.addPass(effectRGB) 

    composer.addPass(bloomPass)
               
 }
 PostProcessing()


/**
 * UPDATE LOOP
 */

const clock = new THREE.Clock()
let previousTime = 0
const update = () =>
{

    // Timer
    const  elapsedTime = clock.getElapsedTime()
    let deltaTime = elapsedTime - previousTime
    if (deltaTime >= 0.1) deltaTime = 0.1
    previousTime = elapsedTime
    
    RayCaster()
    AnimateCamera(deltaTime)
    FloatingText()

    // Render
    window.requestAnimationFrame(update)
    composer.render()

}

update()


/**
 * Raycaster
 */


function RayCaster() {

    if (palaceModel == null) { return }

    raycaster.setFromCamera(cursor, camera)
    const intersects = raycaster.intersectObjects(objectsToIntersect)

    if (intersects.length) {
        if (!activeIntersect) {
            // Mouse enter
        }
        activeIntersect = intersects[0]

    } else {
        if (activeIntersect) {
            // Mouse leave
        }
        activeIntersect = null
        
        ResetElevations(null)

        return
    }

    // Actual behavior
    const heightToElevate = 1

    ElevateModel(activeIntersect.object, heightToElevate)
    ResetElevations(activeIntersect.object)

}

function ElevateModel(model, height) {


    if (model.position.y == model.originalHeight + height ) return

    gsap.to(
        model.position, {
            duration: 1, ease: 'elastic', y: model.originalHeight + height
        }
    )
}

function ResetElevations(active) {
    objectsToIntersect.forEach( obj => {
        if (obj != active) {
            gsap.to(
                obj.position, {
                    duration: 3, ease: 'power1', y: obj.originalHeight,
                })
        }
    })
}


/**
 * HTML Text
 */

function FloatingText() {
    for (const point of textPoints) {
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        const translateX = screenPosition.x * sizes.width / 2
        const translateY = -screenPosition.y * sizes.height / 2
        point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    }
}
/** 
* Animate Camera
*/
function AnimateCamera(deltaTime) {
    // Controls-based
    controls.update()
    // Camera-based
    
    if (palaceModel != null) {

        const parallaxX =  cursor.x 
        const rotationRange = 0.75
        const rotationSpeed = 0.9

        for (let i = 0; i < textPoints.length; i++) {
            textPoints[i].position.y += ((parallaxX * 0.75) - objectGroup.rotation.y) * 0.9 * deltaTime 
            textPoints[i].position.x += ((parallaxX * 0.75) - objectGroup.rotation.y) * 0.9 * deltaTime 
        }
        const rotationAmount = ((parallaxX * rotationRange) - objectGroup.rotation.y) * rotationSpeed * deltaTime

        objectGroup.rotation.y += rotationAmount
    } 
}

