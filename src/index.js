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
  pageCount = 1;
  if (galleryEl.hasAttribute('data-rendered')) {
    galleryEl.removeAttribute('data-rendered');
  }
  if (moreBtn.classList.contains('js-btn')) {
    moreBtn.classList.remove('js-btn');
  }
  keyWorld = formEl.elements.searchQuery.value;
  reqServer(keyWorld, pageCount);
}

async function reqServer(keyWorld, pageCount) {
  try {
    const result = await axios.get(`${baseUrl}&q=${keyWorld}&page=${pageCount}`);
    renderMakup(result);
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Ooops, something wrong happens...my bad!');
  }
}
function renderMakup(res) {
  const totalPages = res.data.totalHits / 40;
  const data = res.data.hits;

  if (data.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    return;
  }

  if (pageCount > totalPages) {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    moreBtn.classList.add('js-btn');
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
