'use strict';

(function () {
  window.utils = {};
  window.utils.randomInteger = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  window.utils.randomIntegerExistArr = function (min, max, exists) {
    var random = window.utils.randomInteger(min, max);
    var size = exists.length;
    while (size > 0) {
      if (random === exists[size - 1]) {
        return window.utils.randomIntegerExistArr(min, max, exists);
      }
      size--;
    }
    return random;
  };

  window.utils.randomBool = function () {
    return Math.random() > 0.5;
  };

  window.utils.appendNode = function (childNode, parentNode) {
    parentNode.appendChild(childNode);
  };

  window.utils.shuffle = function (array) {
    var size = array.length;
    var temp;
    var index;

    while (size > 0) {
      index = Math.floor(Math.random() * size);
      size--;
      temp = array[size];
      array[size] = array[index];
      array[index] = temp;
    }

    return array;
  };
})();
