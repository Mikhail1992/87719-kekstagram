'use strict';

(function () {
  window.utils = {
    randomInteger: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },

    randomIntegerExistArr: function (min, max, exists) {
      var random = window.utils.randomInteger(min, max);
      var size = exists.length;
      while (size > 0) {
        if (random === exists[size - 1]) {
          return window.utils.randomIntegerExistArr(min, max, exists);
        }
        size--;
      }
      return random;
    },

    randomBool: function () {
      return Math.random() > 0.5;
    },

    appendNode: function () {
      var object = arguments[0];
      object.parentNode.appendChild(object.childNode);
    },

    shuffle: function (array) {
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
    },

    makeElement: function () {
      var object = arguments[0];
      var element = document.createElement(object.tagName);
      element.classList.add(object.className);
      if (object.text) {
        element.textContent = object.text;
      }
      return element;
    },

    showElement: function (node) {
      node.classList.remove('hidden');
    },

    hideElement: function (node) {
      node.classList.add('hidden');
    },

    hideVisuallyElement: function (node) {
      node.classList.add('visually-hidden');
    },

    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';

      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    },

    generateArrayPart: function (arr, arrLength) {
      var indexArr = Array(arr.length).fill().map(function (item, index) {
        return index;
      });
      var newArrayIndexes = indexArr.slice(0, arrLength);
      return window.utils.shuffle(newArrayIndexes).map(function (index) {
        return arr[index];
      });
    },

    debounce: function (fun) {
      var DEBOUNCE_INTERVAL = 300;
      var lastTimeout = null;

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          fun.apply(null, args);
        }, DEBOUNCE_INTERVAL);
      };
    },
  };
})();
