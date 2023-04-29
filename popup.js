let toggleButton = document.getElementById('toggleButton');
let statusElement = document.getElementById('status');
let filterValue = document.getElementById('filterValue');

function toggleHider() {
  let hiderStatus = browser.storage.local.get('hiderStatus');

  hiderStatus.then(function(result) {
    if (result.hiderStatus === 'on') {
      browser.storage.local.set({hiderStatus: 'off'});
      toggleButton.textContent = 'Turn Reddit Filter On';
      statusElement.textContent = 'Reddit Filter is currently off';
    } else {
      browser.storage.local.set({hiderStatus: 'on'});
      toggleButton.textContent = 'Turn Reddit Filter Off';
      statusElement.textContent = 'Reddit Filter is currently on';
    }
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {action: 'update'});
    });
  });
}

function updateFilterValue() {
  let newFilterValue = filterValue.value;
  browser.storage.local.set({filterValue: newFilterValue});
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {action: 'update'});
  });
}

toggleButton.addEventListener('click', toggleHider);
filterValue.addEventListener('input', updateFilterValue);

// Get the initial status and filter value of the hider when the popup is opened
let hiderStatus = browser.storage.local.get('hiderStatus');
let filterValuePromise = browser.storage.local.get('filterValue');

hiderStatus.then(function(result) {
  if (result.hiderStatus === 'on') {
    toggleButton.textContent = 'Turn Reddit Filter Off';
    statusElement.textContent = 'Reddit Filter is currently on';
  } else {
    toggleButton.textContent = 'Turn Reddit Filter On';
    statusElement.textContent = 'Reddit Filter is currently off';
  }
});

filterValuePromise.then(function(result) {
  let currentFilterValue = result.filterValue || 2;
  filterValue.value = currentFilterValue;
});

// Update the content script with the current filter value when the popup is opened
browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
  browser.tabs.sendMessage(tabs[0].id, {action: 'update'});
});