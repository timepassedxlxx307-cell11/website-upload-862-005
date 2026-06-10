function initMoviePlayer(source, videoId, coverId) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var hls = null;
    if (!video || !source) {
        return;
    }
    function attachSource() {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            if (video.src !== source) {
                video.src = source;
            }
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            if (!hls) {
                hls = new window.Hls();
                hls.loadSource(source);
                hls.attachMedia(video);
            }
            return;
        }
        if (video.src !== source) {
            video.src = source;
        }
    }
    function playVideo() {
        attachSource();
        if (cover) {
            cover.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }
    if (cover) {
        cover.addEventListener("click", playVideo);
    }
    video.addEventListener("click", function () {
        if (video.paused) {
            playVideo();
        }
    });
}
