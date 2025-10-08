/* CONFIGURATION STARTS HERE */

/* Step 1: enter your domain name like fruitionsite.com */
const MY_DOMAIN = 'nickzhuang.com';

/*
  * Step 2: enter your URL slug to page ID mapping
  * The key on the left is the slug (without the slash)
  * The value on the right is the Notion page ID
  */
const SLUG_TO_PAGE = {
  '': '1ccd2b68726680d1887ae04ad476f98b',
  'about': '1ccd2b687266810f9dd2ff9758ed2c8e',
  'contact': '1ccd2b68726681898e7bf551ca471af1',
  'tags': '1ccd2b68726681c6b0b5ea3439f9e182',
  'category': '1ccd2b687266812da4f4f544abe8d2e9',
  'managers-path': '1ccd2b6872668040a17af9c34bfa4452',
  'genai-future': '1ccd2b687266811db0d5d916d64501b8',
  'career-review': '1ccd2b68726681b3aec9ff112d6234db',
  'category-ai': '1ccd2b68726681e5b15ceee94737bc00',
  'category-book': '1ccd2b68726680b9938cf2c0a6384cb4',
  'image-genai-guide': '1ccd2b68726680ba8cb7de202829d0ee',
  'my-career': '274d2b687266808da195e046d4c04ea1',
  'intro-dl-dli': '280d2b68726680c1931de96b4fbb6440'
};

/* Step 3: enter your page title and description for SEO purposes */
const PAGE_TITLE = 'AI異想封印：神經漫遊與模型的深層連結';
const PAGE_DESCRIPTION = '尼克的職場幻界 ( Neuron exploration and model of deep layer link )';

/* Step 4: enter a Google Font name, you can choose from https://fonts.google.com */
const GOOGLE_FONT = 'Noto Sans TC';

/* Step 5: enter any custom scripts you'd like */
const CUSTOM_SCRIPT = ``;

/* CONFIGURATION ENDS HERE */

const PAGE_TO_SLUG = {};
const slugs = [];
const pages = [];
Object.keys(SLUG_TO_PAGE).forEach(slug => {
  const page = SLUG_TO_PAGE[slug];
  slugs.push(slug);
  pages.push(page);
  PAGE_TO_SLUG[page] = slug;
});

addEventListener('fetch', event => {
  event.respondWith(fetchAndApply(event.request));
});

function normalizeSlug(slug) {
  if (!slug) return '';
  // 移除 query string 和 hash
  slug = slug.split('?')[0].split('#')[0];

  // decode URI component
  slug = decodeURIComponent(slug);

  // 移除前後多餘斜線
  slug = slug.trim().replace(/^\/+|\/+$/g, '');

  // 中文開頭或全為中文 → 強制加尾斜線
  const isChinese = /[\u4e00-\u9fa5]/.test(slug);
  if (isChinese && !slug.endsWith('/')) {
    slug += '/';
  }

  return slug;
}

const redirects = {
  '/關於我/': '/about',
  '/聯絡我/': '/contact',
  '/經理人之道-技術領袖航向成長與改變的參考指南/': '/managers-path',
  '/【生成式ai驅動未來變革：開源工具與技術架構的雙/': '/genai-future',
  '/category/career/review/': '/career-review',
  '/category/career/review': '/career-review',
  '/category/career/review/feed/': '/career-review',
  '/category/career/review/feed': '/career-review',
  '/category/ai/': '/category-ai',
  '/category/ai': '/category-ai',
  '/category/life-exploration/book/': '/category-book',
  '/category/life-exploration/book': '/category-book',
  '/圖像生成式ai的生存指南-以stable-diffusion為例/': '/image-genai-guide'
};

