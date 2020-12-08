export const navItems = [
  {
    name: 'Demos',
    url: '/demos',
    internal: true,
    category: 'about',
    headerNav: true,
  },
  {
    name: 'Philosophy',
    url: '/philosophy',
    internal: true,
    category: 'about',
    headerNav: true,
  },
  {
    name: 'FAQ',
    url: '/faq',
    internal: true,
    category: 'about',
    headerNav: true,
  },
  {
    name: 'Github',
    url: 'https://github.com/ethereum-optimism/optimism-monorepo',
    category: 'developers',
    headerNav: true,
  },
  {
    name: 'Documentation',
    url: 'https://docs.optimism.io/',
    category: 'developers',
    headerNav: true,
  },
  { name: 'Goerli ETH Faucet', url: 'TODO', category: 'developers' },
  { name: 'Early Access', url: 'TODO', category: 'developers' },
  { name: 'Block Explorer', url: 'TODO', category: 'developers' },
  {
    name: 'Blog',
    url: 'https://medium.com/ethereum-optimism',
    category: 'about',
    headerNav: true,
  },
  { name: 'Jobs', url: 'TODO', category: 'about' },
  {
    name: 'Twitter',
    url: 'https://twitter.com/optimismPBC',
    category: 'community',
  },
  {
    name: 'Discord',
    url: 'https://discord.com/invite/jrnFEvq',
    category: 'community',
  },
  {
    name: 'Youtube',
    url:
      'https://www.youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH',
    category: 'community',
  },
  {
    name: 'Optimistic Virtual Machine',
    url: 'TODO',
    category: 'product',
  },
  {
    name: 'Solidity to OVM Compiler',
    url: 'TODO',
    category: 'product',
  },
  {
    name: 'Optimistic Verifier',
    url: 'TODO',
    category: 'product',
  },
  {
    name: 'Optimistic Ethereum',
    url: 'TODO',
    category: 'product',
  },
];

export const products = navItems.filter((item) => item.category === 'product');
export const developers = navItems.filter(
  (item) => item.category === 'developers'
);
export const community = navItems.filter(
  (item) => item.category === 'community'
);
export const about = navItems.filter((item) => item.category === 'about');

export const navCategories = [
  { heading: 'About', items: about },
  { heading: 'Products', items: products },
  { heading: 'Developers', items: developers },
  { heading: 'Community', items: community },
];
