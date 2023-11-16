const hamburger = document.querySelector('.hamburger');
const navHeader = document.querySelector('.nav__header');
const searchInput = document.querySelector('.search__input');
const btnSearch = document.querySelector('.search__button-go');
const btnClearSearch = document.querySelector('.search__button-clear');
const btnLatest = document.querySelector('.button__latest');
const btnTrending = document.querySelector('.button__trending');
const btnEditorsChoice = document.querySelector('.button__editors-choice');

document.addEventListener('click', collapseMenuOnPageClick);
hamburger.addEventListener('click', toggleMenuWidth);
navHeader.addEventListener('click', toggleMenuWidth);
searchInput.addEventListener('keyup', search);
btnSearch.addEventListener('click', search);
btnClearSearch.addEventListener('click', clearSearch);
btnLatest.addEventListener('click', () => getImages('', 'latest'));
btnTrending.addEventListener('click', () => getImages('', 'trending'));
btnEditorsChoice.addEventListener('click', () => getImages('', '', true));

getImages('', 'trending');

function search(e) {
  // Search initiated from search bar via 'Enter' key or clicking magnifying glass
  // Use default order/filter options
  if (e.key && e.key !== 'Enter') return;
  const query = encodeURIComponent(searchInput.value);
  if (query) getImages(query);
}

function getImages(query, order, editorsChoice, perPage=12) {
  const PIXABAY_API_KEY = '29028368-b4141d6053c22a85f3f6862e4';
  const baseUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}`;
  
  let PIXABAY_URL = baseUrl;
  if (query) PIXABAY_URL += `&q=${query}`;
  if (perPage) PIXABAY_URL += `&per_page=${perPage}`;
  if (order) PIXABAY_URL += `&order=${order}`;
  if (editorsChoice) PIXABAY_URL += `&editors_choice=${editorsChoice}`;

  // Clear any existing cards
  const results = document.querySelector('.results');
  while (results.firstChild) {
    results.removeChild(results.lastChild);
  }
  const div = document.createElement('div');
  const img = document.createElement('img');
  const span = document.createElement('span');

  img.setAttribute('src', './imgs/loading-spinner.gif');
  img.setAttribute('alt', 'loading circle animation');
  img.setAttribute('height', 32);
  img.setAttribute('width', 32);
  span.textContent = 'Loading...';

  div.classList = 'results__loading';

  results.appendChild(div);
  div.appendChild(img);
  div.appendChild(span);

  // Use the Pixabay API to find photos for the given search term
  fetch(PIXABAY_URL)
    .then((response) => response.json())
    .then((data) => {
      div.style.display = 'none';
      addResultsSummary(data.totalHits, decodeURIComponent(query) || capitalize(order) || `Editor's Choice`);
      data.hits.forEach((photo) => {
        addCard(
          photo.pageURL,
          photo.webformatURL,
          photo.webformatHeight,
          photo.webformatWidth,
          photo.tags,
          photo.userImageURL,
          photo.user,
          photo.user_id,
          photo.largeImageURL,
        );
      });
      addButtonEventListeners();
    });
}

function addResultsSummary(count, query) {
  // Show search term, or an error message if no results are found
  const results = document.querySelector('.results');
  const summary = document.createElement('div');
  const searchTerm = document.createElement('h1');
  const attribution = document.createElement('p');
  const attributionUrl = document.createElement('a');
  
  searchTerm.textContent = query;
  attribution.textContent = ' Powered by '
  attributionUrl.textContent = 'Pixabay';
  attributionUrl.setAttribute('href', 'https://pixabay.com/');
  attributionUrl.setAttribute('target', '_blank');
  summary.classList = 'results__summary';
  searchTerm.classList = 'results__search-term';
  attribution.classList = 'results__attribution';

  results.appendChild(summary);
  summary.appendChild(searchTerm);
  summary.appendChild(attribution);
  attribution.appendChild(attributionUrl);

  if (!count) {
    const error = document.createElement('div');
    const text = document.createElement('p');
    const img = document.createElement('img');
    results.appendChild(error);
    error.appendChild(text);
    error.appendChild(img);

    error.classList = 'results__error';
    text.classList = 'results__error-text';
    img.classList = 'results__error-img';
    text.textContent = `Sorry, we couldn't find any matches`;
    img.setAttribute('src', './imgs/sad-robot.jpg');
    img.setAttribute('alt', 'Sad cardboard robot');
  }
}

