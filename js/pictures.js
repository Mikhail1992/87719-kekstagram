'use strict';

(function () {
  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content;

  var currentPictureNode = document.querySelector('.big-picture');
  var bigPictureImg = document.querySelector('.big-picture__img img');
  var buttonCloseBigBicture = document.querySelector('.big-picture__cancel');

  var uploadFile = document.querySelector('#upload-file');
  var imageUploadContainer = document.querySelector('.img-upload__overlay');
  var currentImage = document.querySelector('.img-upload__preview img');
  var buttonClose = document.querySelector('.img-upload__cancel');

  var resizeControlValue = document.querySelector('.resize__control--value');
  var resizeControlPlus = document.querySelector('.resize__control--plus');
  var resizeControlMinus = document.querySelector('.resize__control--minus');

  var effectList = document.querySelector('.effects__list');
  var choosedEffect = 'none';
  var effectProcentDefault = 20;

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

  var effectsList = {
    none: {
      effect: '',
      min: 0,
      max: 0,
      unit: '',
    },
    chrome: {
      effect: 'grayscale',
      min: 0,
      max: 1,
      unit: '',
    },
    sepia: {
      effect: 'sepia',
      min: 0,
      max: 1,
      unit: '',
    },
    marvin: {
      effect: 'invert',
      min: 0,
      max: 100,
      unit: '%',
    },
    phobos: {
      effect: 'blur',
      min: 0,
      max: 3,
      unit: 'px',
    },
    heat: {
      effect: 'brightness',
      min: 1,
      max: 3,
      unit: '',
      skip: 1,
    },
  };

  var showElement = function (node) {
    node.classList.remove('hidden');
  };

  var hideElement = function (node) {
    node.classList.add('hidden');
  };

  var hideVisuallyElement = function (node) {
    node.classList.add('visually-hidden');
  };

  var generateComments = function (size, outerComments) {
    var newComments = Array.prototype.slice.apply(outerComments);
    var shuffledComments = window.utils.shuffle(newComments);
    return shuffledComments.slice(0, size).join(' ');
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
          comments: generateComments(2, comments),
          description:
            description[window.utils.randomInteger(0, description.length - 1)],
        };
      });
  };

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
    pictureElement.querySelector('.picture__stat--likes').textContent =
      data.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent =
      data.comments.length;

    return pictureElement;
  };

  var renderPictureList = function (elements, parentNode) {
    var fragment = document.createDocumentFragment();
    elements.forEach(function (element) {
      window.utils.appendNode(
          generatePicture(element, pictureTemplate),
          fragment
      );
    });
    window.utils.appendNode(fragment, parentNode);
  };

  var renderCurrentImage = function (data, node) {
    node.src = data.url;
  };

  var renderCurrentImageLikesCount = function (data) {
    var currentLikes = currentPictureNode.querySelector('.likes-count');
    currentLikes.textContent = data.likes;
  };

  var renderCurrentImageCommentsCount = function (data) {
    var currentCommentsCount = currentPictureNode.querySelector(
        '.comments-count'
    );
    currentCommentsCount.textContent = data.comments.length;
  };

  var createCurrentImageCommentAvatar = function () {
    var commentAuthorAvatar = makeElement('img', 'social__picture');
    commentAuthorAvatar.src =
      'img/avatar-' + window.utils.randomInteger(1, 6) + '.svg';
    commentAuthorAvatar.width = 35;
    commentAuthorAvatar.height = 35;
    return commentAuthorAvatar;
  };

  var renderCurrentImageComment = function () {
    var commentText = document.createTextNode(currentPictureData.comments);
    var commentWrapper = makeElement('li', 'social__comment');
    var commentsContainer = currentPictureNode.querySelector(
        '.social__comments'
    );
    var commentAuthorAvatar = createCurrentImageCommentAvatar();
    window.utils.appendNode(commentWrapper, commentsContainer);
    window.utils.appendNode(commentAuthorAvatar, commentWrapper);
    window.utils.appendNode(commentText, commentWrapper);
  };

  var renderCurrentImageDescription = function () {
    var currentDescription = currentPictureNode.querySelector(
        '.social__caption'
    );
    currentDescription.textContent = currentPictureData.description;
  };

  var handleResizeControl = function (newValue, input, node) {
    input.value = newValue + '%';
    node.style.transform = 'scale(' + newValue / 100 + ')';
  };

  var setValue = function (el, value) {
    el.value = value;
  };

  var changeEffect = function (procent) {
    var difference =
      effectsList[choosedEffect].max - effectsList[choosedEffect].min;
    var onePart = Math.round(difference * procent) / 100;
    var unit = effectsList[choosedEffect].unit;
    var skip = effectsList[choosedEffect].skip
      ? effectsList[choosedEffect].skip
      : 0;
    var effect =
      effectsList[choosedEffect].effect +
      '(' +
      (onePart + skip) +
      '' +
      unit +
      ')';
    currentImage.style.filter = effectsList[choosedEffect].effect
      ? effect
      : 'none';
  };

  var getNewSliderPosition = function (startX, endX, pinOffsetLeft, scaleLineWidth) {
    var shift = startX - endX;

    switch (true) {
      case pinOffsetLeft - shift <= 0:
        return 0;
      case pinOffsetLeft - shift >= scaleLineWidth:
        return scaleLineWidth;
      default:
        return pinOffsetLeft - shift;
    }
  };

  var applySliderHandlers = function (sliderElements, onChange) {
    sliderElements.pin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      var scaleLineWidth = sliderElements.line.offsetWidth;

      var startCoords = {
        x: evt.clientX,
      };

      var dragged = false;

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
        dragged = true;

        var leftPosition = getNewSliderPosition(
            startCoords.x,
            moveEvt.clientX,
            sliderElements.pin.offsetLeft,
            scaleLineWidth
        );
        startCoords = {
          x: moveEvt.clientX,
        };

        var procent = Math.round((leftPosition / scaleLineWidth) * 100);
        effectProcentDefault = procent;
        sliderElements.pin.style.left = effectProcentDefault + '%';
        sliderElements.level.style.width = effectProcentDefault + '%';
        onChange(effectProcentDefault);
        setValue(sliderElements.value, effectProcentDefault);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (dragged) {
          var onClickPreventDefault = function () {
            upEvt.preventDefault();
            sliderElements.pin.removeEventListener(
                'click',
                onClickPreventDefault
            );
          };
          sliderElements.pin.addEventListener('click', onClickPreventDefault);
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  effectList.addEventListener('click', function (event) {
    var currentEffect = event.target;
    if (currentEffect.value) {
      var value = currentEffect.value;
      choosedEffect = value;
      currentImage.className = '';
      currentImage.classList.add('effects__preview--' + value);
      changeEffect(effectProcentDefault);
    }
  });

  uploadFile.addEventListener('change', function (event) {
    if (event.target.files.length) {
      showElement(imageUploadContainer);
    }
  });

  buttonClose.addEventListener('click', function () {
    hideElement(imageUploadContainer);
  });

  resizeControlPlus.addEventListener('click', function () {
    var inputValue = resizeControlValue.value;
    var value = Number(inputValue.split('%')[0]);
    var newValue = value < 100 ? (value += 25) : value;
    handleResizeControl(newValue, resizeControlValue, currentImage);
  });

  resizeControlMinus.addEventListener('click', function () {
    var inputValue = resizeControlValue.value;
    var value = Number(inputValue.split('%')[0]);
    var newValue = value > 25 ? (value -= 25) : value;
    handleResizeControl(newValue, resizeControlValue, currentImage);
  });

  picturesContainer.addEventListener('click', function (event) {
    var picture = event.target;
    if (picture.tagName === 'IMG') {
      showElement(currentPictureNode);
      bigPictureImg.src = picture.src;
    }
  });

  buttonCloseBigBicture.addEventListener('click', function () {
    hideElement(currentPictureNode);
  });

  var pictureList = generatePictures(25);
  var currentPictureData = pictureList[0];

  hideVisuallyElement(document.querySelector('.social__comment-count'));
  hideVisuallyElement(document.querySelector('.social__loadmore'));
  renderPictureList(pictureList, picturesContainer);
  renderCurrentImage(currentPictureData, bigPictureImg);
  renderCurrentImageLikesCount(currentPictureData);
  renderCurrentImageCommentsCount(currentPictureData);
  renderCurrentImageComment();
  renderCurrentImageDescription();
  var sliderElements = {
    value: document.querySelector('.scale__value'),
    line: document.querySelector('.scale__line'),
    level: document.querySelector('.scale__level'),
    pin: document.querySelector('.scale__pin'),
  };
  applySliderHandlers(sliderElements, changeEffect);
})();
