(function () {
  const nav = document.querySelector('[data-site-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  const prev = document.querySelector('[data-hero-prev]');
  const next = document.querySelector('[data-hero-next]');
  let slideIndex = Math.max(0, slides.findIndex(function (slide) {
    return slide.classList.contains('is-active');
  }));

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    slideIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, current) {
      slide.classList.toggle('is-active', current === slideIndex);
    });

    dots.forEach(function (dot, current) {
      dot.classList.toggle('is-active', current === slideIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(slideIndex - 1);
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(slideIndex + 1);
    });
  }

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(slideIndex + 1);
    }, 5200);
  }

  const cards = Array.from(document.querySelectorAll('[data-filterable] .movie-card'));
  const searchInput = document.querySelector('[data-search-input]');
  const selects = Array.from(document.querySelectorAll('[data-filter]'));
  const emptyState = document.querySelector('[data-empty-state]');
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';

  if (searchInput && query) {
    searchInput.value = query;
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    const term = normalize(searchInput ? searchInput.value : query);
    const selected = {};

    selects.forEach(function (select) {
      selected[select.dataset.filter] = normalize(select.value);
    });

    let visible = 0;

    cards.forEach(function (card) {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.genre,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.tags
      ].join(' '));

      const matchedTerm = !term || haystack.indexOf(term) !== -1;
      const matchedType = !selected.type || normalize(card.dataset.type) === selected.type;
      const matchedRegion = !selected.region || normalize(card.dataset.region) === selected.region;
      const matchedGenre = !selected.genre || normalize(card.dataset.genre).indexOf(selected.genre) !== -1;
      const matchedYear = !selected.year || normalize(card.dataset.year) === selected.year;
      const matched = matchedTerm && matchedType && matchedRegion && matchedGenre && matchedYear;

      card.style.display = matched ? '' : 'none';

      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (cards.length) {
    applyFilters();
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  selects.forEach(function (select) {
    select.addEventListener('change', applyFilters);
  });
})();
