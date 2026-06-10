(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var prev = carousel.querySelector("[data-hero-prev]");
    var next = carousel.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function normalize(text) {
    return String(text || "").toLowerCase().trim();
  }

  function initGlobalSearch() {
    var input = document.querySelector("[data-search-input]");
    var results = document.querySelector("[data-search-results]");
    var list = window.siteMovies || [];
    if (!input || !results || !list.length) {
      return;
    }

    function closeResults() {
      results.classList.remove("is-open");
      results.innerHTML = "";
    }

    function render(matches) {
      if (!matches.length) {
        results.innerHTML = '<div class="search-empty">没有找到匹配的影片</div>';
        results.classList.add("is-open");
        return;
      }
      results.innerHTML = matches.slice(0, 12).map(function (movie) {
        return [
          '<a class="search-result-item" href="./' + movie.file + '">',
          '<img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, "&quot;") + '">',
          '<span><strong>' + movie.title + '</strong><span>' + movie.year + ' · ' + movie.region + ' · ' + movie.genre + '</span></span>',
          '</a>'
        ].join("");
      }).join("");
      results.classList.add("is-open");
    }

    input.addEventListener("input", function () {
      var query = normalize(input.value);
      if (!query) {
        closeResults();
        return;
      }
      var matches = list.filter(function (movie) {
        return normalize([movie.title, movie.genre, movie.region, movie.year, movie.tags].join(" ")).indexOf(query) !== -1;
      });
      render(matches);
    });

    document.addEventListener("click", function (event) {
      if (!results.contains(event.target) && event.target !== input) {
        closeResults();
      }
    });
  }

  function initListSearch() {
    var input = document.querySelector("[data-list-search]");
    var list = document.querySelector("[data-card-list]");
    if (!input || !list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));
    input.addEventListener("input", function () {
      var query = normalize(input.value);
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year")
        ].join(" "));
        card.classList.toggle("is-filtered-out", query && text.indexOf(query) === -1);
      });
    });
  }

  window.initMoviePlayer = function (playUrl) {
    var video = document.querySelector(".movie-video");
    var cover = document.querySelector(".play-cover");
    var attached = false;
    var hlsInstance = null;

    if (!video || !cover || !playUrl) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = playUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(playUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = playUrl;
      }
    }

    function play() {
      attach();
      cover.classList.add("is-hidden");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          cover.classList.remove("is-hidden");
        });
      }
    }

    cover.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      cover.classList.add("is-hidden");
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  ready(function () {
    initMenu();
    initHero();
    initGlobalSearch();
    initListSearch();
  });
})();
