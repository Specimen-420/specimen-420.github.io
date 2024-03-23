// Get all the boxes
var boxes = document.querySelectorAll('#one, #two, #three, #four, #five, #six, #seven, #eight, #nine, #ten, #eleven, #twelve, #thirteen, #fourteen, #fifteen, #sixteen, #seventeen, #eighteen');

// Function to handle box click
function handleBoxClick(event) {
  // Remove 'selected' class from all boxes
  boxes.forEach(function(box) {
    box.classList.remove('selected');
  });

  // Add 'selected' class to the clicked box
  event.currentTarget.classList.add('selected');
}

// Attach click event listener to all boxes
boxes.forEach(function(box) {
  box.addEventListener('click', handleBoxClick);
});