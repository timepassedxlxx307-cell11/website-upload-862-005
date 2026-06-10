(function () {
    var header = document.querySelector('[data-site-header]');
    var navToggle = document.querySelector('[data-nav-toggle]');
    var siteNav = document.querySelector('[data-site-nav]');

    function updateHeader() {
        if (!header) {
            return;
        }
        header.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            siteNav.classList.toggle('is-open');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]')).forEach(function (root) {
        var input = root.querySelector('[data-local-search]');
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-filter-card]'));
        var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-filter-value]'));
        var empty = root.querySelector('[data-empty]');
        var currentFilter = '全部';

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilter() {
            var query = normalize(input ? input.value : '');
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-category')
                ].join(' '));
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchChip = currentFilter === '全部' || text.indexOf(normalize(currentFilter)) !== -1;
                var show = matchQuery && matchChip;
                card.hidden = !show;
                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                currentFilter = button.getAttribute('data-filter-value') || '全部';
                buttons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                applyFilter();
            });
        });
    });
})();
