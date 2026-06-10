function initMoviePlayer(streamUrl) {
  const video = document.getElementById('moviePlayer');
  const cover = document.querySelector('.player-cover');
  const trigger = document.getElementById('playTrigger');
  let prepared = false;
  let hlsInstance = null;

  if (!video || !streamUrl) {
    return;
  }

  function hideCover() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  }

  function showCover() {
    if (cover) {
      cover.classList.remove('is-hidden');
    }
  }

  function playVideo() {
    const promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        showCover();
      });
    }
  }

  function prepare() {
    if (prepared) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        playVideo();
      });
    } else {
      video.src = streamUrl;
    }
  }

  function startPlayback() {
    hideCover();
    prepare();
    playVideo();
  }

  if (trigger) {
    trigger.addEventListener('click', startPlayback);
  }

  if (cover) {
    cover.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', hideCover);
  video.addEventListener('error', showCover);

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
