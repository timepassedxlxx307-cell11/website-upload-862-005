(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function activateHero() {
        const hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        const slides = selectAll('.hero-slide', hero);
        const thumbs = selectAll('.hero-thumb', hero);
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let index = 0;
        let timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            thumbs.forEach(function (thumb, i) {
                thumb.classList.toggle('active', i === index);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        thumbs.forEach(function (thumb, i) {
            thumb.addEventListener('click', function () {
                show(i);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    function activateNavigation() {
        const toggle = document.querySelector('.mobile-toggle');
        const menu = document.querySelector('.mobile-menu');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    function activateHeaderSearch() {
        selectAll('[data-main-search]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                const input = form.querySelector('input[name="q"]');
                const query = input ? input.value.trim() : '';
                const target = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
                window.location.href = target;
            });
        });
    }

    function activateFilters() {
        const panel = document.querySelector('[data-filter-panel]');
        const grid = document.querySelector('[data-searchable-grid]');
        if (!panel || !grid) {
            return;
        }
        const cards = selectAll('.movie-card', grid);
        const input = panel.querySelector('[data-filter-keyword]');
        const region = panel.querySelector('[data-filter-region]');
        const type = panel.querySelector('[data-filter-type]');
        const year = panel.querySelector('[data-filter-year]');
        const reset = panel.querySelector('[data-filter-reset]');
        const empty = document.querySelector('[data-empty-state]');
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');

        if (q && input) {
            input.value = q;
        }

        function match(card) {
            const keyword = input ? input.value.trim().toLowerCase() : '';
            const regionValue = region ? region.value : '';
            const typeValue = type ? type.value : '';
            const yearValue = year ? year.value : '';
            const blob = [
                card.dataset.title,
                card.dataset.region,
                card.dataset.type,
                card.dataset.year,
                card.dataset.tags
            ].join(' ').toLowerCase();
            if (keyword && blob.indexOf(keyword) === -1) {
                return false;
            }
            if (regionValue && card.dataset.region !== regionValue) {
                return false;
            }
            if (typeValue && card.dataset.type !== typeValue) {
                return false;
            }
            if (yearValue && card.dataset.year !== yearValue) {
                return false;
            }
            return true;
        }

        function apply() {
            let shown = 0;
            cards.forEach(function (card) {
                const ok = match(card);
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    shown += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('show', shown === 0);
            }
        }

        [input, region, type, year].forEach(function (item) {
            if (item) {
                item.addEventListener('input', apply);
                item.addEventListener('change', apply);
            }
        });

        if (reset) {
            reset.addEventListener('click', function () {
                if (input) {
                    input.value = '';
                }
                if (region) {
                    region.value = '';
                }
                if (type) {
                    type.value = '';
                }
                if (year) {
                    year.value = '';
                }
                apply();
            });
        }

        apply();
    }

    window.setupMoviePlayer = function (source) {
        function run() {
            const video = document.getElementById('videoPlayer');
            const overlay = document.getElementById('playerOverlay');
            let hls = null;
            let ready = false;

            if (!video || !overlay || !source) {
                return;
            }

            function attach() {
                if (ready) {
                    return;
                }
                ready = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                } else {
                    video.src = source;
                }
            }

            function play() {
                attach();
                overlay.classList.add('hidden');
                const result = video.play();
                if (result && typeof result.catch === 'function') {
                    result.catch(function () {
                        overlay.classList.remove('hidden');
                    });
                }
            }

            overlay.addEventListener('click', play);
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                overlay.classList.add('hidden');
            });
            video.addEventListener('pause', function () {
                if (!video.ended) {
                    overlay.classList.remove('hidden');
                }
            });
            video.addEventListener('ended', function () {
                overlay.classList.remove('hidden');
            });
            window.addEventListener('beforeunload', function () {
                if (hls) {
                    hls.destroy();
                }
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
        } else {
            run();
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        activateNavigation();
        activateHero();
        activateHeaderSearch();
        activateFilters();
    });
})();
