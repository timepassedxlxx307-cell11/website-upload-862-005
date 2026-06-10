function attachMoviePlayer(source) {
  var video = document.querySelector(".js-player-video");
  var button = document.querySelector(".js-play-trigger");
  if (!video || !source) {
    return;
  }

  var hideButton = function () {
    if (button) {
      button.classList.add("is-hidden");
    }
  };

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
  } else if (window.Hls && window.Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(source);
    hls.attachMedia(video);
  } else {
    video.src = source;
  }

  if (button) {
    button.addEventListener("click", function () {
      hideButton();
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    });
  }

  video.addEventListener("play", hideButton);
}
