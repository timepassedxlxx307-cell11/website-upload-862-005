(function () {
  function start(video, overlay, source) {
    if (!video || video.getAttribute('data-started') === '1') {
      return;
    }

    video.setAttribute('data-started', '1');

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }

    video.src = source;
    video.play().catch(function () {});
  }

  window.initializeVideoPlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);

    if (!video) {
      return;
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        start(video, overlay, options.source);
      });

      var playButton = overlay.querySelector('.play-button');
      if (playButton) {
        playButton.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          start(video, overlay, options.source);
        });
      }
    }

    video.addEventListener('click', function () {
      start(video, overlay, options.source);
    });
  };
})();
