import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://help.calyx.app',
  integrations: [
    starlight({
      title: 'Calyx Help',
      logo: { src: './src/assets/logo.png', replacesTitle: false },
      customCss: ['./src/styles/custom.css'],
      head: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
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
