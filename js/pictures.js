'use strict';

(function () {
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

  var picturesContainer = document.querySelector('.pictures');

  var successPicturesLoad = function (data) {
    window.pictureList = data;
    renderPictureList({
      elements: window.pictureList,
      parentNode: picturesContainer,
    });
  };

  window.backend.load(successPicturesLoad, window.utils.errorHandler);
})();
