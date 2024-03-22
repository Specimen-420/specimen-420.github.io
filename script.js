// Get all the boxes
const boxes = document.querySelectorAll('#selection-box');

// Add a click event listener to each box
boxes.forEach(box => {
  box.addEventListener('click', function() {
    this.classList.toggle('clicked'); // Toggle the 'clicked' class
  });
});