export const navItems = [
  {
    name: 'Demos',
    url: 'https://optimism.io/demos',
    categories: ['about'],
    headerNav: true,
  },
  {
    name: 'Gas comparison',
    url: 'https://optimism.io/gas-comparison',
    categories: ['about'],
    headerNav: true,
  },
  {
    name: 'Github',
    url: 'https://github.com/ethereum-optimism',
    categories: ['developers'],
    headerNav: true,
    isExternal: true,
  },
  {
    name: 'Documentation',
    url: 'https://community.optimism.io/docs',
    categories: ['developers'],
    headerNav: true,
  },
  {
    name: 'Tutorial',
    url: 'http://community.optimism.io/tutorial',
    categories: ['developers'],
  },
  {
    name: 'FAQs',
    url: 'http://community.optimism.io/faqs',
    categories: ['developers'],
  },
  {
    name: 'Blog',
    url: 'https://medium.com/ethereum-optimism',
    categories: ['about'],
    headerNav: true,
    isExternal: true,
  },
  {
    name: 'Jobs',
    url: 'https://angel.co/company/optimism-pbc/jobs',
    categories: ['about'],
    isExternal: true,
  },
  {
    name: 'System Status',
    url: 'https://optimism.io/status',
    categories: ['about'],
    footerOnly: true,
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/optimismPBC',
    categories: ['social'],
    isExternal: true,
  },
  {
    name: 'Discord',
    url: 'https://discord.com/invite/jrnFEvq',
    categories: ['social'],
    isExternal: true,
  },
  {
    name: 'Youtube',
    url: 'https://www.youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH',
    categories: ['social'],
    isExternal: true,
  },
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv/optimismpbc',
    categories: ['social'],
    isExternal: true,
  },
];

// export const products = navItems.filter((item) => item.categories.includes('product'));
export const developers = navItems.filter(item => item.categories.includes('developers'));
export const community = navItems.filter(item => item.categories.includes('community'));
export const about = navItems.filter(item => item.categories.includes('about'));

export const navCategories = [
  { heading: 'About', items: about },
  { heading: 'Developers', items: developers },
];

export const images = {
  nyanCat: 'nyancat.png',
  hero: 'hero.svg',
  hayden: 'hayden-adams.jpg',
  justin: 'justin-moses.png',
  synthetixScreenCap: 'synthetix-screencap.png',
  synthetixLogoWhite: 'synthetix-logo-white.png',
  unipigScreenCap: 'unipig-screencap.png',
  ethLogo: 'ethLogo.svg',
};
