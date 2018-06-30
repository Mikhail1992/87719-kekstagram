'use strict';

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
