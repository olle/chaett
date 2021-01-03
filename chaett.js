(function (window) {
    const NAME = "Chaett";
    const PREFIX = "cht";

    const STORAGE_KEY_THEME = "theme";

    const DARK_THEME = "dark";
    const LIGHT_THEME = "light";

    const CLASS_CONTAINER = `${PREFIX}-container`;
    const CLASS_DARK_THEME = `${PREFIX}--${DARK_THEME}-theme`;
    const CLASS_LIGHT_THEME = `${PREFIX}--${LIGHT_THEME}-theme`;

    const SELECTOR_CONTAINER = `.${CLASS_CONTAINER}`;

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

    var el = {
        init: () => {
            if (!$container) {
                $container = window.document.createElement("aside");
                $container.classList.add(`${PREFIX}-container`);
                $body.appendChild($container);
            }
        },
    };

    var theme = {
        init: () => {
            var storedTheme = store.get(STORAGE_KEY_THEME);
            if (storedTheme) {
                theme.set(storedTheme);
            } else {
                var preferredTheme = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches
                    ? DARK_THEME
                    : LIGHT_THEME;
                theme.set(preferredTheme);
            }
            window
                .matchMedia("(prefers-color-scheme: dark)")
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
        el.init();
        theme.init();
    }, 42);

    window[NAME] = window[NAME] || {
        store: store,
        theme: theme,
    };
})(window);
