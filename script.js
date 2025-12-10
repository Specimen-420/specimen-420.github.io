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
    const selectedLayers = layerOrder.filter(l => selectedElements[l]);
    
    if (selectedLayers.length === 0) {
      console.log('No layers selected');
      return;
    }
    
    console.log('Selected elements:', selectedElements);
    console.log('Selected layers:', selectedLayers);
    
    // Load all selected layer images
    let loadedCount = 0;
    const layerImages = {};
    
    selectedLayers.forEach((layer) => {
      const boxId = selectedElements[layer];
      const textureName = idToTextureName[boxId];
      const textureUrl = 'textures/' + textureName + '.png';
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        console.log('Loaded image for layer:', layer, '(' + textureUrl + ')');
        layerImages[layer] = img;
        loadedCount++;
        
        // Once all images are loaded, composite and apply
        if (loadedCount === selectedLayers.length) {
          console.log('All layers loaded, compositing...');
          
          // Create canvas for compositing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 64;
          canvas.height = 64;
          
          // Draw layers in order (body first, then layered on top)
          selectedLayers.forEach((layer) => {
            if (layerImages[layer]) {
              console.log('Drawing layer:', layer);
              ctx.drawImage(layerImages[layer], 0, 0, canvas.width, canvas.height);
            }
          });
          
          // Convert canvas to blob and create ObjectURL
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            console.log('Canvas composite created, loading as texture...');
            
            // Load composite as texture
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(url, (texture) => {
              console.log('Composite texture loaded successfully');
              // Match glTF loader expectations
              texture.flipY = false;
              if (THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
              texture.minFilter = THREE.NearestFilter;
              texture.magFilter = THREE.NearestFilter;
              texture.needsUpdate = true;
              
              // Apply to all meshes
              object.traverse(function (child) {
                if (child.isMesh) {
                  console.log('Applying composite texture to mesh:', child.name);
                  child.material.map = texture;
                  child.material.needsUpdate = true;
                }
              });
              
              console.log('Composite texture applied successfully');
              
              // Clean up blob URL after a delay
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }, undefined, (error) => {
              console.error('TextureLoader error:', error);
            });
          }, 'image/png');
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load image for layer:', layer, '(' + textureUrl + ')');
        loadedCount++;
      };
      
      console.log('Loading image for layer:', layer, '(' + textureUrl + ')');
      img.src = textureUrl;
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

// Mapping of box IDs to texture file names
const idToTextureName = {
  'one': 'one', 'two': 'two', 'three': 'three',
  'four': 'four', 'five': 'five', 'six': 'six',
  'seven': 'seven', 'eight': 'eight', 'nine': 'nine',
  'ten': 'ten', 'eleven': 'eleven', 'twelve': 'twelve',
  'thirteen': 'thirteen', 'fourteen': 'fourteen', 'fifteen': 'fifteen',
  'sixteen': 'sixteen', 'seventeen': 'seventeen', 'eighteen': 'eighteen'
};

// Composite images function
function compositeImages(selectedElements) {
  console.log("compositeImages called with:", selectedElements);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 64; // Adjust based on the size of your images
  canvas.height = 64;

  const promises = [];
  const layerMap = {};
  const layerOrder = ['body', 'eyes', 'shirt', 'pants', 'jacket', 'shoes'];

  layerOrder.forEach((layer) => {
    if (selectedElements[layer]) {
      const imageNumber = selectedElements[layer];
      const filename = 'textures/' + imageNumber + '.png';
      console.log("Loading image:", filename); 

      const img = new Image();
      img.crossOrigin = "anonymous"; // Allow cross-origin if needed
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
        if (layerMap[layer]) {
          ctx.drawImage(layerMap[layer], 0, 0, canvas.width, canvas.height);
        }
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

// Select first box in each section by default
if (bodyOptions.length > 0) bodyOptions[0].classList.add('selected');
if (eyesOptions.length > 0) eyesOptions[0].classList.add('selected');
if (shirtOptions.length > 0) shirtOptions[0].classList.add('selected');
if (jacketOptions.length > 0) jacketOptions[0].classList.add('selected');
if (pantsOptions.length > 0) pantsOptions[0].classList.add('selected');
if (shoesOptions.length > 0) shoesOptions[0].classList.add('selected');

// Trigger skin update after model loads (will be called in loader callback too, but this ensures defaults are applied)
let initialUpdateScheduled = false;
const scheduleInitialUpdate = () => {
  if (!initialUpdateScheduled && object) {
    initialUpdateScheduled = true;
    updateSkin();
  }
};
setTimeout(scheduleInitialUpdate, 500);

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

    // Initialize - texture will be set when user selects layers
    object.traverse(function (child) {
      if (child.isMesh) {
        console.log('Mesh:', child.name, 'Material:', child.material.name);
        console.log('Has map:', !!child.material.map);
        console.log('Material properties:', child.material);
        child.material.needsUpdate = true;
      }
    });
    
    // Trigger initial skin update if selections exist
    updateSkin();
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
