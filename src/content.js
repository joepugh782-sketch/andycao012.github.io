// Identity, dates and figures transcribed from page 2 of the supplied PDF.
// These figures describe the source portfolio, rather than live business metrics.
export const portfolioDocument = {
  href: '/portfolio.pdf?v=cc2c5d733844',
  pageCount: 32,
};
export const profile = {
  name: '曹佳豪', englishName: 'Andy Cao', role: '电商视觉设计师',
  phone: '18717913095', email: 'c393886367@163.com',
  intro: '以品牌为起点，以产品为主角。',
  bio: '我是曹佳豪，一名电商设计师。擅长提炼商品卖点，通过色彩、排版与场景，让产品的吸引力被看见。在品牌调性、信息传达与转化目标之间，寻找恰到好处的视觉表达。',
  stats: [
    { value: '6', suffix: '+', label: '年设计经验', en: 'YEARS OF EXPERIENCE' },
    { value: '20', suffix: '+', label: '项目经历', en: 'PROJECTS' },
    { value: '25', suffix: '+', label: '年均电商活动', en: 'CAMPAIGNS / YEAR' },
    { value: '15', suffix: '+', label: '年均详情页设计', en: 'DETAIL PAGES / YEAR' },
  ],
};
export const experience = [
  { period: '2022.08 — 至今', company: '上海每日黑巧企业发展有限公司', role: '电商平面设计师' },
  { period: '2021.10 — 2022.07', company: '上美化妆品销售服务有限公司', role: '电商设计师' },
  { period: '2019.06 — 2022.07', company: '上海凯诘电子商务有限公司', role: '电商平面设计师' },
];
export const projects = [
  { id: '01', key: 'chocoday', name: '每日黑巧', english: 'CHOCDAY', category: '食品', discipline: '产品详情 · 活动视觉 · 推广设计', title: '让风味，成为主角。', cover: '/covers/chocoday.jpg', color: '#bda265', pages: [4,5,6,7,8,9,10,11],
    description: '从巧克力与榴莲的浓郁风味，到轻盈浪漫的莓果口味，以食材、色彩与场景建立产品的第一印象。围绕卖点梳理详情页叙事，并延展至活动页面、主图及推广素材。', scopes: ['产品详情页', '电商活动页', '产品主图', '推广素材'] },
  { id: '02', key: 'colgate', name: '高露洁', english: 'COLGATE', category: '美妆个护', discipline: '个护视觉 · 产品详情 · 大促设计', title: '把专业，讲得更直观。', cover: '/covers/colgate.jpg', color: '#c54235', pages: [13,14,15,16,17],
    description: '以清晰的产品信息和有辨识度的品牌色，呈现口腔护理产品的功能与使用体验。将产品、功效与消费场景组织为连贯的阅读路径，延展至日常运营与营销活动页面。', scopes: ['产品详情页', '电商活动页', '产品主图'] },
  { id: '03', key: 'oneleaf', name: '一叶子', english: 'ONE LEAF', category: '美妆个护', discipline: '护肤视觉 · 营销活动 · 推广素材', title: '看见植物的生命力。', cover: '/covers/oneleaf.jpg', color: '#263d32', pages: [19,20,21,22,23],
    description: '以植物、成分与产品质感为视觉线索，建立清新自然的护肤表达。围绕不同营销节点，结合产品组合与信息层级，完成活动页面、商品主图及推广素材。', scopes: ['电商活动页', '产品主图', '推广素材'] },
  { id: '04', key: 'baby-elephant', name: '红色小象', english: 'BABY ELEPHANT', category: '母婴', discipline: '母婴视觉 · 产品详情 · 活动设计', title: '温柔的设计，也有力量。', cover: '/covers/baby-elephant.jpg', color: '#ddc0bd', pages: [25,26,27,28,29],
    description: '用柔和的色彩与亲近的画面语言，呈现母婴产品的关怀感。围绕产品特点与家庭使用场景，梳理页面信息，完成详情页、活动页及多种推广视觉。', scopes: ['产品详情页', '电商活动页', '产品主图', '推广素材'] },
];
export const abilities = [
  { id: '01', title: '让品牌，被记住', en: 'BRAND EXPRESSION', icon: 'brand', text: '理解品牌的个性与受众，让色彩、字体和画面语言贯穿每一个触点。', tags: ['品牌调性', '视觉延展'] },
  { id: '02', title: '让卖点，被看见', en: 'PRODUCT STORYTELLING', icon: 'product', text: '从商品本身出发，梳理信息层级，用排版与场景把产品价值讲清楚。', tags: ['详情页设计', '产品表现'] },
  { id: '03', title: '让创意，落到实处', en: 'CAMPAIGN DESIGN', icon: 'campaign', text: '从日常运营到营销节点，兼顾视觉吸引力与浏览体验，高效推进设计落地。', tags: ['活动视觉', '团队协作'] },
  { id: '04', title: '让想象，多一种可能', en: 'TOOLS & EXPLORATION', icon: 'tools', text: '结合平面设计、三维与 AIGC 工具，持续探索适合产品的表现方式。', tags: ['Photoshop', 'Illustrator', 'C4D', 'AIGC'] },
];
