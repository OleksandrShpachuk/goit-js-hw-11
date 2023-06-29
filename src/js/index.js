import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './img-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imageApiService = new ImagesApiService();
const form = document.querySelector('form#search-form');
const gallery = document.querySelector('div.gallery');
const loadMoreButton = document.querySelector('button.load-more');
let lightbox;

form.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();
  loadMoreButton.classList.add('is-hidden');
  gallery.innerHTML = '';
  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.resetPage();

  if (imageApiService.query === '') {
    Notify.info('Please enter your search query!');
    return;
  }

  try {
    const data = await imageApiService.getImage();
    let queriesArray = data.hits;

    if (queriesArray.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImages(queriesArray);
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      loadMoreButton.classList.toggle('is-hidden', queriesArray.length < 40);
      initializeLightbox();
    }
  } catch (error) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    console.log(error);
  }
}

async function onLoadMore() {
  try {
    const data = await imageApiService.getImage();
    let queriesArray = data.hits;
    renderImages(queriesArray);
    loadMoreButton.classList.toggle('is-hidden', queriesArray.length < 40);
    initializeLightbox();
  } catch (error) {
    console.log(error);
  }
}

function renderImages(queriesArray) {
  let markup = '';

  queriesArray.forEach(item => {
    markup += `<a href="${item.largeImageURL}" class="lightbox-target">
      <div class="photo-card">
        <div class="thumb"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b><span>${item.likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b><span>${item.views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b><span>${item.comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b><span>${item.downloads}</span>
          </p>
        </div>
      </div>
    </a>`;
  });

  gallery.insertAdjacentHTML('beforeend', markup);
}

function initializeLightbox() {
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.lightbox-target');
  }
}
