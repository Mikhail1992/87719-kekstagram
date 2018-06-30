'use strict';

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
