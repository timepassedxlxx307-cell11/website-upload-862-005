(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  var toggle = document.querySelector('[data-mobile-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  selectAll('[data-hero]').forEach(function (hero) {
    var slides = selectAll('.hero-slide', hero);
    var dots = selectAll('.hero-dot', hero);
    var current = 0;

    function activate(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activate(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        activate((current + 1) % slides.length);
      }, 5600);
    }
  });

  selectAll('[data-filter-panel]').forEach(function (panelElement) {
    var scopeId = panelElement.getAttribute('data-filter-panel');
    var cards = selectAll('[data-filter-scope="' + scopeId + '"] .movie-card');
    var keyword = panelElement.querySelector('[data-filter-keyword]');
    var category = panelElement.querySelector('[data-filter-category]');
    var type = panelElement.querySelector('[data-filter-type]');
    var year = panelElement.querySelector('[data-filter-year]');
    var empty = document.querySelector('[data-empty-for="' + scopeId + '"]');

    function applyFilters() {
      var q = normalize(keyword && keyword.value);
      var cat = normalize(category && category.value);
      var typeValue = normalize(type && type.value);
      var yearValue = normalize(year && year.value);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.textContent);
        var matchKeyword = !q || text.indexOf(q) !== -1;
        var matchCategory = !cat || normalize(card.getAttribute('data-category')) === cat;
        var matchType = !typeValue || normalize(card.getAttribute('data-type')) === typeValue;
        var matchYear = !yearValue || normalize(card.getAttribute('data-year')) === yearValue;
        var isVisible = matchKeyword && matchCategory && matchType && matchYear;

        card.style.display = isVisible ? '' : 'none';
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visibleCount === 0);
      }
    }

    [keyword, category, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  });
})();
