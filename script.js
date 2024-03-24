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