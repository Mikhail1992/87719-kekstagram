'use strict';

(function () {
  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content;

  var comments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var description = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var showElement = function (node) {
    node.classList.remove('hidden');
  };

  var hideVisuallyElement = function (node) {
    node.classList.add('visually-hidden');
  };

  var generateComments = function (size, outerComments) {
    var newComments = Array.prototype.slice.apply(outerComments);
    var shuffledComments = window.utils.shuffle(newComments);
    return shuffledComments.slice(0, size);
  };

  var generateImageUrl = function (size) {
    var newUrls = Array(size).fill().map((item, index) => index + 1);
    var shuffledUrls = window.utils.shuffle(newUrls);
    return shuffledUrls.slice(0, size);
  };

  var generatePictures = function (size) {
    var urlsList = generateImageUrl(size);
    return Array(size).fill().map(function (item, index) {
      return {
        url: 'photos/' + urlsList[index] + '.jpg',
        likes: window.utils.randomInteger(15, 200),
        comments: generateComments(2, comments),
        description: description[window.utils.randomInteger(0, description.length - 1)]
      };
    });
  };
  var pictureList = generatePictures(25);

  var makeElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    element.classList.add(className);
    if (text) {
      element.textContent = text;
    }
    return element;
  };

  var generatePicture = function (data, node) {
    var pictureElement = node.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = data.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = data.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = data.comments.length;

    return pictureElement;
  };

  var renderPictureList = function (elements, parentNode) {
    var fragment = document.createDocumentFragment();
    elements.forEach(function (element) {
      window.utils.appendNode(generatePicture(element, pictureTemplate), fragment);
    });
    window.utils.appendNode(fragment, parentNode);
  };

  var renderCurrentImage = function (data, node) {
    var bigPictureImg = node.querySelector('.big-picture__img img');
    bigPictureImg.src = data.url;
  };

  var renderCurrentImageLikesCount = function (data) {
    var currentLikes = currentPictureNode.querySelector('.likes-count');
    currentLikes.textContent = data.likes;
  };

  var renderCurrentImageCommentsCount = function (data) {
    var currentCommentsCount = currentPictureNode.querySelector('.comments-count');
    currentCommentsCount.textContent = data.comments.length;
  };

  var createCurrentImageCommentAvatar = function () {
    var commentAuthorAvatar = makeElement('img', 'social__picture');
    commentAuthorAvatar.src = 'img/avatar-' + window.utils.randomInteger(1, 6) + '.svg';
    commentAuthorAvatar.width = 35;
    commentAuthorAvatar.height = 35;
    return commentAuthorAvatar;
  };

  var renderCurrentImageComment = function () {
    var commentText = document.createTextNode(currentPictureData.comments);
    var commentWrapper = makeElement('li', 'social__comment');
    var commentsContainer = currentPictureNode.querySelector('.social__comments');
    var commentAuthorAvatar = createCurrentImageCommentAvatar();
    window.utils.appendNode(commentWrapper, commentsContainer);
    window.utils.appendNode(commentAuthorAvatar, commentWrapper);
    window.utils.appendNode(commentText, commentWrapper);
  };

  var renderCurrentImageDescription = function () {
    var currentDescription = currentPictureNode.querySelector('.social__caption');
    currentDescription.textContent = currentPictureData.description;
  };

  var currentPictureNode = document.querySelector('.big-picture');
  var currentPictureData = pictureList[0];
  showElement(currentPictureNode);
  hideVisuallyElement(document.querySelector('.social__comment-count'));
  hideVisuallyElement(document.querySelector('.social__loadmore'));
  renderPictureList(pictureList, picturesContainer);
  renderCurrentImage(currentPictureData, currentPictureNode);
  renderCurrentImageLikesCount(currentPictureData);
  renderCurrentImageCommentsCount(currentPictureData);
  renderCurrentImageComment();
  renderCurrentImageDescription();
})();
