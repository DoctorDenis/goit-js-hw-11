import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

let query = null;
let page = 1;
let totalHits;
let intervalId;
let gallery;
const API_KEY = "28051329-87464e49acaa9530f56c764e9";
const IMAGE_TYPE = "photo";
const ORIENTATION = "horizontal";
const SAFE_SEARCH = true;
const BASE_URL = `https://pixabay.com/api/?`;
const PER_PAGE = 40;


const refs = {
  formElement: document.querySelector('.search-form'),
  formInputElement: document.querySelector('.search-form').elements.searchQuery,
  formButtonElement: document.querySelector('[type="submit"]'),
  galleryElement: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more')
}

function renderGalleryMarkup(array) {
  const markup = array.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<a href="${largeImageURL}" class="photo-link">
            <div class="photo-card">
              <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item">
                  <b>Likes:</b>${likes}
                </p>
                <p class="info-item">
                  <b>Views:</b>${views}
                </p>
                <p class="info-item">
                  <b>Comments:</b>${comments}
                </p>
                <p class="info-item">
                  <b>Downloads:</b>${downloads}
                </p>
              </div>
            </div>
          </a>`
  }).join("");
  refs.galleryElement.insertAdjacentHTML("beforeend", markup);

}

refs.formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector('.final-message')?.remove();
  page = 1;
  refs.galleryElement.innerHTML = "";
  fetchImages(page);
})

async function fetchImages(pageNumber) {  
  query = refs.formInputElement.value;
  axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: IMAGE_TYPE,
      orientation: ORIENTATION,
      safesearch: SAFE_SEARCH,
      page: pageNumber,
      per_page: PER_PAGE
    }
  })
  .then(async (response) => {
    const imagesRendered = pageNumber * PER_PAGE;
    totalHits = await response.data.totalHits;
    if (imagesRendered < totalHits) {
      refs.loadMoreBtnEl.classList.remove("visually-hidden");
    } else {
      refs.loadMoreBtnEl.classList.add("visually-hidden");
    }

    if (totalHits > 0) {
      if (pageNumber === 1) {
        Notify.success(`Hooray! We found ${totalHits} images.`, {
        position: "center-top",
        fontSize: '18px',
        width: "450px",
        timeout: 3500,
        cssAnimationDuration: 500,
        cssAnimationStyle: 'zoom',
        fontAwesomeIconStyle: "shadow"
      });
      }
    } else {
        Notify.failure(`Sorry, no images found on query "${query}"`, {
        position: "center-top",
        fontSize: '18px',
        width: "450px",
        timeout: 3500,
        cssAnimationDuration: 500,
        cssAnimationStyle: 'zoom',
        fontAwesomeIconStyle: "shadow"
        });
    }

    renderGalleryMarkup(response.data.hits);


    gallery = new simpleLightbox('.gallery a', {
      captionsData: "alt",
      captionDelay: 250,
      animationSpeed: 180,
      animationSlide: true
    });

      if (document.querySelectorAll('.photo-card').length === totalHits && totalHits > 0) {
        refs.loadMoreBtnEl.classList.add("visually-hidden");
        const endMessage = document.createElement("h2");
        endMessage.classList.add("final-message");
        endMessage.textContent = "That's all, folks!"
        document.querySelector('.gallery').after(endMessage);
        console.log(endMessage);
  }
  })
  .catch(function (error) {
    console.log(error.message);
    alert(error.message);
 
  })
    .then(function () {
      // always executed
    });  
}

refs.loadMoreBtnEl.addEventListener("click",async (event) => {
  page += 1;
  fetchImages(page);
  refs.loadMoreBtnEl.classList.add("visually-hidden");
  console.log(document.querySelectorAll('.photo-card').length);

  intervalId = setTimeout(() => {
     const { height: cardHeight } = document.querySelector(".gallery").lastElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
    clearTimeout(intervalId);
  }, 500)

})

// window.addEventListener("scroll", (event) => {
//   // console.log("scrollY: ", event.path[1].scrollY);
//   //   console.log("innerHeight: ",event.path[1].innerHeight);
//   // console.log(event.path[1]);
//   const { bottom: down } = document.querySelector(".gallery").lastElementChild.getBoundingClientRect();
//   console.log(document.querySelector(".gallery").lastElementChild.getBoundingClientRect());
//   console.log(down);



// })

