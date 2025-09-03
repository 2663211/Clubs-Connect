// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Bit-by-Bit',
      logo: {
        light: './src/assets/logo_black.png',
        dark: './src/assets/logo_white.png',
        replacesTitle: true,
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/thetomaunatlala-777/Clubs-Connect',
        },
      ],
      customCss: ['./src/styles.css'],
      sidebar: [
        {
          label: 'Home',
          slug: 'index',
        },
        {
          label: 'Introduction',
          items: [
            { label: 'The Bit-by-Bit Team', slug: 'introduction/team' },
            { label: 'Project Overview', slug: 'introduction/clubs_connect' },
          ],
        },
        {
          label: 'Planning',
          items: [
            { label: 'Methodology', slug: 'planning/methodology' },
            //{ label: 'Project Overview', slug: 'introduction/clubs_connect' }
          ],
        },
        {
          label: 'Analysis',
          items: [
            { label: 'User Strories', slug: 'analysis/user_stories' },
            //{ label: 'Project Overview', slug: 'introduction/clubs_connect' }
          ],
        },
        {
          label: 'Design',
          items: [
            { label: 'The Bit-by-Bit Team', slug: 'introduction/team' },
            { label: 'Project Overview', slug: 'introduction/clubs_connect' },
          ],
        },
        {
          label: 'Development',
          items: [
            { label: 'SCRUM Ceremonies', slug: 'development/scrum_ceremonies' },
            { label: 'Project Overview', slug: 'introduction/clubs_connect' },
          ],
        },
        {
          label: 'Deployment',
          items: [
            { label: 'The Bit-by-Bit Team', slug: 'introduction/team' },
            { label: 'Project Overview', slug: 'introduction/clubs_connect' },
          ],
        },
        {
          label: 'Maintanance',
          items: [
            { label: 'The Bit-by-Bit Team', slug: 'introduction/team' },
            { label: 'Project Overview', slug: 'introduction/clubs_connect' },
          ],
        },
        {
          label: 'LLMs Usage',
          slug: 'llms',
        },
        {
          label: 'Reference',
          slug: 'references',
        },
        {
          label: 'Appendix',
          slug: 'appendix',
        },
      ],
    }),
  ],
  site: 'https://thetomaunatlala-777.github.io',
  base: '/Clubs-Connect/',
});
