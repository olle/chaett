import './chaett.css'

(function (window) {
    const NAME = "Chaett";

    const pfx = str => `cht${str}`;

    const CONTAINER_MIN_WIDTH = 256; /* px */
    const STORAGE_KEY_THEME = "theme";

    const THEME_DARK = "dark";
    const THEME_LIGHT = "light";

    const CLASS_CONTAINER = pfx("-container");
    const CLASS_THEME_DARK = pfx(`--${THEME_DARK}-theme`);
    const CLASS_THEME_LIGHT = pfx(`--${THEME_LIGHT}-theme`);
    const CLASS_TOGGLE = pfx("-toggle");
    const CLASS_RESIZE = pfx("-resize");
    const CLASS_MAXIMIZE = pfx("-maximize");
    const CLASS_MINIMIZE = pfx("-minimize");
    const CLASS_WINDOW = pfx("-window");
    const CLASS_HEADER = pfx("-header");
    const CLASS_CONTENT = pfx("-content");
    const CLASS_FOOTER = pfx("-footer");

    const SELECTOR_CONTAINER = `.${CLASS_CONTAINER}`;
    const SELECTOR_TOGGLE = `.${CLASS_TOGGLE}`;
    const SELECTOR_RESIZE = `.${CLASS_RESIZE}`;
    const SELECTOR_MINIMIZE = `.${CLASS_MINIMIZE}`;
    const SELECTOR_MAXIMIZE = `.${CLASS_MAXIMIZE}`;

    const MEDIA_QUERY_THEME_DARK = "(prefers-color-scheme: dark)";

    const MOUSE_DOWN_EVT = "mousedown";
    const MOUSE_MOVE_EVT = "mousemove";
    const MOUSE_UP_EVT = "mouseup";

    const ICON_TOGGLE = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-messages" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
<path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
</svg>`;

    const ICON_MINIMIZE = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-minimize" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M15 19v-2a2 2 0 0 1 2 -2h2" />
<path d="M15 5v2a2 2 0 0 0 2 2h2" />
<path d="M5 15h2a2 2 0 0 1 2 2v2" />
<path d="M5 9h2a2 2 0 0 0 2 -2v-2" />
</svg>`;

    const ICON_MAXIMIZE = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-maximize" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
<path d="M4 16v2a2 2 0 0 0 2 2h2" />
<path d="M16 4h2a2 2 0 0 1 2 2v2" />
<path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
</svg>`;

    const $body = window.document.querySelector("body");

    var $container = $body.querySelector(SELECTOR_CONTAINER);

    var store = {
        get: key => {
            return window.localStorage.getItem(pfx(key));
        },
        set: (key, value) => {
            window.localStorage.setItem(pfx(key), value);
        },
    };

    var view = {
        init: () => {
            view.initContainer();
            //view.initToggle($container.querySelector(SELECTOR_TOGGLE));
            view.initResize($container.querySelector(SELECTOR_RESIZE));
            view.initMinimize($container.querySelector(SELECTOR_MINIMIZE));
            view.initMaximize($container.querySelector(SELECTOR_MAXIMIZE));
        },
        initContainer: () => {
            if (!$container) {
                $container = window.document.createElement("aside");
                $container.classList.add(CLASS_CONTAINER);
                $body.appendChild($container);
            }

            $container.innerHTML = `
<button class="${CLASS_TOGGLE}">${ICON_TOGGLE}</button>
<button class="${CLASS_MAXIMIZE}">${ICON_MAXIMIZE}</button>
<div class="${CLASS_RESIZE}"></div>
<article class="${CLASS_WINDOW}">
    <header class="${CLASS_HEADER}">
        <button class="${CLASS_MINIMIZE}">${ICON_MINIMIZE}</button>
    </header>
    <section class="${CLASS_CONTENT}">content</section>
    <footer class="${CLASS_FOOTER}">footer</footer>
</article>`;
        },
        initToggle: $el => {
            $el.addEventListener("click", evt => {
                console.log("Toggling");
            });
        },
        initResize: $el => {
            $el.addEventListener(MOUSE_DOWN_EVT, evt => {
                evt.stopImmediatePropagation();
                evt.preventDefault();
                const originX = evt.clientX;
                const originWidth = $container.clientWidth;
                const onResize = evt => {
                    var delta = originX - evt.clientX;
                    var newWidth = Math.max(originWidth + delta, CONTAINER_MIN_WIDTH);
                    $container.style.width = `${newWidth}px`;
                };
                const onFinished = () => {
                    window.removeEventListener(MOUSE_MOVE_EVT, onResize);
                    window.removeEventListener(MOUSE_UP_EVT, onFinished);
                };
                window.addEventListener(MOUSE_MOVE_EVT, onResize);
                window.addEventListener(MOUSE_UP_EVT, onFinished);
            });
        },
        initMinimize: $el => {
            $el.addEventListener("click", evt => {
                console.log("Min!");
            });
        },
        initMaximize: $el => {
            $el.addEventListener("click", evt => {
                console.log("max!");
            });
        },
    };

    var theme = {
        init: () => {
            var storedTheme = store.get(STORAGE_KEY_THEME);
            if (storedTheme) {
                theme.set(storedTheme);
            } else {
                var preferredTheme = window.matchMedia(MEDIA_QUERY_THEME_DARK).matches ? THEME_DARK : THEME_LIGHT;
                theme.set(preferredTheme);
            }
            window.matchMedia(MEDIA_QUERY_THEME_DARK).addEventListener("change", evt => {
                var switchedTheme = evt.matches ? THEME_DARK : THEME_LIGHT;
                theme.set(switchedTheme);
            });
        },
        set: theme => {
            if (theme === THEME_DARK) {
                $container.classList.remove(CLASS_THEME_LIGHT);
                $container.classList.add(CLASS_THEME_DARK);
            } else if (theme === THEME_LIGHT) {
                $container.classList.remove(CLASS_THEME_DARK);
                $container.classList.add(CLASS_THEME_LIGHT);
            }
        },
    };

    const DEBOUNCE_TIMEOUT = 98;
    var DEBOUNCE = false;

    const events = {
        init: () => {},
        pub: (evt, props) => {
            if (DEBOUNCE) {
                clearTimeout(DEBOUNCE);
            }
            DEBOUNCE = setTimeout(() => {
                var event = new CustomEvent(evt, { detail: props });
                $container.dispatchEvent(event);
            }, DEBOUNCE_TIMEOUT);
        },
        sub: (evt, handler) => {
            $container.addEventListener(evt, ev => {
                handler({ event: ev.type, ...ev.detail }, ev);
            });
        },
    };

    setTimeout(() => {
        view.init();
        theme.init();
        events.init();
    }, 42);

    window[NAME] = window[NAME] || {
        store: store,
        theme: theme,
    };
})(window);
