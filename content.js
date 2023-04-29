function hidePosts(filterValue) {
  let hiderStatus = browser.storage.local.get('hiderStatus');

  hiderStatus.then(function(result) {
    let posts = document.querySelectorAll('.thing');

    for (let post of posts) {
      let comments = post.querySelector('.comments');

      if (comments && parseInt(comments.textContent) > filterValue) {
        if (result.hiderStatus === 'on') {
          post.style.display = 'none';
        } else {
          post.style.display = 'block';
        }
      }
    }
  });
}

function updateFilterValue() {
  let filterValuePromise = browser.storage.local.get('filterValue');
  filterValuePromise.then(function(result) {
    let currentFilterValue = result.filterValue || 2;
    hidePosts(currentFilterValue);
  });
}

updateFilterValue();

window.addEventListener('load', updateFilterValue);

document.addEventListener('DOMNodeInserted', updateFilterValue);

browser.runtime.onMessage.addListener(function(message) {
  if (message.action === 'update') {
    updateFilterValue();
  }
});