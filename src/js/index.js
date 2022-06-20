import fetchImages from "./fetchImages";

let page = 1;
let intervalId;

export const refs = {
  formElement: document.querySelector('.search-form'),
  formInputElement: document.querySelector('.search-form').elements.searchQuery,
  formButtonElement: document.querySelector('[type="submit"]'),
  galleryElement: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

export function renderGalleryMarkup(array) {
  const markup = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
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
          </a>`;
      }
    )
    .join('');
  refs.galleryElement.insertAdjacentHTML('beforeend', markup);
}

refs.formElement.addEventListener('submit', event => {
  event.preventDefault();
  refs.loadMoreBtnEl.classList.add('visually-hidden');
  document.querySelector('.final-message')?.remove();
  page = 1;
  refs.galleryElement.innerHTML = '';
  fetchImages(page);
});


refs.loadMoreBtnEl.addEventListener('click', async event => {
  page += 1;
  fetchImages(page);
  refs.loadMoreBtnEl.classList.add('visually-hidden');

  intervalId = setTimeout(() => {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .lastElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    clearTimeout(intervalId);
  }, 500);
});
