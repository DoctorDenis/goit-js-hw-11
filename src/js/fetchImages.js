import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs, renderGalleryMarkup } from "./index";

let query = null;
let totalHits;
let gallery;
const API_KEY = '28051329-87464e49acaa9530f56c764e9';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFE_SEARCH = true;
const BASE_URL = `https://pixabay.com/api/?`;
const PER_PAGE = 40;

export default async function fetchImages(pageNumber) {
  query = refs.formInputElement.value;
  axios
    .get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: IMAGE_TYPE,
        orientation: ORIENTATION,
        safesearch: SAFE_SEARCH,
        page: pageNumber,
        per_page: PER_PAGE,
      },
    })
    .then(async response => {
      const imagesRendered = pageNumber * PER_PAGE;
      totalHits = await response.data.totalHits;
      if (imagesRendered < totalHits) {
        refs.loadMoreBtnEl.classList.remove('visually-hidden');
      } else {
        refs.loadMoreBtnEl.classList.add('visually-hidden');
      }

      if (totalHits > 0) {
        if (pageNumber === 1) {
          Notify.success(`Hooray! We found ${totalHits} images.`, {
            position: 'center-top',
            fontSize: '18px',
            width: '450px',
            timeout: 3500,
            cssAnimationDuration: 500,
            cssAnimationStyle: 'zoom',
            fontAwesomeIconStyle: 'shadow',
          });
        }
      } else {
        Notify.failure(`Sorry, no images found on query "${query}"`, {
          position: 'center-top',
          fontSize: '18px',
          width: '450px',
          timeout: 3500,
          cssAnimationDuration: 500,
          cssAnimationStyle: 'zoom',
          fontAwesomeIconStyle: 'shadow',
        });
      }

      renderGalleryMarkup(response.data.hits);

      if (
        document.querySelectorAll('.photo-card').length === totalHits &&
        totalHits > 0
      ) {
        refs.loadMoreBtnEl.classList.add('visually-hidden');
        const endMessage = document.createElement('h2');
        endMessage.classList.add('final-message');
        endMessage.textContent = "We're sorry, but you've reached the end of search results.";
        document.querySelector('.gallery').after(endMessage);
      }
    })
    .catch(function (error) {
      console.log(error.message);
      alert(error.message);
    })
    .then(function () {
      // always executed
        gallery = new simpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
        animationSpeed: 180,
        animationSlide: true,
      });
      gallery.on('closed.simplelightbox', function (e) {
        gallery.refresh();
      });
    });
}