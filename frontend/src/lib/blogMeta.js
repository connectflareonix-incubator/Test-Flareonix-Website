/* Map blog categories → colors. */
export const CATEGORY_COLORS = {
  Opportunities: '#28a745',
  Updates: '#FF6B00',
  Announcements: '#CC2200',
  Events: '#6f42c1',
  Founders_Note: '#17a2b8',
};

export const categoryLabel = (c) => (c || '').replace('_', ' ');
export const categoryColor = (c) => CATEGORY_COLORS[c] || '#FF6B00';
