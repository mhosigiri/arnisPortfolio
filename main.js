import * as THREE from 'three';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarfield.js";

//Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Scene
const scene = new THREE.Scene();

// Create a pivot (an empty Object3D)
const pivot = new THREE.Object3D();
scene.add(pivot);

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/images/earth.jpg');
const nightLightsTexture = textureLoader.load('/images/eartf.jpg');
const cloudTexture = textureLoader.load('/images/clouds.jpg');

//My locations

//----------------------Texas------------------------------
const texasGeometry = new THREE.ConeGeometry( 0.05, 7, 3 ); 
const texasMaterial = new THREE.MeshBasicMaterial( {
  color: 0x8a2be2,
  transparent: true,
  opacity: 0.7,
} );
const coneTexas = new THREE.Mesh(texasGeometry, texasMaterial ); 
scene.add( coneTexas );

const sphereRadius = 3;
const latitude = Math.PI / 3;
const longitude = Math.PI / 4;

coneTexas.position.set(
  sphereRadius * Math.sin(latitude) * Math.cos(longitude),
  sphereRadius * Math.cos(latitude),
  sphereRadius * Math.sin(latitude) * Math.cos(longitude)
);

pivot.add(coneTexas);
coneTexas.lookAt(0,5,0);
//--------------------Texas End------------------------------------

//----------------------Nepal------------------------------
const nepalGeometry = new THREE.ConeGeometry( 0.05, 7, 3 ); 
const nepalMaterial = new THREE.MeshBasicMaterial( {
  color: 0xFFF01F,
  transparent: true,
  opacity: 0.7,
} );
const coneNepal = new THREE.Mesh(nepalGeometry, nepalMaterial ); 
scene.add( coneNepal );

const latitude1 = - Math.PI / 3.5;
const longitude1 = Math.PI / 3.8;

coneNepal.position.set(
  sphereRadius * Math.sin(latitude1) * Math.cos(longitude1) - 0.65,
  sphereRadius * Math.cos(latitude1) * Math.cos(longitude1) + 0.4,
  sphereRadius * Math.sin(latitude1) 
);

pivot.add(coneNepal);
coneNepal.lookAt(-5,-5,-5);
//--------------------Nepal End------------------------------------

//----------------------Japan------------------------------
const japanGeometry = new THREE.ConeGeometry( 0.03, 7, 3 ); 
const japanMaterial = new THREE.MeshBasicMaterial( {
  color: 0x0FF0FC,
  transparent: true,
  opacity: 0.7,
} );
const coneJapan = new THREE.Mesh(japanGeometry, japanMaterial ); 
scene.add( coneJapan );

const latitude2 = - Math.PI / 3.5;
const longitude2 = Math.PI / 3.8;
const japanXindex = 3.0;
const japanYindex = 1.9;
const japanZindex = 2.75;

coneJapan.position.set(
  sphereRadius * Math.sin(latitude2) * Math.cos(longitude2) - japanXindex,
  sphereRadius * Math.cos(latitude2) * Math.cos(longitude2) + japanYindex,
  sphereRadius * Math.sin(latitude2) + japanZindex,
);

pivot.add(coneJapan);
coneJapan.lookAt(-16,-15,0);
//--------------------Japan End------------------------------------

// Earth geometry & material
const cloudGeometry = new THREE.SphereGeometry(3, 64, 64);
const cloudMaterial = new THREE.MeshStandardMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.4,
});

const earthGeometry = new THREE.SphereGeometry(3, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  emissiveMap: nightLightsTexture,
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 1.1,
});

const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
clouds.scale.set(1.01, 1.01, 1.01);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;

// Add Earth and Clouds to the Pivot
pivot.add(clouds);
pivot.add(earth);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfffff0, 10);
directionalLight.position.set(-5, -5, -5);
scene.add(directionalLight);

const directionalLight1 = new THREE.DirectionalLight(0x222222, 3);
directionalLight1.position.set(5, 5, 5);
scene.add(directionalLight1);

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 12;
scene.add(camera);

// Renderer
const canvas = document.querySelector("canvas.webgl");
if (!canvas) {
  console.error("canvas not found.");
}

// Stars
const stars = getStarfield(5000);
scene.add(stars);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";

// OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
//controls.autoRotate = true; // rotates the CAMERA around the origin
//controls.autoRotateSpeed = 0.5;

// Handle Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Adjust earth rotation to the light and darker parts
//earth.rotation.y = Math.PI / 4;

//Create a raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create an object to store our clickable objects
const clickableObjects = {
    coneTexas: {
        object: coneTexas,
        url: 'texas.html' // Create this page for Texas content
    },
    coneNepal: {
        object: coneNepal,
        url: 'nepal.html' // Create this page for Nepal content
    },
    coneJapan: {
        object: coneJapan,
        url: 'japan.html' // Create this page for Japan content
    }
};

// Add all clickable objects to an array for raycaster
const clickableMeshes = Object.values(clickableObjects).map(obj => obj.object);

// Add click event listener to the canvas
canvas.addEventListener('click', onMouseClick);
canvas.addEventListener('mousemove', onMouseMove);

// Handle mouse movement for hover effects
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(clickableMeshes);

    // Reset all cones to original state
    clickableMeshes.forEach(mesh => {
        mesh.material.opacity = 0.7;
        document.body.style.cursor = 'default';
    });

    // Highlight intersected cone
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        intersectedObject.material.opacity = 1;
        document.body.style.cursor = 'pointer';
    }
}

// Handle click events
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(clickableMeshes);

    if (intersects.length > 0) {
        // Find which cone was clicked
        const clickedCone = Object.values(clickableObjects).find(
            obj => obj.object === intersects[0].object
        );

        if (clickedCone) {
            // Navigate to the corresponding page
            window.location.href = clickedCone.url;
        }
    }
}
//Query Selectors
const title = document.querySelector(".title");
const paragraph = document.querySelector(".paragraph");
const columnsContainer = document.querySelector(".columns-container");
const columns = document.querySelectorAll(".column");

pivot.position.x = 0;

gsap.set([title, paragraph], {
  opacity: 0,
  y: 20,
});
gsap.to([title, paragraph], {
  opacity: 1,
  y: 0,
  duration: 1,
  delay: 0.5,
  ease: "power2.out",
});

//Create the main timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub:1,
    markers: true,
  }
});


tl.to(
  pivot.position, {
    x: 4,
    duration: 1,
    ease: "none",
  }, 0);

// tl.to(pivot.scale, {
//   x: 0.5,
//   y: 0.5,
//   z: 0.5,
//   ease: "none"
// }, 0);


// tl.to(camera.position,{
//   x: -2,
//   z: 12,
//   ease: "none"
// }, 0);

tl.to([title, paragraph], {
  opacity: 0,
  duration: 1,
  ease: "power2.out"
}, 0.1); // Slight delay after scale starts


tl.to(columnsContainer, {
  opacity: 1,
  top: "0",
  duration: 1,
  ease: "power2.out",
}, 0.3);

columns.forEach((column, index) => {
  tl.to(column, {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power2.out",
}, 0.4 + (index * 0.1));
});

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth / 2;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// Animation loop
function animate() {
  pivot.rotation.y += 0.0002; // Rotate Earth
  clouds.rotation.y += 0.0003; // Rotate clouds
  earth.rotation.y = Math.PI / 3.5;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