function addCard(imgPage, imgUrl, imgHeight, imgWidth, imgText, profilePicUrl, profileName, profileId, imgLargeUrl) {
  // Add each result as a card (photo, text, photographer, urls, buttons)
  const results = document.querySelector('.results');
  let gallery = document.querySelector('.results__gallery');
  if (!gallery) {
    gallery = document.createElement('div');
    results.appendChild(gallery);
    gallery.classList = 'results__gallery';
  }
  const article = document.createElement('article');
  const pageUrl = document.createElement('a');
  const img = document.createElement('img');
  const content = document.createElement('div');
  const text = document.createElement('p');
  const lastRow = document.createElement('div');
  const user = document.createElement('div');
  const userUrl = document.createElement('a');
  const userPic = document.createElement('img');
  const userName = document.createElement('p');
  const icons = document.createElement('div');
  const favorite = createSvgIcon('button', './imgs/icons.svg#favorite');
  const copy = createSvgIcon('button', './imgs/icons.svg#copy-link');
  const download = createSvgIcon('a', './imgs/icons.svg#download');
  
  text.textContent = imgText;
  userName.textContent = profileName;

  pageUrl.setAttribute('href', imgPage);
  pageUrl.setAttribute('target', '_blank');
  img.setAttribute('src', imgUrl);
  img.setAttribute('alt', imgText);
  img.setAttribute('height', imgHeight);
  img.setAttribute('width', imgWidth);
  userUrl.setAttribute('href', `https://pixabay.com/users/${profileName}-${profileId}`);
  userUrl.setAttribute('target', '_blank');
  userPic.setAttribute('src', profilePicUrl || 'imgs/generic-avatar.png');
  userPic.setAttribute('alt', profileName);
  favorite.setAttribute('title', 'favorite');
  copy.setAttribute('title', 'copy link');
  download.setAttribute('title', 'download');
  download.setAttribute('href', `${imgLargeUrl}?attachment=`);

  article.classList = 'card';
  img.classList = 'card__img';
  pageUrl.classList = 'card__page-url'
  content.classList = 'card__content';
  lastRow.classList = 'card__last-row';
  text.classList = 'card__text ellipsis-overflow';
  user.classList = 'card__profile';
  userPic.classList = 'card__profile-pic';
  userName.classList = 'card__profile-name ellipsis-overflow';
  userUrl.classList = 'card__profile-url';
  icons.classList = 'card__icons';
  favorite.classList = 'card__favorite';
  copy.classList = 'card__copy';
  download.classList = 'card__download';

  gallery.appendChild(article);
  article.appendChild(pageUrl);
  pageUrl.appendChild(img);
  article.appendChild(content);
  content.appendChild(text);
  content.appendChild(lastRow);
  lastRow.appendChild(user);
  lastRow.appendChild(icons);
  user.appendChild(userUrl);
  userUrl.appendChild(userPic);
  userUrl.appendChild(userName);
  icons.appendChild(favorite);
  icons.appendChild(copy);
  icons.appendChild(download);
}

function createSvgIcon(element, url) {
  // Creates and returns a wrapper element with the specified icon
  // Icon displayed with <svg> and <use> tags
  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const svg = document.createElementNS(svgNS, 'svg');
  const use = document.createElementNS(svgNS, 'use');

  const wrapper = document.createElement(element);
  wrapper.appendChild(svg);
  svg.appendChild(use);
  
  if (element === 'button') wrapper.setAttribute('type', 'button');
  use.setAttributeNS(xlinkNS, 'href', url);

  return wrapper;
}

function addButtonEventListeners() {
  // Handle clicking buttons on the card
  // - Favorite: Toggles heart to show red (favorite) or slate (not favorite)
  // - Copy: Copies page URL to clipboard, and shows a notification that clears after 3 seconds
  const gallery = document.querySelector('.results__gallery');
  gallery.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.classList.contains('card__favorite')) {
      button.classList.toggle('card__favorite--liked');
    } else if (button.classList.contains('card__copy')) {
      const toast = document.querySelector('.toast');
      const clipboardToast = createSvgIcon('div', './imgs/icons.svg#checkmark');
      const span = document.createElement('span');
      const pageUrl = button.closest('.card').querySelector('.card__page-url').getAttribute('href');

      toast.insertBefore(clipboardToast, toast.firstChild);
      clipboardToast.appendChild(span);
      
      navigator.clipboard.writeText(pageUrl);
      clipboardToast.classList = 'toast__clipboard';
      span.textContent = 'Link copied to clipboard!';

      setTimeout(() => clipboardToast.classList.add('active'), 50);
      setTimeout(() => clipboardToast.classList.remove('active'), 2600);
      setTimeout(() => clipboardToast.remove(), 3000);
    }
  });
}

function clearSearch() {
  // Clear search text by clicking "X"
  searchInput.value = '';
}

function capitalize(str) {
  // Returns string with first letter capitalized
  const firstLetter = str.charAt(0).toUpperCase();
  const remainder = str.slice(1);
  return firstLetter + remainder;
}

function toggleMenuWidth(e) {
  // Expand/collapse navigation menu upon clicking hamburger or arrow
  const nav = document.querySelector('.nav');
  const collapseWidth = getComputedStyle(nav).getPropertyValue('--width-menu-collapse');
  const expandWidth = getComputedStyle(nav).getPropertyValue('--width-menu-expand');
  const actualWidth = `${nav.offsetWidth - 1}px`  // Subtract 1px for border
  console.log(actualWidth, expandWidth);
  if (actualWidth === expandWidth) {
    setMenu('collapse');
  } else if((actualWidth === collapseWidth) || (nav.clientWidth == 0)) {
    setMenu('expand');
  }
}

function collapseMenuOnPageClick(e) {
  // Clicking outside of the menu will collapse it
  // (for lower resolutions, where the menu is overlaid on top of the page)
  const nav = document.querySelector('.nav');
  if (!window.matchMedia('(max-width: 992px)').matches) return;
  if ((e.target.closest('.hamburger')) || (e.target.closest('.nav__header'))) return;
  if (nav.classList.contains('nav--expand-menu')) {
    setMenu('collapse');
  }
}

function setMenu(mode) {
  // Collapse or expand menu
  const nav = document.querySelector('.nav');
  if (mode === 'collapse') {
    nav.classList.add('nav--collapse-menu');
    nav.classList.remove('nav--expand-menu');
  } else if (mode === 'expand') {
    nav.classList.add('nav--expand-menu');
    nav.classList.remove('nav--collapse-menu');
  }
}