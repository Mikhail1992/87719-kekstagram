'use strict';

(function () {
  var comments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
  ];

  var description = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!',
  ];

  var generateComments = function (args) {
    var newComments = Array.prototype.slice.apply(args.outerComments);
    var shuffledComments = window.utils.shuffle(newComments);
    return shuffledComments.slice(0, args.size).join(' ');
  };

  var generateImageUrl = function (size) {
    var newUrls = Array(size)
      .fill()
      .map(function (item, index) {
        return 'photos/' + (index + 1) + '.jpg';
      });
    var shuffledUrls = window.utils.shuffle(newUrls);
    return shuffledUrls.slice(0, size);
  };

  var generatePictures = function (size) {
    var urlsList = generateImageUrl(size);
    return Array(size)
      .fill()
      .map(function (item, index) {
        return {
          url: urlsList[index],
          likes: window.utils.randomInteger(15, 200),
          comments: generateComments({
            size: 2,
            outerComments: comments,
          }),
          description:
            description[window.utils.randomInteger(0, description.length - 1)],
        };
      });
  };

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

  window.pictureList = generatePictures(25);
  var picturesContainer = function () {
    return document.querySelector('.pictures');
  };

  renderPictureList({
    elements: window.pictureList,
    parentNode: picturesContainer(),
  });

  var currentModalImage = document.querySelector('.big-picture__img img');
  var currentPictureNode = document.querySelector('.big-picture');
  picturesContainer().addEventListener('click', function (event) {
    var picture = event.target;
    if (picture.tagName === 'IMG') {
      window.utils.showElement(currentPictureNode);
      currentModalImage.src = picture.src;
    }
  });
})();
