// Function to handle box click 
function handleBoxClick(event) {
  // Remove 'selected' class from all boxes in this section
  Array.from(event.currentTarget.parentNode.children).forEach(function (box) {
    box.classList.remove('selected');
  });

  // Add 'selected' class to the clicked box
  event.currentTarget.classList.add('selected');

  // Update the skin whenever a new box is selected
  updateSkin();
}

// New function to update the skin
function updateSkin() {
  const selectedElements = getSelectedElements();
  
  // Apply the skin to the 3D model
  if (object) {
    const layerOrder = ['body', 'eyes', 'shirt', 'jacket', 'pants', 'shoes'];
    layerOrder.forEach((layer) => {
      const textureUrl = selectedElements[layer] + '.png'; // Adjust according to your naming convention
      const texture = new THREE.TextureLoader().load(textureUrl, (texture) => {
        texture.minFilter = THREE.NearestFilter; // Prevent blurring
        texture.magFilter = THREE.NearestFilter; // Prevent blurring
        texture.needsUpdate = true; // Ensure the texture updates
      });

      object.traverse(function (child) {
        if (child.isMesh) {
          // Example: apply texture based on the layer
          if (layer === 'body') {
            child.material.map = texture;
          }
          // Additional logic can be added for other layers as needed
          child.material.needsUpdate = true;
        }
      });
    });
  }
}

// Get selected elements function
function getSelectedElements() {
  return {
    body: document.querySelector('.body-options .selected')?.id,
    eyes: document.querySelector('.eyes-options .selected')?.id,
    shirt: document.querySelector('.shirt-options .selected')?.id,
    jacket: document.querySelector('.jacket-options .selected')?.id,
    pants: document.querySelector('.pants-options .selected')?.id,
    shoes: document.querySelector('.shoes-options .selected')?.id
  };
}

// Composite images function
function compositeImages(selectedElements) {
  console.log("compositeImages called with:", selectedElements);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 64;
  canvas.height = 64;

  const promises = [];
  const layerMap = {};
  const layerOrder = ['body', 'eyes', 'shirt', 'pants', 'jacket', 'shoes'];

  layerOrder.forEach((layer) => {
    if (selectedElements[layer]) {
      const imageNumber = selectedElements[layer];
      const filename = imageNumber + '.png';
      console.log("Loading image:", filename); 

      const img = new Image();
      img.src = filename; 

      img.onerror = () => {
        console.error("Error loading image:", filename);
      };

      promises.push(new Promise((resolve, reject) => {
        img.onload = () => {
          console.log("Image Loaded: ", filename); 
          layerMap[layer] = img;
          resolve(); 
        }
        img.onerror = reject; 
      }));
    }
  });

  Promise.all(promises)
    .then(() => {
      console.log("All images loaded and drawn.");
      
      // Applying all images
      layerOrder.forEach((layer) => {
        ctx.drawImage(layerMap[layer], 0, 0);
      });

      // Small delay before download (optional)
      setTimeout(() => {
        const dataURL = canvas.toDataURL('image/png'); 
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'my_skin.png'; 
        downloadLink.click(); 
      }, 100);
    })
    .catch((error) => {
      console.error("Error in Promise.all: ", error);
    })
    .finally(() => canvas.remove());
}

// Attach click event listeners directly to the boxes:
const bodyOptions = document.querySelectorAll('.body-options div');
const eyesOptions = document.querySelectorAll('.eyes-options div');
const shirtOptions = document.querySelectorAll('.shirt-options div');
const jacketOptions = document.querySelectorAll('.jacket-options div');
const pantsOptions = document.querySelectorAll('.pants-options div');
const shoesOptions = document.querySelectorAll('.shoes-options div');

bodyOptions.forEach(box => box.addEventListener('click', handleBoxClick));
eyesOptions.forEach(box => box.addEventListener('click', handleBoxClick));
shirtOptions.forEach(box => box.addEventListener('click', handleBoxClick));
jacketOptions.forEach(box => box.addEventListener('click', handleBoxClick));
pantsOptions.forEach(box => box.addEventListener('click', handleBoxClick));
shoesOptions.forEach(box => box.addEventListener('click', handleBoxClick));

// Event listener for download button 
const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
  const selection = getSelectedElements();
  compositeImages(selection);
});

// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// Importing OrbitControls and GLTFLoader
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Track mouse position
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Keep the 3D object on a global variable
let object;

// OrbitControls for camera movement
let controls;

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
  `slim.gltf`,
  function (gltf) {
    object = gltf.scene;
    scene.add(object);

    // Initialize with a default texture
    object.traverse(function (child) {
      if (child.isMesh) {
        const texture = new THREE.TextureLoader().load('default.png', (texture) => {
          texture.minFilter = THREE.NearestFilter; // Prevent blurring
          texture.magFilter = THREE.NearestFilter; // Prevent blurring
          texture.needsUpdate = true; // Ensure the texture updates
        });
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

// Instantiate a new renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Set camera position
camera.position.z = 5;

// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  if (object) {
    object.rotation.y = Math.PI / -2 + (-3 + mouseX / window.innerWidth * 3);
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  
  renderer.render(scene, camera);
}

// Add window resize listener
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse position listener
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// Start the 3D rendering
animate();
