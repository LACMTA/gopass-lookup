function isMobile() {
    return window.innerWidth < 1024;
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        // includedLanguages: 'da,de,en,es,fr,hmn,hy,it,ja,km,ko,pt,ru,th,tl,vi,zh-CN,zh-TW',
        includedLanguages: 'en,es,zh-CN,zh-TW,ko,vi,ja,ru,hy',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        gaTrack: true,
        gaId: 'UA-10002990-1',
    }, 'google_translate_element');
}

//TRANSLATE
let gframe, navTranslate, interval, isOpen, lastResizeWasMobile;

function styleGT() {
    gframe = document.querySelector('.goog-te-menu-frame');
    let gframe_head = gframe.contentWindow.document.head;
    let style_node = document.createElement('style');
    style_node.setAttribute('type', 'text/css');

    let style_code = `
        .goog-te-menu2 {
            background-color: white;
            border: none;
            overflow: auto;
            /*max-height: 350px;*/
            padding:0;
        }
        table,tbody,tr,td{
            display: block;
        }
        .goog-te-menu2-item div,
        .goog-te-menu2-item:link div,
        .goog-te-menu2-item:visited div,
        .goog-te-menu2-item:active div,
        .goog-te-menu2-item-selected div,
        .goog-te-menu2-item-selected:link div,
        .goog-te-menu2-item-selected:visited div,
        .goog-te-menu2-item-selected:active div{
            background: transparent;
            letter-spacing: .35px;
            padding: 16px;
            font-family: 'Open Sans', sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 130%;
            color: #5E6871;
        }
        .goog-te-menu2-item-selected .text{
            font-family: 'Open Sans', sans-serif;
            font-weight: 600;
            font-style: normal;
            font-size: 16px;
            line-height: 130%;
            color: #5E6871;
        }
        .goog-te-menu2-item-selected .indicator{
            display:none;
        }
        .goog-te-menu2-item:hover div{
            color: #ECECEC;
            background: #555;
        }`;

    if (isMobile()) {
        style_code += `
        .goog-te-menu2 {
            width: 100% !important;
        }`;
    } else {
        style_code += `
        .goog-te-menu2 {
            width: 225px !important;
        }`;
    }

    style_node.innerHTML = style_code;
    gframe_head.appendChild(style_node);
}

function updateLanguageNames() {
    gframe = document.querySelector('.goog-te-menu-frame');

    let langItems = gframe.contentWindow.document.querySelectorAll('.goog-te-menu2-item,.goog-te-menu2-item-selected');

    for (var i = 0; i < langItems.length; i++) {
        switch (langItems[i].querySelector('.text').innerText) {
            case 'Spanish':
                langItems[i].querySelector('.text').innerText = 'Español (Spanish)';
                break;
            case 'Chinese (Simplified)':
                langItems[i].querySelector('.text').innerText = '中文 (Chinese Simplified)';
                break;
            case 'Chinese (Traditional)':
                langItems[i].querySelector('.text').innerText = '中文 (Chinese Traditional)';
                break;
            case 'Korean':
                langItems[i].querySelector('.text').innerText = '한국어 (Korean)';
                break;
            case 'Vietnamese':
                langItems[i].querySelector('.text').innerText = 'Tiếng Việt (Vietnamese)';
                break;
            case 'Japanese':
                langItems[i].querySelector('.text').innerText = '日本語 (Japanese)';
                break;
            case 'Russian':
                langItems[i].querySelector('.text').innerText = 'русский (Russian)';
                break;
            case 'Armenian':
                langItems[i].querySelector('.text').innerText = 'Армянский (Armenian)';
                break;
            case 'Select Language':
                // $(langItems[i]).hide();
                langItems[i].querySelector('.text').innerText = 'English';
                break;
        }
    }
}
function hideIframeOnClick() {
    setTimeout(function () {
        if (gframe) gframe.style.display = 'none';
        console.log("hidden");
    }, 100);
}

function resetInterval() {
    if (interval) clearInterval(interval);
    interval = setInterval(() => isOpen = isElemVisible(gframe), 500);
}

function isElemVisible(elem) {
    return !(elem.offsetWidth === 0 && elem.offsetHeight === 0);
}

function migrateTranslateOnResize() {
    let translate_element = document.querySelector('#google_translate_element');

    if (lastResizeWasMobile === isMobile()) {
        return;
    }
    console.log('.header-bar--' + (isMobile() ? 'mobile' : 'desktop') + ' .header-bar__translate-clickable');

    document.querySelector('.header-bar--' + (isMobile() ? 'mobile' : 'desktop') + ' .header-bar__translate-clickable').appendChild(translate_element);

    lastResizeWasMobile = isMobile();
}

window.onload = function () {
    gframe = document.querySelector('.goog-te-menu-frame');
    navTranslate = document.querySelector('.header-bar__translate');
    header = document.querySelector(".header");

    navTranslate.onclick = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();

        if (isOpen) {
            gframe.style.display = 'none';
            isOpen = false;
        } else {
            gframe.style.display = 'block';
            let navContainer = document.querySelector('.nav-container');
            let rect = navContainer.getBoundingClientRect();
            gframe.style.top = rect.bottom + 'px';
            isOpen = true;
        }
        resetInterval();
    };

    styleGT();
    resetInterval();

    setInterval(function () {
        if (isElemVisible(gframe) && !header.classList.contains('header--is-open-translate')) {
            header.classList.add('header--is-open-translate');
            header.classList.remove("header--is-open-search");
            header.classList.remove("header--is-open-menu");
        } else if (!isElemVisible(gframe) && header.classList.contains('header--is-open-translate')) {
            header.classList.remove('header--is-open-translate');
        }
    }, 1);

    setInterval(function () {
        updateLanguageNames();
        let elems = gframe.contentWindow.document.querySelectorAll('.goog-te-menu2-item,.goog-te-menu2-item-selected');

        elems.forEach(item => {
            item.removeEventListener('click', hideIframeOnClick);
            item.removeEventListener('touchstart', hideIframeOnClick);
        });

        elems.forEach(item => {
            item.addEventListener('click', hideIframeOnClick);
            item.addEventListener('touch', hideIframeOnClick);
        });
    }, 1000);
};

window.onclick = () => {
    if (gframe) gframe.style.display = 'none';
};

// window.onresize = () => {
//     migrateTranslateOnResize();
// };

// migrateTranslateOnResize();

