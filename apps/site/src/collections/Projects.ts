import type { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'displayOrder'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Web Development', value: 'web-development' },
        { label: 'Back End & API', value: 'backend-api' },
        { label: 'Cloud & DevOps', value: 'cloud-devops' },
        { label: 'System Integration', value: 'system-integration' },
        { label: 'Illustration (legacy)', value: 'illustration' },
        { label: 'UI/UX (legacy)', value: 'ui-ux' },
        { label: 'Web Design (legacy)', value: 'web-design' },
      ],
      required: true,
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'images', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'description', type: 'textarea' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
};
