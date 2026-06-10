(function () {
    var formInput = document.querySelector('[data-search-input]');
    var grid = document.querySelector('[data-search-results]');
    var title = document.querySelector('[data-search-title]');
    var empty = document.querySelector('[data-search-empty]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    var items = Array.isArray(window.SearchItems) ? window.SearchItems : [];

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function createCard(item) {
        var article = document.createElement('article');
        article.className = 'movie-card';

        var cover = document.createElement('a');
        cover.className = 'card-cover';
        cover.href = item.url;

        var image = document.createElement('img');
        image.src = item.cover;
        image.alt = item.title;
        image.loading = 'lazy';
        cover.appendChild(image);

        var badge = document.createElement('span');
        badge.className = 'card-badge';
        badge.textContent = item.year;
        cover.appendChild(badge);

        var body = document.createElement('div');
        body.className = 'card-body';

        var meta = document.createElement('div');
        meta.className = 'card-meta';
        item.meta.forEach(function (value) {
            var span = document.createElement('span');
            span.textContent = value;
            meta.appendChild(span);
        });

        var heading = document.createElement('h2');
        heading.className = 'card-title';
        var link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.title;
        heading.appendChild(link);

        var text = document.createElement('p');
        text.className = 'card-text';
        text.textContent = item.text;

        var tags = document.createElement('div');
        tags.className = 'card-tags';
        item.tags.slice(0, 3).forEach(function (value) {
            var span = document.createElement('span');
            span.textContent = value;
            tags.appendChild(span);
        });

        body.appendChild(meta);
        body.appendChild(heading);
        body.appendChild(text);
        body.appendChild(tags);
        article.appendChild(cover);
        article.appendChild(body);
        return article;
    }

    function render(query) {
        if (!grid) {
            return;
        }

        var value = normalize(query);
        var results = items.filter(function (item) {
            if (!value) {
                return true;
            }
            return normalize(item.search).indexOf(value) !== -1;
        }).slice(0, 120);

        grid.innerHTML = '';
        results.forEach(function (item) {
            grid.appendChild(createCard(item));
        });

        if (title) {
            title.textContent = value ? '搜索结果' : '推荐影片';
        }
        if (empty) {
            empty.hidden = results.length !== 0;
        }
    }

    if (formInput) {
        formInput.value = initialQuery;
        formInput.addEventListener('input', function () {
            render(formInput.value);
        });
    }

    render(initialQuery);
})();
