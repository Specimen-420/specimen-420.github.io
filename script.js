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
  const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
  const selection = getSelectedElements();
  compositeImages(selection);
});

  // Fixed canvas dimensions 
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
          console.log("Image Loaded: ", filename); // Log for debugging 
          ctx.drawImage(img, 0, 0); 
          resolve(); // Resolve the promise after drawing
        }
        img.onerror = reject; // Reject the promise if there's an error
      }));
    }
  });

  Promise.all(promises)
    .then(() => {
      console.log("All images loaded and drawn.");

      // Get the data URL of the canvas
      const dataURL = canvas.toDataURL('image/png'); 

      // Create a temporary link element (not added to the DOM)
      const downloadLink = document.createElement('a');
      downloadLink.href = dataURL;
      downloadLink.download = 'my_skin.png'; // Set the desired filename

      // Simulate a click to trigger the download
      downloadLink.click(); 
    })
    .catch((error) => {
      console.error("Error in Promise.all: ", error);
    });
}
}