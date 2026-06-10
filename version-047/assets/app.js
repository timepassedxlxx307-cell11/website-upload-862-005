(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
      toggle.textContent = panel.classList.contains("open") ? "×" : "☰";
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function currentQuery() {
    try {
      return new URLSearchParams(window.location.search).get("q") || "";
    } catch (error) {
      return "";
    }
  }

  function filterCards(query, category) {
    var keyword = normalize(query);
    var cat = normalize(category || "all");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
    var visible = 0;
    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      var itemCategory = normalize(card.getAttribute("data-category"));
      var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchCategory = cat === "all" || itemCategory === cat;
      var show = matchKeyword && matchCategory;
      card.classList.toggle("is-hidden", !show);
      if (show) {
        visible += 1;
      }
    });
    var empty = document.querySelector("[data-empty-state]");
    if (empty) {
      empty.classList.toggle("show", cards.length > 0 && visible === 0);
    }
  }

  function setupSearch() {
    var query = currentQuery();
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
    var localInput = document.querySelector("[data-local-search]");
    var localForm = document.querySelector("[data-local-search-form]");

    inputs.forEach(function (input) {
      if (query && !input.value) {
        input.value = query;
      }
    });

    if (localInput) {
      if (query && !localInput.value) {
        localInput.value = query;
      }
      filterCards(localInput.value, activeCategory());
      localInput.addEventListener("input", function () {
        filterCards(localInput.value, activeCategory());
      });
    } else if (query) {
      filterCards(query, activeCategory());
    }

    if (localForm) {
      localForm.addEventListener("submit", function (event) {
        event.preventDefault();
        filterCards(localInput ? localInput.value : "", activeCategory());
      });
    }
  }

  function activeCategory() {
    var active = document.querySelector("[data-filter].active");
    return active ? active.getAttribute("data-filter") : "all";
  }

  function setupFilters() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    if (!buttons.length) {
      return;
    }
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (item) {
          item.classList.remove("active");
        });
        button.classList.add("active");
        var input = document.querySelector("[data-local-search]");
        filterCards(input ? input.value : currentQuery(), activeCategory());
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearch();
  });
})();

window.initMoviePlayer = function (videoId, streamUrl) {
  var video = document.getElementById(videoId);
  if (!video || !streamUrl) {
    return;
  }
  var root = video.closest("[data-player]") || document;
  var overlay = root.querySelector("[data-play-overlay]");
  var cover = root.querySelector("[data-player-cover]");
  var loaded = false;

  function loadStream() {
    if (loaded) {
      return;
    }
    loaded = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }

  function play() {
    loadStream();
    if (overlay) {
      overlay.classList.add("hidden");
    }
    if (cover) {
      cover.classList.add("hidden");
    }
    video.controls = true;
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {
        video.controls = true;
      });
    }
  }

  if (overlay) {
    overlay.addEventListener("click", play);
  }
  video.addEventListener("click", function () {
    if (!loaded || video.paused) {
      play();
    }
  });
};
