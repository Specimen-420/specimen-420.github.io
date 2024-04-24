// Function to handle box click 
function handleBoxClick(event) {
  // Remove 'selected' class from all boxes in this section
  Array.from(event.currentTarget.parentNode.children).forEach(function (box) {
    box.classList.remove('selected');
  });

  // Add 'selected' class to the clicked box
  event.currentTarget.classList.add('selected');
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

function compositeImages(selectedElements) {
  console.log("compositeImages called with:", selectedElements);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Fixed canvas dimensions (adjust if needed) 
  canvas.width = 64;
  canvas.height = 64;

  // Image loading with promises
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
          // ctx.drawImage(img, 0, 0); // Draw the loaded image on the canvas
          layerMap[layer] = img;
          resolve(); 
        }
        img.onerror = reject; 
      }));
    }
  });

  // Download logic executes after all images load
  Promise.all(promises)
    .then(() => {
      console.log("All images loaded and drawn.");
      
      // Applying all images
      layerOrder.forEach((layer) => {
        ctx.drawImage(layerMap[layer], 0, 0);
      });

      // Small delay before download (optional)
      setTimeout(() => {
        // Download logic
        const dataURL = canvas.toDataURL('image/png'); 
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'my_skin.png'; 
        downloadLink.click(); 
      }, 100); // 100 millisecond delay
    })
    .catch((error) => {
      console.error("Error in Promise.all: ", error);
    })
    .finally(() => canvas.remove());
}

// Event listener for download button 
const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
  const selection = getSelectedElements();
  compositeImages(selection);
});

import * as THREE from 'three'; // Import the Three.js library


// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer(); 

const container = document.getElementById('cube-container');
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1); 
const material = new THREE.MeshBasicMaterial({ color: 0x00AA00 }); // Green color
const cube = new THREE.Mesh(geometry, material); 
scene.add(cube); 

// Position the camera 
camera.position.z = 3; // Move the camera back slightly

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();