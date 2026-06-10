(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  var toggle = document.querySelector("[data-mobile-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");
  if (toggle && mobilePanel) {
    toggle.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var slides = selectAll("[data-hero-slide]");
  var dots = selectAll("[data-hero-dot]");
  if (slides.length > 0) {
    var current = 0;
    var showSlide = function (next) {
      current = (next + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle("is-active", index === current);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle("is-active", index === current);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterPanel = document.querySelector("[data-filter-panel]");
  if (filterPanel) {
    var keyword = filterPanel.querySelector("[data-filter-keyword]");
    var year = filterPanel.querySelector("[data-filter-year]");
    var clear = filterPanel.querySelector("[data-filter-clear]");
    var cards = selectAll("[data-card]");
    var applyFilter = function () {
      var q = (keyword && keyword.value ? keyword.value : "").trim().toLowerCase();
      var selectedYear = year && year.value ? year.value : "";
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type")
        ].join(" ").toLowerCase();
        var cardYear = card.getAttribute("data-year") || "";
        var visible = (!q || haystack.indexOf(q) !== -1) && (!selectedYear || selectedYear === cardYear);
        card.style.display = visible ? "" : "none";
      });
    };
    if (keyword) {
      keyword.addEventListener("input", applyFilter);
    }
    if (year) {
      year.addEventListener("change", applyFilter);
    }
    if (clear) {
      clear.addEventListener("click", function () {
        if (keyword) {
          keyword.value = "";
        }
        if (year) {
          year.value = "";
        }
        applyFilter();
      });
    }
  }

  var searchRoot = document.querySelector("[data-search-root]");
  if (searchRoot && window.moviesSearch) {
    var form = searchRoot.querySelector("[data-search-form]");
    var input = searchRoot.querySelector("[data-search-input]");
    var results = searchRoot.querySelector("[data-search-results]");
    var params = new URLSearchParams(window.location.search);
    if (input && params.get("q")) {
      input.value = params.get("q");
    }
    var cardTemplate = function (item) {
      return '<a class="movie-card" href="' + escapeHtml(item.url) + '">' +
        '<span class="poster"><span class="poster-badge">' + escapeHtml(item.year) + '</span><img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy"></span>' +
        '<span class="card-body"><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.oneLine) + '</p>' +
        '<span class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></span></span>' +
        '</a>';
    };
    var render = function () {
      var q = input && input.value ? input.value.trim().toLowerCase() : "";
      var list = window.moviesSearch.filter(function (item) {
        var haystack = [item.title, item.region, item.type, item.year, item.genre, item.tags, item.oneLine].join(" ").toLowerCase();
        return !q || haystack.indexOf(q) !== -1;
      }).slice(0, 120);
      if (results) {
        if (list.length === 0) {
          results.innerHTML = '<div class="search-results-empty">没有找到匹配内容，请更换关键词。</div>';
        } else {
          results.innerHTML = list.map(cardTemplate).join("");
        }
      }
    };
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var next = input && input.value ? input.value.trim() : "";
        var url = next ? "search.html?q=" + encodeURIComponent(next) : "search.html";
        window.history.replaceState({}, "", url);
        render();
      });
    }
    render();
  }
})();
