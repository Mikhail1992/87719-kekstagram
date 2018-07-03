'use strict';

(function () {
  var picturesContainer = document.querySelector('.pictures');
  var emptyPictureList = picturesContainer.innerHTML;
  var originalPictures;
  var generatePicture = function (args) {
    var pictureElement = args.node.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = args.data.url;
    pictureElement.querySelector('.picture__stat--likes').textContent =
    args.data.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent =
    args.data.comments.length;

    return pictureElement;
  };

  var pictureTemplate = function () {
    return document.querySelector('#picture').content;
  };

  var renderPictureList = function (args) {
    var fragment = document.createDocumentFragment();
    args.elements.forEach(function (element) {
      window.utils.appendNode({
        childNode: generatePicture({
          data: element,
          node: pictureTemplate(),
        }),
        parentNode: fragment,
      });
    });
    window.utils.appendNode({
      childNode: fragment,
      parentNode: args.parentNode,
    });
  };

  var showFilter = function () {
    var filter = document.querySelector('.img-filters');
    filter.classList.remove('img-filters--inactive');
  };

  var successPicturesLoad = function (data) {
    window.pictureList = data;
    originalPictures = data;
    renderPictureList({
      elements: window.pictureList,
      parentNode: picturesContainer,
    });
    showFilter();
  };

  window.backend.load(successPicturesLoad, window.utils.errorHandler);

  var filterByPopular = function () {
    window.pictureList = originalPictures;
  };

  var filterByNew = function () {
    window.pictureList = window.utils.generateArrayPart(originalPictures, 10);
  };

  var filterByComments = function () {
    window.pictureList = originalPictures.sort(function (left, right) {
      if (left.comments.length > right.comments.length) {
        return -1;
      } else if (left.comments.length < right.comments.length) {
        return 1;
      }
      return 0;
    });
  };

  var handleFilterData = window.utils.debounce(function () {
    picturesContainer.innerHTML = emptyPictureList;
    renderPictureList({
      elements: window.pictureList,
      parentNode: picturesContainer,
    });
  });

  var filterForm = document.querySelector('.img-filters__form');
  var filterButton = document.querySelectorAll('.img-filters__button');
  var filter = {
    'filter-popular': filterByPopular,
    'filter-new': filterByNew,
    'filter-discussed': filterByComments,
  };

  var changeActiveFilter = function (event) {
    filterButton.forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    var currentFilterId = event.target.id;
    event.target.classList.add('img-filters__button--active');
    filter[currentFilterId]();
  };

  filterForm.addEventListener('click', function (event) {
    changeActiveFilter(event);
    handleFilterData();
  });
})();