async function generateSitemap() {
  const baseUrl = 'https://' + MY_DOMAIN;
  const slugSet = new Set();

  // 1. SLUG_TO_PAGE 的 key 都視為有效網址
  for (const slug of Object.keys(SLUG_TO_PAGE)) {
    slugSet.add(normalizeSlug(slug));
  }

  // 2. redirects 的 from slug 也納入 sitemap（代表舊網址還要 index）
  // for (const [from] of Object.entries(redirects)) {
  //   slugSet.add(normalizeSlug(from));
  // }

  const urls = Array.from(slugSet).map((slug) => {
    const normalizedPath = slug.startsWith('/') ? slug.slice(1) : slug;
    return `
  <url>
    <loc>${baseUrl}/${normalizedPath}</loc>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n')}
</urlset>`;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function handleOptions(request) {
  if (request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        'Allow': 'GET, HEAD, POST, PUT, OPTIONS',
      }
    });
  }
}

// 統一使用的 UA
const DEFAULT_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";


async function fetchAndApply(request) {
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }
  let url = new URL(request.url);

  const ua = request.headers.get('user-agent') || '';
  // Googlebot fallback
  if (/googlebot/i.test(ua)) {
    return new Response(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8" />
  <title>關於我 - Nick Zhuang</title>
  <meta name="description" content="Nick Zhuang 的個人介紹與背景資訊。">
  <meta name="robots" content="index,follow" />
</head>
<body>
  <h1>關於我</h1>
  <p>這是 Nick Zhuang 的個人頁面，分享職涯、AI 技術與雲端平台經驗。</p>
  <p>更多內容請瀏覽 <a href="https://nickzhuang.com">nickzhuang.com</a></p>
</body>
</html>`, {
      headers: { 'content-type': 'text/html; charset=UTF-8', 'x-debug-worker': 'googlebot-fallback' }
    });
  }

  const decodedPath = decodeURIComponent(url.pathname);  // e.g. /聯絡我/
  const fullDomain = `https://${MY_DOMAIN}`;
  // --- Redirects 比對 ---
  if (redirects[decodedPath]) {
    return Response.redirect(`${fullDomain}${redirects[decodedPath]}`, 301);
  }

  url.hostname = 'www.notion.so';
  
  if (url.pathname === '/robots.txt') {
    return new Response('Sitemap: https://' + MY_DOMAIN + '/sitemap.xml');
  }
  if (url.pathname === '/sitemap.xml') {
    let response = new Response(await generateSitemap());
    response.headers.set('content-type', 'application/xml');
    return response;
  }
  let response;
  if (url.pathname.startsWith('/app') && url.pathname.endsWith('js')) {
    response = await fetch(url.toString());
    let body = await response.text();
    response = new Response(body.replace(/www.notion.so/g, MY_DOMAIN).replace(/notion.so/g, MY_DOMAIN), response);
    response.headers.set('Content-Type', 'application/x-javascript');
    return response;
  } else if ((url.pathname.startsWith('/api'))) {
    // Forward API
    response = await fetch(url.toString(), {
      body: url.pathname.startsWith('/api/v3/getPublicPageData') ? null : request.body,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'user-agent': DEFAULT_UA
      },
      method: 'POST',
    });
    response = new Response(response.body, response);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } else if (url.pathname.endsWith(".js")){
    response = await fetch(url.toString());
    let body = await response.text();
    response = new Response(
      body,
      response
    );
    response.headers.set("Content-Type", "application/x-javascript");
    return response;
  } else if (slugs.indexOf(url.pathname.slice(1)) > -1) {
    const pageId = SLUG_TO_PAGE[url.pathname.slice(1)];
    return Response.redirect('https://' + MY_DOMAIN + '/' + pageId, 301);
  } else {
    response = await fetch(url.toString(), {
      body: request.body,
      headers: request.headers,
      method: request.method,
    });
    response = new Response(response.body, response);
    response.headers.delete('Content-Security-Policy');
    response.headers.delete('X-Content-Security-Policy');
  }

  return appendJavascript(response, SLUG_TO_PAGE, url);
}

class MetaRewriter {
  element(element) {
    if (PAGE_TITLE !== '') {
      if (element.getAttribute('property') === 'og:title'
        || element.getAttribute('name') === 'twitter:title') {
        element.setAttribute('content', PAGE_TITLE);
      }
      if (element.tagName === 'title') {
        element.setInnerContent(PAGE_TITLE);
      }
    }
    if (PAGE_DESCRIPTION !== '') {
      if (element.getAttribute('name') === 'description'
        || element.getAttribute('property') === 'og:description'
        || element.getAttribute('name') === 'twitter:description') {
        element.setAttribute('content', PAGE_DESCRIPTION);
      }
    }
    if (element.getAttribute('property') === 'og:url'
      || element.getAttribute('name') === 'twitter:url') {
      element.setAttribute('content', MY_DOMAIN);
    }
    if (element.getAttribute('name') === 'apple-itunes-app') {
      element.remove();
    }
  }
}

