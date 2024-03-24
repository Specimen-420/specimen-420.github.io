// Get all the rows
var rows = document.querySelectorAll('.row');

// Function to handle box click
function handleBoxClick(event) {
  // Remove 'selected' class from all boxes in this row
  Array.from(event.currentTarget.parentNode.children).forEach(function(box) {
    box.classList.remove('selected');
  });

  // Add 'selected' class to the clicked box
  event.currentTarget.classList.add('selected');
}

// Attach click event listener to all boxes in each row
rows.forEach(function(row) {
  Array.from(row.children).forEach(function(box) {
    box.addEventListener('click', handleBoxClick);
  });
});

function getSelectedElements() {
  const selectedElements = {
    body: document.querySelector('.row:nth-child(1) .selected')?.id,
    eyes: document.querySelector('.row:nth-child(2) .selected')?.id,
    shirt: document.querySelector('.row:nth-child(3) .selected')?.id,
    jacket: document.querySelector('.row:nth-child(4) .selected')?.id,
    pants: document.querySelector('.row:nth-child(5) .selected')?.id,
    shoes: document.querySelector('.row:nth-child(6) .selected')?.id
  };
  return selectedElements;
}

function compositeImages(selectedElements) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Fixed canvas dimensions 
  canvas.width = 64;
  canvas.height = 64;

  const promises = [];
  const layerOrder = ['body', 'eyes', 'shirt', 'jacket', 'pants', 'shoes'];

  layerOrder.forEach((layer) => {
    if (selectedElements[layer]) {
      const img = new Image();

      // Construct image filenames dynamically
      const imageNumber = selectedElements[layer]; 
      const filename = imageNumber + '.png'; 
      img.src = filename; 

      promises.push(new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          resolve();
        }
      }));
    }
  });

  Promise.all(promises).then(() => {
    // Image compositing complete
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = 'my_skin.png';
    downloadLink.click();
  });
}

const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
  const selection = getSelectedElements();
  compositeImages(selection);
});
