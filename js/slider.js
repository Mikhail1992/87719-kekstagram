'use strict';

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
