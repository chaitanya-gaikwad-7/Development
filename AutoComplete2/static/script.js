let dataList = [];
let selectedItems = [];

const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestions');
const selectedItemsList = document.getElementById('selectedItems');
const dropdownButton = document.getElementById('dropdownButton');
const submitButton = document.getElementById('submitButton');

// Load data.json on page load
window.onload = async function() {
  try {
    const response = await fetch('/static/data.json');
    dataList = await response.json();
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Autocomplete event handlers
searchInput.addEventListener('input', () => {
  const input = searchInput.value.toLowerCase();
  showSuggestions(input);
});

dropdownButton.addEventListener('click', () => {
  if (suggestionsContainer.childElementCount > 0) {
    suggestionsContainer.innerHTML = '';
  } else {
    showSuggestions('');
  }
});

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
      searchInput.value = '';
      suggestionsContainer.innerHTML = '';
    };

    suggestionsContainer.appendChild(div);
  });

  if (filteredSuggestions.length === 0) {
    const div = document.createElement('div');
    div.textContent = 'No results found';
    div.style.color = '#aaa';
    div.style.cursor = 'default';
    suggestionsContainer.appendChild(div);
  }
}

function addSelectedItem(item) {
  if (selectedItems.includes(item)) {
    alert('Item already selected!');
    return;
  }

  selectedItems.push(item);
  renderSelectedItems();
}

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

function removeSelectedItem(index) {
  selectedItems.splice(index, 1);
  renderSelectedItems();
}

// Submit data to backend
submitButton.addEventListener('click', () => {
  const userId = document.getElementById('userId').value.trim();
  const emailName = document.getElementById('emailInput').value.trim();
  const emailDomain = document.getElementById('emailSelect').value;

  if (!userId) {
    alert('User ID is required!');
    return;
  }

  if (!emailName) {
    alert('Email name is required!');
    return;
  }

  if (selectedItems.length === 0) {
    alert('Please select at least one item!');
    return;
  }

  const email = `${emailName}${emailDomain}`;
  const payload = {
    userId,
    email,
    selections: selectedItems
  };

  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (response.ok) {
      alert('Data submitted successfully!');
      resetForm();
    } else {
      alert('Failed to submit data.');
    }
  })
  .catch(error => {
    console.error('Error submitting data:', error);
    alert('Error occurred while submitting.');
  });
});

function resetForm() {
  document.getElementById('userId').value = '';
  document.getElementById('emailInput').value = '';
  selectedItems = [];
  renderSelectedItems();
}
