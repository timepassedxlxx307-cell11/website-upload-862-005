(function () {
    var ready = function (callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    };

    var loadHlsLibrary = function () {
        return new Promise(function (resolve, reject) {
            if (window.Hls) {
                resolve(window.Hls);
                return;
            }
            var script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
            script.async = true;
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    var attachStream = function (video, streamUrl) {
        if (video.dataset.ready === "true") {
            return Promise.resolve();
        }
        video.dataset.ready = "true";
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return Promise.resolve();
        }
        return loadHlsLibrary().then(function (Hls) {
            if (Hls && Hls.isSupported()) {
                var hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }).catch(function () {
            video.src = streamUrl;
        });
    };

    var initPlayer = function () {
        var player = document.querySelector("[data-player]");
        if (!player) {
            return;
        }
        var video = player.querySelector("video");
        var overlay = player.querySelector("[data-play-overlay]");
        var button = player.querySelector("[data-play-button]");
        var streamUrl = player.getAttribute("data-stream");
        if (!video || !streamUrl) {
            return;
        }
        var start = function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            attachStream(video, streamUrl).then(function () {
                var promise = video.play();
                if (promise && promise.catch) {
                    promise.catch(function () {});
                }
            });
        };
        if (overlay) {
            overlay.addEventListener("click", start);
        }
        if (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                start();
            });
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
    };

    var initMobileNav = function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    };

    var initHero = function () {
        var hero = document.querySelector("[data-hero-carousel]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var show = function (next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    };

    var initFilters = function () {
        var scope = document.querySelector("[data-filter-scope]");
        if (!scope) {
            return;
        }
        var input = scope.querySelector("[data-filter-input]");
        var typeSelect = scope.querySelector("[data-filter-type]");
        var yearSelect = scope.querySelector("[data-filter-year]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
        var empty = scope.querySelector("[data-no-results]");
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        if (input && query) {
            input.value = query;
        }
        var apply = function () {
            var text = input ? input.value.trim().toLowerCase() : "";
            var type = typeSelect ? typeSelect.value : "";
            var year = yearSelect ? yearSelect.value : "";
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = (card.getAttribute("data-search") || "").toLowerCase();
                var cardType = card.getAttribute("data-type") || "";
                var cardYear = card.getAttribute("data-year") || "";
                var match = (!text || haystack.indexOf(text) !== -1) && (!type || cardType === type) && (!year || cardYear === year);
                card.style.display = match ? "" : "none";
                if (match) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        };
        if (input) {
            input.addEventListener("input", apply);
        }
        if (typeSelect) {
            typeSelect.addEventListener("change", apply);
        }
        if (yearSelect) {
            yearSelect.addEventListener("change", apply);
        }
        apply();
    };

    var initPetals = function () {
        var layer = document.querySelector("[data-petal-layer]");
        if (!layer) {
            return;
        }
        for (var i = 0; i < 20; i += 1) {
            var petal = document.createElement("span");
            petal.className = "petal";
            petal.style.left = Math.round(Math.random() * 100) + "%";
            petal.style.animationDelay = (Math.random() * 8).toFixed(2) + "s";
            petal.style.animationDuration = (10 + Math.random() * 12).toFixed(2) + "s";
            layer.appendChild(petal);
        }
    };

    ready(function () {
        initMobileNav();
        initHero();
        initFilters();
        initPlayer();
        initPetals();
    });
})();
