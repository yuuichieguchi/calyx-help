import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://help.calyx.app',
  integrations: [
    starlight({
      title: 'Calyx Help',
      logo: { src: './src/assets/logo.svg', replacesTitle: false },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/yuuichieguchi/Calyx' },
      ],
      defaultLocale: 'root',
      locales: {
        root: { label: '日本語', lang: 'ja' },
        en: { label: 'English', lang: 'en' },
      },
      sidebar: [
        {
          label: 'はじめに',
          translations: { en: 'Getting Started' },
          items: [{ autogenerate: { directory: 'getting-started' } }],
        },
        {
          label: '使い方',
          translations: { en: 'Usage' },
          items: [{ autogenerate: { directory: 'usage' } }],
        },
        {
          label: 'リファレンス',
          translations: { en: 'Reference' },
          items: [{ autogenerate: { directory: 'reference' } }],
        },
        {
          label: '規約・ポリシー',
          translations: { en: 'Terms & Policies' },
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
