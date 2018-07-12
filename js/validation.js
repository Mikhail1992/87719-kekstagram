'use strict';

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
      if (value.length < minLength && value[0] === '#') {
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
    var message = '';

    Object.keys(validityMessages).forEach(function (item) {
      if (validityMessages[item]) {
        message = validityMessages[item];
      }
    });

    return message;
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
    }

    currentField.setCustomValidity(error);

    var successLoad = function () {
      var imageUploadContainer = document.querySelector('.img-upload__overlay');
      window.utils.hideElement(imageUploadContainer);
    };

    if (!error) {
      var formData = new FormData(hashTagForm);
      window.backend.save(formData, successLoad, window.utils.errorHandler);
    }
  });

  var hashTagsInput = document.querySelector('.text__hashtags');
  hashTagsInput.addEventListener('input', function (event) {
    var currentField = event.target;
    var hashTags = '';
    var error = '';

    if (currentField.value && currentField.value.length > 0) {
      hashTags = currentField.value.trim().split(' ');
      error = checkValidity(hashTags);
    }

    currentField.setCustomValidity(error);
  });
})();
