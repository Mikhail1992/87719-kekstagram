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

(function () {
  var effectProcentDefault = 20;
  var choosedEffect = 'none';

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

  var setValue = function (args) {
    args.element.value = args.value;
  };

  var getNewSliderPosition = function (args) {
    var shift = args.startX - args.endX;

    switch (true) {
      case args.pinOffsetLeft - shift <= 0:
        return 0;
      case args.pinOffsetLeft - shift >= args.scaleLineWidth:
        return args.scaleLineWidth;
      default:
        return args.pinOffsetLeft - shift;
    }
  };

  var applySliderHandlers = function (args) {
    args.sliderElements.pin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      var scaleLineWidth = args.sliderElements.line.offsetWidth;

      var startCoords = {
        x: evt.clientX,
      };

      var dragged = false;

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
        dragged = true;

        var leftPosition = getNewSliderPosition({
          startX: startCoords.x,
          endX: moveEvt.clientX,
          pinOffsetLeft: args.sliderElements.pin.offsetLeft,
          scaleLineWidth: scaleLineWidth,
        });
        startCoords = {
          x: moveEvt.clientX,
        };

        var procent = Math.round((leftPosition / scaleLineWidth) * 100);
        effectProcentDefault = procent;
        args.sliderElements.pin.style.left = effectProcentDefault + '%';
        args.sliderElements.level.style.width = effectProcentDefault + '%';
        args.onChange(effectProcentDefault);
        setValue({
          element: args.sliderElements.value,
          value: effectProcentDefault,
        });
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (dragged) {
          var onClickPreventDefault = function () {
            upEvt.preventDefault();
            args.sliderElements.pin.removeEventListener(
                'click',
                onClickPreventDefault
            );
          };
          args.sliderElements.pin.addEventListener('click', onClickPreventDefault);
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  var currentImage = document.querySelector('.img-upload__preview img');
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

  var toggleVisibilitySlider = function (value) {
    if (value === 'none') {
      window.utils.hideElement(sliderContainer);
    } else {
      window.utils.showElement(sliderContainer);
    }
  };

  var sliderContainer = document.querySelector('.img-upload__scale');
  var effectList = document.querySelector('.effects__list');
  effectList.addEventListener('click', function (event) {
    var currentEffect = event.target;
    if (currentEffect.value) {
      var value = currentEffect.value;
      choosedEffect = value;
      currentImage.className = '';
      currentImage.classList.add('effects__preview--' + value);
      toggleVisibilitySlider(value);
      changeEffect(effectProcentDefault);
    }
  });

  var sliderElements = {
    value: document.querySelector('.scale__value'),
    line: document.querySelector('.scale__line'),
    level: document.querySelector('.scale__level'),
    pin: document.querySelector('.scale__pin'),
  };
  applySliderHandlers({
    sliderElements: sliderElements,
    onChange: changeEffect,
  });
})();

(function () {
  var handleResizeControl = function (args) {
    args.input.value = args.newValue + '%';
    args.node.style.transform = 'scale(' + args.newValue / 100 + ')';
  };

  var currentImage = document.querySelector('.img-upload__preview img');
  var resizeControlPlus = document.querySelector('.resize__control--plus');
  var resizeControlValue = document.querySelector('.resize__control--value');
  resizeControlPlus.addEventListener('click', function () {
    var inputValue = resizeControlValue.value;
    var value = Number(inputValue.split('%')[0]);
    var newValue = value < 100 ? (value += 25) : value;
    handleResizeControl({
      newValue: newValue,
      input: resizeControlValue,
      node: currentImage,
    });
  });

  var resizeControlMinus = document.querySelector('.resize__control--minus');
  resizeControlMinus.addEventListener('click', function () {
    var inputValue = resizeControlValue.value;
    var value = Number(inputValue.split('%')[0]);
    var newValue = value > 25 ? (value -= 25) : value;
    handleResizeControl({
      newValue: newValue,
      input: resizeControlValue,
      node: currentImage,
    });
  });
})();

(function () {
  var renderCurrentImage = function (args) {
    args.node.src = args.data.url;
  };

  var renderCurrentImageLikesCount = function (args) {
    args.node.textContent = args.data.likes;
  };

  var renderCurrentImageCommentsCount = function (args) {
    args.node.textContent = args.data.comments.length;
  };

  var createCurrentImageCommentAvatar = function () {
    var commentAuthorAvatar = window.utils.makeElement({
      tagName: 'img',
      className: 'social__picture',
    });
    commentAuthorAvatar.src =
      'img/avatar-' + window.utils.randomInteger(1, 6) + '.svg';
    commentAuthorAvatar.width = 35;
    commentAuthorAvatar.height = 35;
    return commentAuthorAvatar;
  };

  var renderCurrentImageComment = function (args) {
    var commentText = document.createTextNode(args.comments);
    window.utils.appendNode({
      childNode: args.childNode,
      parentNode: args.parentNode,
    });
    window.utils.appendNode({
      childNode: args.avatar,
      parentNode: args.childNode,
    });
    window.utils.appendNode({
      childNode: commentText,
      parentNode: args.childNode,
    });
  };

  var renderCurrentImageDescription = function (args) {
    args.node.textContent = args.message;
  };

  window.utils.hideVisuallyElement(document.querySelector('.social__comment-count'));
  window.utils.hideVisuallyElement(document.querySelector('.social__loadmore'));

  var imageUploadContainer = document.querySelector('.img-upload__overlay');
  var uploadFile = document.querySelector('#upload-file');
  uploadFile.addEventListener('change', function (event) {
    if (event.target.files.length) {
      window.utils.showElement(imageUploadContainer);
    }
  });

  var buttonClose = document.querySelector('.img-upload__cancel');
  buttonClose.addEventListener('click', function () {
    window.utils.hideElement(imageUploadContainer);
  });

  var currentPictureNode = document.querySelector('.big-picture');
  var buttonCloseBigBicture = document.querySelector('.big-picture__cancel');
  buttonCloseBigBicture.addEventListener('click', function () {
    window.utils.hideElement(currentPictureNode);
  });

  var currentPictureData = window.pictureList[0];
  var currentModalImage = document.querySelector('.big-picture__img img');
  renderCurrentImage({
    data: currentPictureData,
    node: currentModalImage,
  });

  var currentLikes = currentPictureNode.querySelector('.likes-count');
  renderCurrentImageLikesCount({
    data: currentPictureData,
    node: currentLikes,
  });

  var currentCommentsCount = currentPictureNode.querySelector('.comments-count');
  renderCurrentImageCommentsCount({
    data: currentPictureData,
    node: currentCommentsCount,
  });

  var commentWrapper = window.utils.makeElement({
    tagName: 'li',
    className: 'social__comment',
  });
  var commentsContainer = currentPictureNode.querySelector('.social__comments');
  renderCurrentImageComment({
    childNode: commentWrapper,
    parentNode: commentsContainer,
    comments: currentPictureData.comments,
    avatar: createCurrentImageCommentAvatar(),
  });

  var currentDescription = currentPictureNode.querySelector('.social__caption');
  renderCurrentImageDescription({
    message: currentPictureData.description,
    node: currentDescription,
  });
})();

(function () {
  var validityErrors = {
    hashCount: 'Количество хештегов не должно быть больше 5',
    char: 'Первый символ каждого тега должен быть #',
    minLength: 'Длина тега не может быть меньше 1 символа',
    maxLength: 'Длина тега не может быть больше 20 символов',
    dublicates: 'В списке хештегов содержатся дубликаты',
  };

  var handleTagCount = function (values) {
    var message = '';
    if (values.length > 5) {
      message = validityErrors.hashCount;
    }
    return message;
  };

  var handleCheckFirstChar = function (values) {
    var message = '';
    values.forEach(function (value) {
      if (value[0] !== '#') {
        message = validityErrors.char;
      }
    });

    return message;
  };

  var handleCheckTagLength = function (values) {
    var minLength = 2;
    var maxLength = 20;
    var message = '';

    values.forEach(function (value) {
      if (value.length < minLength) {
        message = validityErrors.minLength;
      } else if (value.length > maxLength) {
        message = validityErrors.maxLength;
      }
    });

    return message;
  };

  var handleDuplicates = function (values) {
    var value = {};
    var message = '';

    values.forEach(function (item) {
      if (!value[item]) {
        value[item] = true;
      } else {
        message = validityErrors.dublicates;
      }
    });

    return message;
  };

  var checkValidity = function (tags) {
    var validityMessages = {
      handleCheckFirstChar: handleCheckFirstChar(tags),
      handleTagCount: handleTagCount(tags),
      handleCheckTagLength: handleCheckTagLength(tags),
      handleDuplicates: handleDuplicates(tags),
    };
    for (var message in validityMessages) {
      if (validityMessages[message]) {
        return validityMessages[message];
      }
    }

    return '';
  };

  var hashTagForm = document.querySelector('#upload-select-image');
  hashTagForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var currentField = event.target.hashtags;
    var hashTags = '';
    var error = '';

    if (currentField.value && currentField.value.length > 0) {
      hashTags = currentField.value.trim().split(' ');
      error = checkValidity(hashTags);
      currentField.setCustomValidity(error);
    }

    if (!error) {
      hashTagForm.submit();
    }
  });

  var hashTagsInput = document.querySelector('.text__hashtags');
  hashTagsInput.addEventListener('input', function (event) {
    var currentField = event.target;
    var hashTags = '';

    if (currentField.value && currentField.value.length > 0) {
      hashTags = currentField.value.trim().split(' ');
      currentField.setCustomValidity(checkValidity(hashTags));
    }
  });
})();
