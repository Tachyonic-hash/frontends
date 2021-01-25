export const navItems = [
  {
    name: 'Demos',
    url: '/demos',
    internal: true,
    categories: ['about'],
    headerNav: true,
  },
  // {
  //   name: 'Philosophy',
  //   url: '/philosophy',
  //   internal: true,
  //   categories: ['about'],
  //   headerNav: true,
  // },
  // {
  //   name: 'FAQ',
  //   url: '/faq',
  //   internal: true,
  //   categories: ['about'],
  //   headerNav: true,
  // },
  {
    name: 'Github',
    url: 'https://github.com/ethereum-optimism/optimism-monorepo',
    categories: ['developers'],
    headerNav: true,
  },
  {
    name: 'Documentation',
    url: 'https://docs.optimism.io/',
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
  // { name: 'Goerli ETH Faucet', url: 'TODO-faucet', categories: ['developers'] },
  // { name: 'Early Access', url: 'TODO-access', categories: ['developers'] },
  // { name: 'Block Explorer', url: 'TODO-explorer', categories: ['developers'] },
  {
    name: 'Blog',
    url: 'https://medium.com/ethereum-optimism',
    categories: ['about'],
    headerNav: true,
  },
  {
    name: 'Jobs',
    url: 'https://angel.co/company/optimism-pbc/jobs',
    categories: ['about'],
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/optimismPBC',
    categories: ['social'],
  },
  {
    name: 'Discord',
    url: 'https://discord.com/invite/jrnFEvq',
    categories: ['social'],
  },
  {
    name: 'Youtube',
    url:
      'https://www.youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH',
    categories: ['social'],
  },
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv/optimismpbc',
    categories: ['social'],
  },
  // {
  //   name: 'Optimistic Virtual Machine',
  //   url: 'TODO-ovm',
  //   categories: ['product'],
  // },
  // {
  //   name: 'Solidity to OVM Compiler',
  //   url: 'TODO-compiler',
  //   categories: ['product'],
  // },
  // {
  //   name: 'Optimistic Verifier',
  //   url: 'TODO-verifier',
  //   categories: ['product'],
  // },
  // {
  //   name: 'Optimistic Ethereum',
  //   url: 'TODO-ethereum',
  //   categories: ['product'],
  // },
];

// export const products = navItems.filter((item) => item.categories.includes('product'));
export const developers = navItems.filter((item) =>
  item.categories.includes('developers')
);
export const community = navItems.filter((item) =>
  item.categories.includes('community')
);
export const about = navItems.filter((item) =>
  item.categories.includes('about')
);

export const navCategories = [
  { heading: 'About', items: about },
  // { heading: 'Products', items: products },
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
