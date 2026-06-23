import type { CollectionConfig } from 'payload';

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'displayOrder', 'isActive'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'icon',
      type: 'select',
      options: [
        { label: 'Back End (code)', value: 'backend' },
        { label: 'Web (globe)', value: 'web' },
        { label: 'API (plug)', value: 'api' },
        { label: 'Cloud', value: 'cloud' },
        { label: 'Database', value: 'database' },
        { label: 'Performance (gauge)', value: 'performance' },
        { label: 'Code', value: 'code' },
        { label: 'Smartphone', value: 'smartphone' },
        { label: 'Layout', value: 'layout' },
        { label: 'Image', value: 'image' },
        { label: 'Server', value: 'server' },
        { label: 'System (network)', value: 'system' },
        { label: 'Palette', value: 'palette' },
      ],
      defaultValue: 'backend',
    },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
};
