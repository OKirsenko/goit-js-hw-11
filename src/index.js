import './sass/main.scss';
import Notiflix from 'notiflix';
const axios = require('axios').default;

Notiflix.Notify.init({
  width: '350px',
  fontSize: '24px',
  distance: '30px',
  clickToClose: true,
});

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

const baseUrl =
  'https://pixabay.com/api/?key=25288753-ae0a850a1a7487bf73bd69a50&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

let pageCount = 1;
let keyWorld = '';

function onInputSubmit(event) {
  event.preventDefault();
  if (galleryEl.hasAttribute('data-rendered')) {
    galleryEl.removeAttribute('data-rendered');
  }
  pageCount = 1;
  moreBtn.classList.remove('js-btn');
  keyWorld = formEl.elements.searchQuery.value;
  reqServer(keyWorld, pageCount);
}

function reqServer(keyWorld, pageCount) {
  return axios.get(`${baseUrl}&q=${keyWorld}&page=${pageCount}`).then(res => renderMakup(res));
}
function renderMakup(res) {
  const totalPages = res.data.totalHits / 40;
  console.log(pageCount);
  if (pageCount > totalPages) {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    moreBtn.classList.add('js-btn');
  }

  const data = res.data.hits;

  if (data.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    return;
  }
  const markup = data
    .map(
      card => `
    <div class="photo-card">
  <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${card.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${card.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${card.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${card.downloads}
    </p>
  </div>
</div>`,
    )
    .join('');
  if (galleryEl.hasAttribute('data-rendered')) {
    galleryEl.insertAdjacentHTML('beforeend', markup);
  } else {
    galleryEl.setAttribute('data-rendered', 'true');
    galleryEl.innerHTML = markup;
  }
}

function onMoreBtnClick() {
  pageCount += 1;
  reqServer(keyWorld, pageCount);
}

formEl.addEventListener('submit', onInputSubmit);
moreBtn.addEventListener('click', onMoreBtnClick);
