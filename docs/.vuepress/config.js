module.exports = {
  title: 'ZenTS - Node.js & TypeScript MVC-Framework for building rich web applications',
  description:
    'ZenTS is a Node.js & TypeScript MVC-Framework for building rich web applications, released as free and open-source software under the MIT License. It is designed for building web applications with modern tools and design patterns.',
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { name: 'theme-color', content: '#512DA8' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '57x57',
        href: '/favicon/apple-icon-57x57.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '60x60',
        href: '/favicon/apple-icon-60x60.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '72x72',
        href: '/favicon/apple-icon-72x72.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '76x76',
        href: '/favicon/apple-icon-76x76.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '114x114',
        href: '/favicon/apple-icon-114x114.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '120x120',
        href: '/favicon/apple-icon-120x120.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '144x144',
        href: '/favicon/apple-icon-144x144.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '152x152',
        href: '/favicon/apple-icon-152x152.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '180x180',
        href: '/apple-icon-180x180.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        size: '192x192',
        href: '/android-icon-192x192.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        size: '32x32',
        href: '/favicon/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        size: '96x96',
        href: '/favicon/favicon-96x96.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        size: '16x16',
        href: '/favicon/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Muli:wght@300;400;500;600;700;800&family=Raleway:wght@400;500;600;700;800;900&display=swap',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css',
      },
    ],
    [
      'script',
      {},
      `                
        window.addEventListener('load', function () {
          var inputSelector = '.search-box > input';
          var $el = document.querySelector(inputSelector);

          if($el) {          
            $el.disabled = true;
            $el.placeholder = 'Loading...';
  
            var script = document.createElement("script");
            script.addEventListener("load", function() {
              docsearch({
                apiKey: '1c03de24a87faf1bfd8b7e760c63b3ab',
                indexName: 'zents',
                inputSelector: inputSelector,
              });
              $el.disabled = false;
              $el.placeholder = 'Search...';
            });
  
            script.src = "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js";
  
            document.body.appendChild(script);            
          }
        });
      `,
    ],
  ],
  plugins: [
    '@vuepress/back-to-top',
    'reading-progress',
    'vuepress-plugin-reading-time',
    'vuepress-plugin-element-tabs',
    [
      '@goy/svg-icons',
      {
        svgsDir: './.vuepress/public/icons/',
      },
    ],
    [
      'vuepress-plugin-code-copy',
      {
        color: '#7E57C2',
      },
    ],
    [
      'minimal-analytics',
      {
        ga: 'UA-161938495-2',
      },
    ],
  ],
  markdown: {
    lineNumbers: true,
    toc: {
      includeLevel: [2, 3, 4],
    },
  },
  theme: 'default-prefers-color-scheme',
  themeConfig: {
    // defaultTheme: 'light',
    logo: '/zents_logo_icon.png',
    repo: 'sahachide/ZenTS',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',
    smoothScroll: false,
    sidebarDepth: 3,

    // algolia: {
    //   apiKey: '1c03de24a87faf1bfd8b7e760c63b3ab',
    //   indexName: 'zents',
    // },
    nav: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'Configuration',
        link: '/configuration',
      },
      {
        text: 'API Reference',
        link: '/api/',
      },
      {
        text: 'CLI',
        link: '/cli',
      },
      {
        text: 'Roadmap',
        link: '/roadmap',
      },
    ],
    sidebar: {
      '/api/': [
        {
          title: 'API Reference',
          collapsable: false,
          children: ['/api/'],
        },
      ],
      '/': [
        {
          title: 'Getting started',
          collapsable: false,
          children: ['/guide/gettingstarted/installation', '/guide/gettingstarted/helloworld'],
        },
        {
          title: 'Advanced Guides',
          collapsable: false,
          children: [
            '/guide/advancedguides/controllers',
            '/guide/advancedguides/request',
            '/guide/advancedguides/response',
            '/guide/advancedguides/routing',
            '/guide/advancedguides/database',
            '/guide/advancedguides/redis',
            '/guide/advancedguides/user_management',
            '/guide/advancedguides/templates',
            '/guide/advancedguides/static_files',
            '/guide/advancedguides/services',
            '/guide/advancedguides/dependency_injection',
            '/guide/advancedguides/emails',
          ],
        },
        '/configuration',
        '/cli',
        '/roadmap',
      ],
    },
  },
}
