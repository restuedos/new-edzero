import type { CollectionConfig } from 'payload';

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', 'publishedAt'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'text', defaultValue: 'EDZERO Team' },
    { name: 'readTimeMinutes', type: 'number', defaultValue: 5 },
    { name: 'excerpt', type: 'textarea' },
    { name: 'body', type: 'richText' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    },
    { name: 'publishedAt', type: 'date' },
  ],
};
