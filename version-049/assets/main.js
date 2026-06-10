(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-menu]");
        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-hero]").forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var next = hero.querySelector("[data-hero-next]");
            var prev = hero.querySelector("[data-hero-prev]");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function start() {
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5000);
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            show(0);
            start();
        });

        document.querySelectorAll("[data-local-search]").forEach(function (input) {
            var scope = input.closest("main") || document;
            var cardScope = scope.querySelector("[data-card-scope]") || scope;
            var cards = Array.prototype.slice.call(cardScope.querySelectorAll("[data-card]"));
            var params = new URLSearchParams(window.location.search);

            if (input.getAttribute("data-read-query") === "1" && params.get("q")) {
                input.value = params.get("q");
            }

            function applyFilter() {
                var query = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-tags") || "",
                        card.textContent || ""
                    ].join(" ").toLowerCase();
                    card.classList.toggle("is-hidden", query && haystack.indexOf(query) === -1);
                });
            }

            input.addEventListener("input", applyFilter);
            applyFilter();
        });

        document.querySelectorAll("[data-global-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input || !input.value.trim()) {
                    return;
                }
                event.preventDefault();
                window.location.href = "search.html?q=" + encodeURIComponent(input.value.trim());
            });
        });
    });

    window.bindMoviePlayer = function (sourceUrl) {
        var area = document.querySelector("[data-player-area]");
        if (!area) {
            return;
        }
        var video = area.querySelector("video");
        var overlay = area.querySelector(".player-overlay");
        var attached = false;
        var hlsInstance = null;

        function attach() {
            if (attached || !video) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }
        }

        function play() {
            attach();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", play);
        }

        area.addEventListener("click", function (event) {
            if (event.target === video && video.paused) {
                play();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance && typeof hlsInstance.destroy === "function") {
                hlsInstance.destroy();
            }
        });
    };
}());