class HeadRewriter {
  constructor(canonicalUrl) {
    this.canonicalUrl = canonicalUrl;
  }

  element(element) {
    // Canonical
    element.append(`<link rel="canonical" href="${this.canonicalUrl}">`, {
      html: true
    });

    if (GOOGLE_FONT !== '') {
      element.append(`<link href="https://fonts.googleapis.com/css?family=${GOOGLE_FONT.replace(' ', '+')}:Regular,Bold,Italic&display=swap" rel="stylesheet">
      <style>* { font-family: "${GOOGLE_FONT}" !important; }</style>`, {
        html: true
      });
    }

    element.append(`<style>
    div.notion-topbar > div > div:nth-child(3) { display: none !important; }
    div.notion-topbar > div > div:nth-child(4) { display: none !important; }
    div.notion-topbar > div > div:nth-child(5) { display: none !important; }
    div.notion-topbar > div > div:nth-child(6) { display: none !important; }
    div.notion-topbar > div > div:nth-child(7) { display: none !important; }
    div.notion-topbar-mobile > div:nth-child(3) { display: none !important; }
    div.notion-topbar-mobile > div:nth-child(4) { display: none !important; }
    div.notion-topbar > div > div:nth-child(1n).toggle-mode { display: block !important; }
    div.notion-topbar-mobile > div:nth-child(1n).toggle-mode { display: block !important; }
    </style>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KWRKSLG');</script>
    <!-- End Google Tag Manager -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-KMYVHL4B8D"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-KMYVHL4B8D');
    </script>`, {
      html: true
    })
  }
}

