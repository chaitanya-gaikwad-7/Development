let dataList = [];
let selectedItems = [];

const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestions');
const selectedItemsList = document.getElementById('selectedItems');
const dropdownButton = document.getElementById('dropdownButton');

// Load data.json when the page loads
window.onload = async function() {
  try {
    const response = await fetch('data.json');
    dataList = await response.json();
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Event listener for typing
searchInput.addEventListener('input', () => {
  const input = searchInput.value.toLowerCase();
  showSuggestions(input);
});

// Event listener for dropdown button
dropdownButton.addEventListener('click', () => {
  // Toggle suggestions display
  if (suggestionsContainer.childElementCount > 0) {
    suggestionsContainer.innerHTML = ''; // Hide suggestions if open
  } else {
    showSuggestions(''); // Show all suggestions when no input filter
  }
});

// Function to show suggestions
function showSuggestions(filter) {
  suggestionsContainer.innerHTML = '';

  const filteredSuggestions = dataList.filter(item =>
    item.toLowerCase().includes(filter)
  );

  filteredSuggestions.forEach(suggestion => {
    const div = document.createElement('div');
    div.textContent = suggestion;

    div.onclick = () => {
      addSelectedItem(suggestion);
      searchInput.value = ''; // Clear search box
      suggestionsContainer.innerHTML = ''; // Clear suggestions
    };

    suggestionsContainer.appendChild(div);
  });

  // If nothing to show
  if (filteredSuggestions.length === 0) {
    const div = document.createElement('div');
    div.textContent = 'No results found';
    div.style.color = '#aaa';
    div.style.cursor = 'default';
    suggestionsContainer.appendChild(div);
  }
}

// Function to add items to the review box
function addSelectedItem(item) {
  if (selectedItems.includes(item)) {
    alert('Item already selected!');
    return;
  }

  selectedItems.push(item);
  renderSelectedItems();
}

// Function to render selected items in the review box
function renderSelectedItems() {
  selectedItemsList.innerHTML = '';

  selectedItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;

    const removeButton = document.createElement('button');
    removeButton.textContent = '×';
    removeButton.onclick = () => removeSelectedItem(index);

    li.appendChild(removeButton);
    selectedItemsList.appendChild(li);
  });
}

// Function to remove item from selected list
function removeSelectedItem(index) {
  selectedItems.splice(index, 1);
  renderSelectedItems();
}

// Submit button event listener
const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', () => {
  if (selectedItems.length === 0) {
    alert('Please select at least one item before submitting!');
    return;
  }

  // Convert array to string (each item on a new line)
  const content = selectedItems.join('\n');

  // Create a Blob with the content
  const blob = new Blob([content], { type: 'text/plain' });

  // Create a download link
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'selected_items.txt';

  // Append to the body temporarily and click to download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
});
