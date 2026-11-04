// Concept work only. Replace artwork, copy and empty metric values with approved case studies.
export const projects = [
  { slug: 'fika', category: 'branding', theme: 'fika' },
  { slug: 'pulse', category: 'social', theme: 'pulse' },
  { slug: 'motion', category: 'video', theme: 'motion' },
  { slug: 'form', category: 'branding', theme: 'form' },
  { slug: 'daily', category: 'ads', theme: 'daily' },
  { slug: 'frames', category: 'video', theme: 'frames' },
].map((project) => ({
  ...project,
  image: null,
  gallery: [
    { id: 'overview', image: null },
    { id: 'detail', image: null },
    { id: 'system', image: null },
  ],
  metrics: [
    { value: '—', key: 'reach' },
    { value: '—', key: 'engagement' },
  ],
}));
