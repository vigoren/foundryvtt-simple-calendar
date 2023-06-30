// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Simple Calendar',
  tagline: 'Your Calendar, Your Way',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://simplecalendar.info/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          includeCurrentVersion: false
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    [
      'docusaurus-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        entryPoints: ['../types/index.d.ts'],
        out: 'developing-with-sc/api',
        tsconfig: '../tsconfig.json',
        media: "./static/img",
        frontmatter: {
          pagination_next: null,
          pagination_prev: null
        },
        sidebar: {
          //fullNames: true
        }
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html', 'htm'],
        redirects: [
          { to: '/docs/faq', from: ['/pages/site/docs/faq', '/pages/site/docs/faq.html'] },
          { to: '/docs/changelog', from: ['/pages/site/CHANGELOG', '/pages/site/CHANGELOG.html'] },
          //Using SC
          {to: '/docs/using-sc/changing-date-time', from: ['/pages/docs/using-sc/index/changing-date-time', '/pages/docs/using-sc/index/changing-date-time.html'] },
          {to: '/docs/using-sc/switching-calendars', from: ['/pages/docs/using-sc/index/switching-calendars', '/pages/docs/using-sc/index/switching-calendars.html'] },
          {to: '/docs/using-sc/themes', from: ['/pages/docs/using-sc/index/themes', '/pages/docs/using-sc/index/themes.html'] },
          {to: '/docs/using-sc/notes/', from: ['/pages/docs/using-sc/index/notes', '/pages/docs/using-sc/index/notes.html'] },
          {to: '/docs/using-sc/notes/adding', from: ['/pages/docs/using-sc/index/notes/index/adding-editing-removing', '/pages/docs/using-sc/index/notes/index/adding-editing-removing.html']},
          //Developing with SC
          {to: '/docs/developing-with-sc/', from: ['/pages/docs/developing-with-sc', '/pages/docs/developing-with-sc.html']},
          {to: '/docs/developing-with-sc/theming', from: ['/pages/docs/developing-with-sc/index/theming', '/pages/docs/developing-with-sc/index/theming.html']},
          //API Docs
          {to: '/docs/developing-with-sc/api/namespaces/SimpleCalendar', from: ['/modules/SimpleCalendar', '/modules/SimpleCalendar.html']},
        ],
        createRedirects(path) {
          // Global Config
          if(path.includes('/docs/global-configuration')){
            return [
                path.replace('/docs/global-configuration', '/pages/global-configuration/index'),
                path.replace('/docs/global-configuration', '/pages/global-configuration/index') + '.html'
            ];
          }
          // Calendar Config
          if(path.includes('/docs/calendar-configuration')){
            return [
              path.replace('/docs/calendar-configuration', '/pages/calendar-configuration/index'),
              path.replace('/docs/calendar-configuration', '/pages/calendar-configuration/index') + '.html'
            ];
          }
          return undefined;
        }
      }
    ]
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logo.svg',
      navbar: {
        title: 'Simple Calendar',
        logo: {
          alt: 'Simple Calendar Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'configSidebar',
            position: 'left',
            label: 'Configuration',
          },
          {
            type: 'docSidebar',
            sidebarId: 'usingSidebar',
            position: 'left',
            label: 'How to Use',
          },
          {
            type: 'doc',
            docId: 'faq',
            label: 'FAQ',
            position: 'left'
          },
          {
            type: 'docSidebar',
            sidebarId: 'devSidebar',
            position: 'left',
            label: 'Developing With',
          },
          {
            type: 'doc',
            docId: 'changelog',
            label: 'Changelog',
            position: 'left'
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
          },
          {
            href: 'https://github.com/vigoren/foundryvtt-simple-calendar',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository'
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'More',
            items: [
              {
                label: 'How To Install',
                to: 'docs/installing'
              },
              {
                label: 'Translations',
                to: 'docs/translations'
              },
              {
                label: 'License',
                href: 'https://github.com/vigoren/foundryvtt-simple-calendar/blob/main/LICENSE',
              },
              {
                label: 'Contributing',
                href: 'https://github.com/vigoren/foundryvtt-simple-calendar/blob/main/CONTRIBUTING.md'
              }
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'FoundryVTT Discord server',
                href: 'https://discord.gg/foundryvtt',
              },
              {
                label: 'Foundry Hub',
                href: 'https://www.foundryvtt-hub.com/package/foundryvtt-simple-calendar/'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/vigoren/foundryvtt-simple-calendar',
              },
              {
                label: 'Foundry Hub - Weblate',
                href: 'https://weblate.foundryvtt-hub.com/projects/simple-calendar/'
              }
            ],
          },
          {
            title: 'Support',
            items: [
              {
                html: '<p class="footer-text">Simple Calendar is free to use by anyone! Below are options for those who want to donate to the development or support the developer.</p>'
              },
              {
                label: 'Patreon',
                href: 'https://www.patreon.com/vigorator',
              },
              {
                label: 'Ko-fi',
                href: 'https://ko-fi.com/vigorator',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Simple Calendar. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
