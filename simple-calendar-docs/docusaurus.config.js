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
          //includeCurrentVersion: false
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
        copyright: `Copyright © ${new Date().getFullYear()} Simple Calendar`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
