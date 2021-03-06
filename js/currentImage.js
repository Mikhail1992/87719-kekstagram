'use strict';


(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var INPUT_FIELD = 'INPUT';
  var TEXTAREA_FIELD = 'TEXTAREA';

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

  var renderCurrentImageComments = function (args) {
    var commentsContainer = currentPictureNode.querySelector('.social__comments');
    commentsContainer.innerHTML = '';
    args.comments.slice(' ').forEach(function (comment) {
      var commentWrapper = window.utils.makeElement({
        tagName: 'li',
        className: 'social__comment',
      });
      var commentText = document.createTextNode(comment);
      var avatar = createCurrentImageCommentAvatar();
      window.utils.appendNode({
        childNode: avatar,
        parentNode: commentWrapper,
      });
      window.utils.appendNode({
        childNode: commentText,
        parentNode: commentWrapper,
      });
      window.utils.appendNode({
        childNode: commentWrapper,
        parentNode: commentsContainer,
      });
    });
  };

  var imageUploadContainer = document.querySelector('.img-upload__overlay');
  var handleCloseUploadContainer = function () {
    window.utils.hideElement(imageUploadContainer);
  };

  var handleCloseKeyUploadContainer = function (event) {
    var target = event.target;
    if (
      event.keyCode === ESC_KEYCODE &&
      target.nodeName !== INPUT_FIELD &&
      target.nodeName !== TEXTAREA_FIELD
    ) {
      window.utils.hideElement(imageUploadContainer);
      window.utils.hideElement(currentPictureNode);
    }
  };

  window.utils.hideVisuallyElement(document.querySelector('.social__comment-count'));
  window.utils.hideVisuallyElement(document.querySelector('.social__loadmore'));

  var uploadFile = document.querySelector('#upload-file');
  uploadFile.addEventListener('change', function (event) {
    if (event.target.files.length) {
      window.utils.showElement(imageUploadContainer);
      imageUploadContainer.focus();

      var buttonClose = document.querySelector('.img-upload__cancel');
      var resizeControlPlus = document.querySelector('.resize__control--plus');
      var resizeControlMinus = document.querySelector('.resize__control--minus');
      var hashTagForm = document.querySelector('#upload-select-image');
      var hashTagsInput = document.querySelector('.text__hashtags');
      var effectList = document.querySelector('.effects__list');

      buttonClose.addEventListener('click', handleCloseUploadContainer);
      document.body.addEventListener('keydown', handleCloseKeyUploadContainer);
      resizeControlPlus.addEventListener('click', window.handleResizePlus);
      resizeControlMinus.addEventListener('click', window.handleResizeMinus);
      hashTagForm.addEventListener('submit', window.handleSubmitUploadForm);
      hashTagsInput.addEventListener('input', window.handleInputTags);

      effectList.addEventListener('click', function (evt) {
        window.changeEffectData(evt.target.value);
      });

      effectList.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          window.changeEffectData(evt.target.querySelector('input').value);
        }
      });
    }
  });

  var currentPictureNode = document.querySelector('.big-picture');
  var buttonCloseBigBicture = document.querySelector('.big-picture__cancel');
  var currentModalImage = document.querySelector('.big-picture__img img');
  var picturesContainer = document.querySelector('.pictures');
  picturesContainer.addEventListener('click', function (event) {
    var picture = event.target;
    if (picture.tagName === 'IMG') {
      var currentPictureData = window.pictureList.filter(function (currentImage) {
        return currentImage.url === picture.getAttribute('src');
      })[0];
      window.utils.showElement(currentPictureNode);
      currentModalImage.src = picture.src;

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

      renderCurrentImageComments({
        comments: currentPictureData.comments,
      });
    }

    buttonCloseBigBicture.addEventListener('click', function () {
      window.utils.hideElement(currentPictureNode);
    });
  });
})();
