'use strict';

(function() {
  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content;

  var renderPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

    return pictureElement;
  };

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

  var generatePictures = function (size) {
    var counter = 0;
    return Array(size).fill().map(function() {
      counter++;
      return {
        url: 'photos/' + counter + '.jpg',
        likes: window.randomInteger(15, 200),
        comments: [comments[window.randomInteger(0, comments.length - 1)]],
        description: description[window.randomInteger(0, description.length - 1)]
      }
    });
  };

  var makeElements = function (elements, parentNode) {
    var fragment = document.createDocumentFragment();
    elements.forEach(function (element) {
      fragment.appendChild(renderPicture(element));
    });
    parentNode.appendChild(fragment);
  };

  var makeElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    element.classList.add(className);
    if (text) {
      element.textContent = text;
    }
    return element;
  };

  makeElements(generatePictures(25), picturesContainer);

  var currentPicture = generatePictures(1)[0];
  var bigPicture = document.querySelector('.big-picture');
  bigPicture.classList.remove('hidden');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  bigPictureImg.src = currentPicture.url;
  var currentLikes = bigPicture.querySelector('.likes-count');
  currentLikes.textContent = currentPicture.likes;
  var currentCommentsCount = bigPicture.querySelector('.comments-count');
  currentCommentsCount.textContent = currentPicture.comments.length;

  var commentWrapper = makeElement('li', 'social__comment');
  var commentAuthorAvatar= makeElement('img', 'social__picture');
  commentAuthorAvatar.src = 'img/avatar-' + window.randomInteger(1, 6) + '.svg';
  commentAuthorAvatar.width = 35;
  commentAuthorAvatar.height = 35;
  var currentDescription = bigPicture.querySelector('.social__caption');
  currentDescription.textContent = currentPicture.description;
  var commentText = document.createTextNode(currentPicture.comments[0]);
  commentWrapper.appendChild(commentAuthorAvatar);
  commentWrapper.appendChild(commentText);

  var commentsContainer = bigPicture.querySelector('.social__comments');
  commentsContainer.appendChild(commentWrapper);

  var commentsCounter = document.querySelector('.social__comment-count');
  var commentsLoadMore = document.querySelector('.social__loadmore');
  commentsCounter.classList.add('visually-hidden');
  commentsLoadMore.classList.add('visually-hidden');
})();
