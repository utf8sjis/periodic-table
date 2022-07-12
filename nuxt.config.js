const gtagScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-GBVV8SS85F');
`

const twitterSnippet = `
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));
`

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '元素の漢字周期表 - gensokanji',
    htmlAttrs: { lang: 'ja', prefix: 'og: http://ogp.me/ns#' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'description',
        name: 'description',
        content:
          '元素の漢字周期表は、中国語での元素名を並べた漢字の元素周期表です。中国語圏では、化学元素の命名は漢字1字でなされ、部首で気体か金属かなどの性質を表します。そんな漢字だけでできた周期表を当サイトでお楽しみください。',
      },
      // OGP
      {
        property: 'og:url',
        content: 'https://gensokanji.netlify.app/periodic-table',
      },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: '元素の漢字周期表 - gensokanji' },
      {
        property: 'og:description',
        content:
          '元素の漢字周期表は、中国語での元素名を並べた漢字の元素周期表です。そんな漢字だけでできた周期表を当サイトでお楽しみください。',
      },
      {
        property: 'og:image',
        content:
          'https://gensokanji.netlify.app/periodic-table/assets/img/periodic_table.png',
      },
      { property: 'og:site_name', content: 'gensokanji' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@gensokanji_bot' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'canonical',
        href: 'https://gensokanji.netlify.app/periodic-table',
      },
      // micron.js
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://unpkg.com/webkul-micron@1.1.6/dist/css/micron.min.css',
      },
      // google fonts
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Blinker:wght@200;300&family=Ubuntu&family=M+PLUS+1p:wght@300;500&display=swap',
      },
      // material icons
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
      // fontawesome
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.11.0/css/all.css',
      },
    ],
    script: [
      // micron.js
      {
        type: 'text/javascript',
        src: 'https://unpkg.com/webkul-micron@1.1.6/dist/script/micron.min.js',
      },
      // <!-- Global site tag (gtag.js) - Google Analytics -->
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-GBVV8SS85F',
      },
      {
        hid: 'gtagScript',
        innerHTML: gtagScript,
      },
      // Twitter wedgets.js
      // https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
      {
        hid: 'twitterSnippet',
        innerHTML: twitterSnippet,
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      gtagScript: ['innerHTML'],
      twitterSnippet: ['innerHTML'],
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['destyle.css', '~/assets/scss/style.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [{ path: '~/components', pathPrefix: false }],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  vue: {
    config: {},
  },
}
