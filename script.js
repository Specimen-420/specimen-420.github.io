// Function to handle box click 
function handleBoxClick(event) {
  // ... (Your existing code) ... 
}

// Attach click event listeners ...
// ... (Your existing code) ...

function getSelectedElements() {
  // ... (Your existing code) ... 
}

function compositeImages(selectedElements) {
  console.log("compositeImages called with:", selectedElements);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Fixed canvas dimensions (adjust if needed) 
  canvas.width = 64;
  canvas.height = 64;

  const promises = [];
  const layerOrder = ['body', 'eyes', 'shirt', 'jacket', 'pants', 'shoes'];

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
          ctx.drawImage(img, 0, 0); // Draw the loaded image on the canvas
          resolve(); 
        }
        img.onerror = reject; 
      }));
    }
  });

  Promise.all(promises)
    .then(() => {
      console.log("All images loaded and drawn.");

      // Small delay before download
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
    });
}

// Event listener for download button 
const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
  const selection = getSelectedElements();
  compositeImages(selection);
});
