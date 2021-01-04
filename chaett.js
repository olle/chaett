(function (window) {
    const NAME = "Chaett";
    const PREFIX = "cht";

    const STORAGE_KEY_THEME = "theme";

    const DARK_THEME = "dark";
    const LIGHT_THEME = "light";

    const CLASS_CONTAINER = `${PREFIX}-container`;
    const CLASS_DARK_THEME = `${PREFIX}--${DARK_THEME}-theme`;
    const CLASS_LIGHT_THEME = `${PREFIX}--${LIGHT_THEME}-theme`;
    const CLASS_TOGGLE = `${PREFIX}-toggle`;
    const CLASS_RESIZE = `${PREFIX}-resize`;
    const CLASS_WIDE = `${PREFIX}--is-wide`;

    const SELECTOR_CONTAINER = `.${CLASS_CONTAINER}`;
    const SELECTOR_TOGGLE = `.${CLASS_TOGGLE}`;
    const SELECTOR_RESIZE = `.${CLASS_RESIZE}`;

    const MEDIA_QUERY_DARK_THEME = "(prefers-color-scheme: dark)";

    const ICON_TOGGLE = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-messages" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
<path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
</svg>`;

    const $body = window.document.querySelector("body");

    var $container = $body.querySelector(SELECTOR_CONTAINER);

    var store = {
        get: key => {
            return window.localStorage.getItem(`${PREFIX}-${key}`);
        },
        set: (key, value) => {
            window.localStorage.setItem(`${PREFIX}-${key}`, value);
        },
    };

    var view = {
        init: () => {
            if (!$container) {
                $container = window.document.createElement("aside");
                $container.classList.add(`${PREFIX}-container`);
                $body.appendChild($container);
            }

            $container.innerHTML = `
<button class="${CLASS_TOGGLE}">${ICON_TOGGLE}</button>
<div class="${CLASS_RESIZE}"></div>`;

            $toggle = $container.querySelector(SELECTOR_TOGGLE);
            // TODO: Handle toggle show/hide full-screen
            $resize = $container.querySelector(SELECTOR_RESIZE);
            // TODO: Handle resize panel width.
        },
    };

    var theme = {
        init: () => {
            var storedTheme = store.get(STORAGE_KEY_THEME);
            if (storedTheme) {
                theme.set(storedTheme);
            } else {
                var preferredTheme = window.matchMedia(MEDIA_QUERY_DARK_THEME)
                    .matches
                    ? DARK_THEME
                    : LIGHT_THEME;
                theme.set(preferredTheme);
            }
            window
                .matchMedia(MEDIA_QUERY_DARK_THEME)
                .addEventListener("change", evt => {
                    var switchedTheme = evt.matches ? DARK_THEME : LIGHT_THEME;
                    theme.set(switchedTheme);
                });
        },
        set: theme => {
            if (theme === DARK_THEME) {
                $container.classList.remove(CLASS_LIGHT_THEME);
                $container.classList.add(CLASS_DARK_THEME);
            } else if (theme === LIGHT_THEME) {
                $container.classList.remove(CLASS_DARK_THEME);
                $container.classList.add(CLASS_LIGHT_THEME);
            }
        },
    };

    setTimeout(() => {
        view.init();
        theme.init();
    }, 42);

    window[NAME] = window[NAME] || {
        store: store,
        theme: theme,
    };
})(window);
