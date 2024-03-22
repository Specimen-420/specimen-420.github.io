let selectedBoxId = null; // Stores the ID of the selected box

const boxes = document.querySelectorAll('#selection-box');

boxes.forEach(box => {
  box.addEventListener('click', function() {
    // Deselect previously selected box (if any)
    if (selectedBoxId) {
      document.getElementById(selectedBoxId).classList.remove('clicked');
    }
    
    // Update selected box and add 'clicked' class
    selectedBoxId = this.id;
    this.classList.add('clicked');
  });
});