import './sass/main.scss';
const axios = require('axios').default;

const formEl = document.querySelector('#search-form');
const baseUrl =
  'https://pixabay.com/api/?key=25288753-ae0a850a1a7487bf73bd69a50&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

let pageCount = 1;

function onInputSubmit(event) {
  event.preventDefault();
  const keyWorld = formEl.elements.searchQuery.value;
  reqServer(keyWorld);
}

function reqServer(keyWorld) {
  pageCount += 1;
  return axios.get(`${baseUrl}&q=${keyWorld}&page=${pageCount}`).then(res => renderMakup(res));
}
function renderMakup(res) {
  const data = res.data.hits;
  console.log(data);
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
}
formEl.addEventListener('submit', onInputSubmit);