class BodyRewriter {
  constructor(SLUG_TO_PAGE) {
    this.SLUG_TO_PAGE = SLUG_TO_PAGE;
  }
  element(element) {
    element.append(`<div style="display:none">Powered by <a href="http://fruitionsite.com">Fruition</a></div>
    <script>
    window.CONFIG.domainBaseUrl = 'https://${MY_DOMAIN}';
    localStorage.__console = true;
    const SLUG_TO_PAGE = ${JSON.stringify(this.SLUG_TO_PAGE)};
    const PAGE_TO_SLUG = {};
    const slugs = [];
    const pages = [];
    const el = document.createElement('div');
    let redirected = false;
    Object.keys(SLUG_TO_PAGE).forEach(slug => {
      const page = SLUG_TO_PAGE[slug];
      slugs.push(slug);
      pages.push(page);
      PAGE_TO_SLUG[page] = slug;
    });
    function getPage() {
      return location.pathname.slice(-32);
    }
    function getSlug() {
      return location.pathname.slice(1);
    }
    function updateSlug() {
      const slug = PAGE_TO_SLUG[getPage()];
      if (slug != null) {
        history.replaceState(history.state, '', '/' + slug);
      }
    }
    function enableConsoleEffectAndSetMode(mode) {
      if (__console && !__console.isEnabled) {
        __console.enable()
        window.location.reload()
      } else {
        __console.environment.ThemeStore.setState({ mode: mode })
      }
    }
    function onDark() {
      el.innerHTML =
        '<div title="Change to Light Mode" style="margin-left: auto; margin-right: 14px; min-width: 0px;"><div role="button" tabindex="0" style="user-select: none; transition: background 120ms ease-in 0s; cursor: pointer; border-radius: 44px;"><div style="display: flex; flex-shrink: 0; height: 14px; width: 26px; border-radius: 44px; padding: 2px; box-sizing: content-box; background: rgb(46, 170, 220); transition: background 200ms ease 0s, box-shadow 200ms ease 0s;"><div style="width: 14px; height: 14px; border-radius: 44px; background: white; transition: transform 200ms ease-out 0s, background 200ms ease-out 0s; transform: translateX(12px) translateY(0px);"></div></div></div></div>'
      document.body.classList.add('dark')
      enableConsoleEffectAndSetMode('dark')
    }
    function onLight() {
      el.innerHTML =
        '<div title="Change to Dark Mode" style="margin-left: auto; margin-right: 14px; min-width: 0px;"><div role="button" tabindex="0" style="user-select: none; transition: background 120ms ease-in 0s; cursor: pointer; border-radius: 44px;"><div style="display: flex; flex-shrink: 0; height: 14px; width: 26px; border-radius: 44px; padding: 2px; box-sizing: content-box; background: rgba(135, 131, 120, 0.3); transition: background 200ms ease 0s, box-shadow 200ms ease 0s;"><div style="width: 14px; height: 14px; border-radius: 44px; background: white; transition: transform 200ms ease-out 0s, background 200ms ease-out 0s; transform: translateX(0px) translateY(0px);"></div></div></div></div>'
      document.body.classList.remove('dark')
      enableConsoleEffectAndSetMode('light')
    }
    function toggle() {
      if (!__console.isEnabled) __console.enable();
      if (document.body.classList.contains('dark')) {
        onLight();
      } else {
        onDark();
      }
    }
    function addDarkModeButton(device) {
      const nav = device === 'web' ? document.querySelector('.notion-topbar').firstChild : document.querySelector('.notion-topbar-mobile');
      el.className = 'toggle-mode';
      el.addEventListener('click', toggle);
      nav.appendChild(el);
      onLight();
    }
    const observer = new MutationObserver(function() {
      if (redirected) return;
      const nav = document.querySelector('.notion-topbar');
      const mobileNav = document.querySelector('.notion-topbar-mobile');
      if (nav && nav.firstChild && nav.firstChild.firstChild
        || mobileNav && mobileNav.firstChild) {
        redirected = true;
        updateSlug();
        addDarkModeButton(nav ? 'web' : 'mobile');
        const onpopstate = window.onpopstate;
        window.onpopstate = function() {
          if (slugs.includes(getSlug())) {
            const page = SLUG_TO_PAGE[getSlug()];
            if (page) {
              history.replaceState(history.state, 'bypass', '/' + page);
            }
          }
          onpopstate.apply(this, [].slice.call(arguments));
          updateSlug();
        };
      }
    });
    observer.observe(document.querySelector('#notion-app'), {
      childList: true,
      subtree: true,
    });
    const replaceState = window.history.replaceState;
    window.history.replaceState = function(state) {
      if (arguments[1] !== 'bypass' && slugs.includes(getSlug())) return;
      return replaceState.apply(window.history, arguments);
    };
    const pushState = window.history.pushState;
    window.history.pushState = function(state) {
      const dest = new URL(location.protocol + location.host + arguments[2]);
      const id = dest.pathname.slice(-32);
      if (pages.includes(id)) {
        arguments[2] = '/' + PAGE_TO_SLUG[id];
      }
      return pushState.apply(window.history, arguments);
    };
    const open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
      arguments[1] = arguments[1].replace('${MY_DOMAIN}', 'www.notion.so');
      return open.apply(this, [].slice.call(arguments));
    };
  </script>${CUSTOM_SCRIPT}`, {
      html: true
    });
  }
}

async function appendJavascript(res, SLUG_TO_PAGE, url) {
  // const url = new URL(res.url);
  const slug = url.pathname.replace(/\/$/, "");
  const canonicalUrl = `https://${MY_DOMAIN}${slug}`;

  // Debug log
  console.log("[Canonical]", canonicalUrl);

  // 正確複製回應並加上 debug header
  const newHeaders = new Headers(res.headers);
  newHeaders.set("x-debug-canonical", canonicalUrl);

  const responseWithHeader = new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });

  return new HTMLRewriter()
    .on('title', new MetaRewriter())
    .on('meta', new MetaRewriter())
    .on('head', new HeadRewriter(canonicalUrl))
    .on('body', new BodyRewriter(SLUG_TO_PAGE))
    .transform(responseWithHeader);
}
