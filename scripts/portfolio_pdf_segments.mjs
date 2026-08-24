const projectHeader = (id, storySelector, label) => ({
  label,
  from: `#${id} > .project__heading`,
  to: `#${id} > ${storySelector}`,
  matte: 28,
})

export const SEGMENTS = [
  { label: 'Hero', selector: '#home', matte: 0 },
  { label: 'Profile', selector: '#about', matte: 0 },

  { label: 'Operation header', from: '#work > .section-head', to: '#farmers-market > .operation-story', matte: 28 },
  { label: 'Operation originals', selector: '#farmers-market .operation-story__originals', matte: 24 },
  { label: 'Operation grammar', selector: '#farmers-market .operation-story__grammar', matte: 24 },
  { label: 'Operation system evidence', selector: '#farmers-market .operation-story__system', matte: 24 },
  { label: 'Operation extension', selector: '#farmers-market .operation-story__extension', all: true, rowGroup: true, matte: 24 },

  projectHeader('lanmu-rice', '.packaging-hero', 'Packaging header'),
  { label: 'Packaging hero', selector: '#lanmu-rice .packaging-hero', matte: 24 },
  { label: 'Packaging element lab', selector: '#lanmu-rice .element-lab', matte: 24 },
  { label: 'Packaging season track', selector: '#lanmu-rice .season-track', matte: 24 },
  { label: 'Packaging applications', selector: '#lanmu-rice .application-grid', matte: 24 },
  { label: 'Packaging structure', selector: '#lanmu-rice .structure-evidence', matte: 24 },
  { label: 'Packaging conclusion', selector: '#lanmu-rice .packaging-outro', matte: 24 },

  projectHeader('sanfu-lifestyle', '.sanfu-campaign', 'Sanfu header'),
  { label: 'Sanfu strategy', selector: '#sanfu-lifestyle .sanfu-campaign__strategy-section', matte: 24 },
  { label: 'Sanfu grammar', selector: '#sanfu-lifestyle .sanfu-campaign__grammar', matte: 24 },
  { label: 'Sanfu evidence', selector: '#sanfu-lifestyle .sanfu-campaign__evidence-section', matte: 24 },
  { label: 'Sanfu activation', selector: '#sanfu-lifestyle .sanfu-campaign__activation-section', matte: 24 },
  { label: 'Sanfu conclusion', selector: '#sanfu-lifestyle .sanfu-campaign__outro', matte: 24 },

  projectHeader('horsh-growth', '.poster-story', 'Horsh header'),
  { label: 'Horsh originals', selector: '#horsh-growth .poster-story__originals', matte: 24 },
  { label: 'Horsh timeline', selector: '#horsh-growth .poster-story__timeline', matte: 24 },
  { label: 'Horsh stage', selector: '#horsh-growth .poster-story__stage', matte: 24 },

  projectHeader('daodao-bar', '.daodao-story', 'Daodao header'),
  { label: 'Daodao hero', selector: '#daodao-bar .daodao-story__hero', matte: 24 },
  { label: 'Daodao concept', selector: '#daodao-bar .daodao-story__concept', matte: 24 },
  { label: 'Daodao identity', selector: '#daodao-bar .daodao-story__identity', matte: 24 },
  { label: 'Daodao originals', selector: '#daodao-bar .daodao-story__originals > *', all: true, rowGroup: true, matte: 24 },
  { label: 'Daodao extensions', selector: '#daodao-bar .daodao-story__extensions > *', all: true, rowGroup: true, matte: 24 },
  { label: 'Daodao conclusion', selector: '#daodao-bar .daodao-story__outro', matte: 24 },

  projectHeader('my-may-pizza', '.brand-story', 'Brand header'),
  { label: 'Brand positioning', selector: '#my-may-pizza .brand-story__concept-glow', matte: 24 },
  { label: 'Brand standards', selector: '#my-may-pizza .brand-story__standards', matte: 24 },
  { label: 'Brand VI application', selector: '#my-may-pizza .brand-story__vi-extension', all: true, rowGroup: true, matte: 24 },
  { label: 'Brand originals', selector: '#my-may-pizza .brand-story__originals', matte: 24 },
  { label: 'Brand DNA', selector: '#my-may-pizza .brand-story__dna', matte: 24 },
  { label: 'Brand extension', selector: '#my-may-pizza .brand-story__extensions > *', all: true, rowGroup: true, matte: 24 },
  { label: 'Brand conclusion', selector: '#my-may-pizza .brand-story__outro', matte: 24 },

  projectHeader('toss-diary', '.ip-story', 'IP header'),
  { label: 'IP foundation', selector: '#toss-diary .ip-story__foundation', matte: 24 },
  { label: 'IP evidence', selector: '#toss-diary .ip-story__evidence', matte: 24 },
  { label: 'IP service', selector: '#toss-diary .ip-story__service', matte: 24 },
  { label: 'IP summer campaign', selector: '#toss-diary .ip-story__summer-campaign', matte: 24 },
  { label: 'IP expression system', selector: '#toss-diary .ip-story__expression-system', matte: 24 },
  { label: 'IP character extension', selector: '#toss-diary .ip-story__extensions > *', all: true, rowGroup: true, matte: 24 },
  { label: 'IP seasonal motion', selector: '#toss-diary .ip-story__campaign-system', matte: 24 },
  { label: 'IP conclusion', selector: '#toss-diary .ip-story__outro', matte: 24 },

  { label: 'Strengths', selector: '.strengths', matte: 0 },
  { label: 'Contact', selector: '#contact', matte: 0 },
]
