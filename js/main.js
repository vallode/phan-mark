const bookmarkContainer = document.getElementById('bookmarks');
const localStorage = window.localStorage;

const notificationWrapper = document.querySelector('#notification-wrapper');

const form = document.querySelector('form#bookmark_form');
const inputName = document.getElementById('bookmark-input__name');
const inputUrl = document.getElementById('bookmark-input__url');

let bookmarks = [];
let totalPages = 1;
let pageNumber = 1;

/*
Check if a URL is currently up (UNUSED)
 */
async function getURL(url) {
  const request = await fetch(url, {mode: 'cors'});

  return request.status;
}

/*
Clone, populate, and add new bookmark to page
 */
const addBookmark = (id, name, url) => {
  const template = document.querySelector('#bookmark');
  let bookmark = document.importNode(template.content, true);

  bookmark.querySelector('.item').dataset.id = id;
  bookmark.querySelector('.item__link h3').textContent = name;
  bookmark.querySelector('.item__link').href = url;
  bookmark.querySelector('.item__link--delete').addEventListener('click', removeBookmark);

  if (bookmarks.length > (20 * totalPages)) {
    totalPages += 1;
    return;
  }

  if (bookmarkContainer.childElementCount >= 20) {
    return;
  }

  bookmarkContainer.appendChild(bookmark);
};

/*
Remove existing bookmark from localStorage and update
 */
const removeBookmark = (event) => {
  let bookmarks = fetchBookmarks();
  let bookmark = event.target.parentNode;

  bookmarkContainer.removeChild(bookmark);
  bookmarks = bookmarks.filter(item => item.id !== bookmark.dataset.id);

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  sendNotification('Deleted bookmark!');
};

/*
Remove all notifications
 */
const removeNotifications = () => {
  const notifications = notificationWrapper.querySelectorAll('.notification');

  notifications.forEach((e) => {
    notificationWrapper.removeChild(e);
  });
};

/*
Add a new notification to the page
 */
const sendNotification = (message) => {
  const template = document.getElementById('notification');
  const newNotification = document.importNode(template.content, true);

  newNotification.querySelector('.notification__message').textContent = message;

  removeNotifications();
  notificationWrapper.appendChild(newNotification);
};

/*
Regex (ugh.) for validating URL
Covers all valid URLs
 */
const validateURL = (url) => {
  let pattern = new RegExp('^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$', 'i');
  return pattern.test(url);
};

/*
Update page with bookmarks from localStorage depending on page
 */
const updatePage = () => {
  let bookmarks = fetchBookmarks();
  if (!bookmarks) return;

  let oldBookmarks = bookmarkContainer.querySelectorAll('.item');
  let nextBookmarks = bookmarks.slice((20 * (pageNumber - 1)), (40 * pageNumber));

  oldBookmarks.forEach((e) => {
    bookmarkContainer.removeChild(e);
  });

  nextBookmarks.forEach((e) => {
    addBookmark(e.id, e.name, e.url);
  });

  document.getElementById('page_number').textContent = pageNumber;
};

/*
Fetch bookmarks item from localStorage and parse to valid JSON
 */
function fetchBookmarks() {
  const data = localStorage.getItem('bookmarks');

  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
}

/*
On form submission check if name and url are provided.
Generates a decently-random ID for each bookmark (collisions may happen)
 */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = inputName.value.trim();
  const url = inputUrl.value.trim();

  if (!name || !url) {
    sendNotification('Please provide both name and url');

    return;
  }

  if (!validateURL(url)) {
    sendNotification('Cannot connect to the URL provided');

    return;
  }

  let bookmark = {
    'id': '_' + Math.random().toString(36).substr(2, 9),
    'name': inputName.value,
    'url': inputUrl.value
  };

  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  sendNotification('Added bookmark successfully!');

  addBookmark(bookmark.id, bookmark.name, bookmark.url);

  form.reset();
});

/*
On page load add pagination function and update the page with any stored bookmarks
 */
document.addEventListener('DOMContentLoaded', (e) => {

  document.querySelectorAll('.pagination__button').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const direction = button.dataset.direction;

      if (direction === 'left' && pageNumber > 1) {
        pageNumber -= 1;
        updatePage();
      } else if (direction === 'right' && pageNumber < totalPages) {
        pageNumber += 1;
        updatePage();
      }
    })
  });

  updatePage();
});