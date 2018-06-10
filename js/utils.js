'use strict';

(function () {
  window.utils = {};
  window.utils.randomInteger = function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  };

  window.utils.randomBool = function () {
    return Math.random > 0.5;
  };

  window.utils.showElement = function (node) {
    node.classList.remove('hidden');
  };

  window.utils.hideElement = function (node) {
    node.classList.add('visually-hidden');
  };

  window.utils.appendNode = function (childNode, parentNode) {
    parentNode.appendChild(childNode);
  };
})();
