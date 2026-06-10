(function () {
    function attachStream(video) {
        if (!video || video.getAttribute('data-ready') === '1') {
            return;
        }

        var stream = video.getAttribute('data-stream');
        if (!stream) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hls.loadSource(stream);
            hls.attachMedia(video);

            if (window.Hls.Events && window.Hls.ErrorTypes) {
                hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
            }
        } else {
            video.src = stream;
        }

        video.setAttribute('data-ready', '1');
    }

    Array.prototype.slice.call(document.querySelectorAll('.video-shell')).forEach(function (shell) {
        var video = shell.querySelector('video[data-stream]');
        var button = shell.querySelector('[data-play-button]');

        function playVideo() {
            attachStream(video);
            shell.classList.add('is-playing');
            if (video) {
                var playAction = video.play();
                if (playAction && typeof playAction.catch === 'function') {
                    playAction.catch(function () {});
                }
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                attachStream(video);
            });
            video.addEventListener('play', function () {
                shell.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (!video.ended) {
                    shell.classList.remove('is-playing');
                }
            });
        }
    });
})();
