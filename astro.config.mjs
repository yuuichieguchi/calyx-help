import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://help.calyx.app',
  integrations: [
    starlight({
      title: 'Calyx Help',
      logo: { src: './src/assets/logo.png', replacesTitle: false },
      customCss: ['./src/styles/custom.css'],
      components: {
        SocialIcons: './src/components/HeaderNav.astro',
      },
      head: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500;700&display=swap' } },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/yuuichieguchi/Calyx' },
      ],
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        ja: { label: '日本語', lang: 'ja' },
      },
      sidebar: [
        {
          label: 'Getting Started',
          translations: { ja: 'はじめに' },
          items: [{ autogenerate: { directory: 'getting-started' } }],
        },
        {
          label: 'Usage',
          translations: { ja: '使い方' },
          items: [{ autogenerate: { directory: 'usage' } }],
        },
        {
          label: 'Reference',
          translations: { ja: 'リファレンス' },
          items: [{ autogenerate: { directory: 'reference' } }],
        },
        {
          label: 'Terms & Policies',
          translations: { ja: '規約・ポリシー' },
          items: [{ autogenerate: { directory: 'legal' } }],
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/yuuichieguchi/calyx-help/edit/main/',
      },
      lastUpdated: true,
    }),
  ],
});
