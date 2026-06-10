(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    function setupMenu() {
        var button = document.querySelector(".menu-button");
        var menu = document.querySelector(".mobile-nav");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            var open = menu.classList.toggle("is-open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (!slides.length || !dots.length) {
            return;
        }
        var current = 0;
        var timer = null;
        function activate(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }
        function next() {
            activate((current + 1) % slides.length);
        }
        function start() {
            timer = window.setInterval(next, 5200);
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                activate(index);
                start();
            });
        });
        start();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function filterCards(keyword, category) {
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var key = normalize(keyword);
        var cat = normalize(category || "all");
        cards.forEach(function (card) {
            var text = normalize(card.getAttribute("data-search"));
            var cardCategory = normalize(card.getAttribute("data-category"));
            var keywordMatch = !key || text.indexOf(key) !== -1;
            var categoryMatch = cat === "all" || cardCategory === cat;
            card.classList.toggle("is-hidden-card", !(keywordMatch && categoryMatch));
        });
    }

    function setupFilterInputs() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll(".filter-input"));
        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                filterCards(input.value, "all");
            });
        });
    }

    function setupSearchPage() {
        var input = document.querySelector(".search-page-input");
        var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
        if (!input) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var currentCategory = "all";
        input.value = params.get("q") || "";
        filterCards(input.value, currentCategory);
        input.addEventListener("input", function () {
            filterCards(input.value, currentCategory);
        });
        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("is-active");
                });
                chip.classList.add("is-active");
                currentCategory = chip.getAttribute("data-category-filter") || "all";
                filterCards(input.value, currentCategory);
            });
        });
    }

    function setupHeaderSearch() {
        var forms = Array.prototype.slice.call(document.querySelectorAll(".site-search"));
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                var value = input ? input.value.trim() : "";
                if (!value) {
                    event.preventDefault();
                    window.location.href = "search.html";
                }
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilterInputs();
        setupSearchPage();
        setupHeaderSearch();
    });
}());
