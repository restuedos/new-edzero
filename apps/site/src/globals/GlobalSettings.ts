import type { GlobalConfig } from 'payload';

function colorField(name: string, label: string, defaultValue: string) {
  return {
    name,
    type: 'text' as const,
    label,
    defaultValue,
    admin: {
      description: 'Hex color, e.g. #e31837',
    },
  };
}

export const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',
  label: 'Global Settings',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'EDZERO' },
    { name: 'tagline', type: 'text', defaultValue: 'Web Developer' },
    {
      name: 'heroHeadline',
      type: 'text',
      defaultValue: "I'm Restu Edo Setiaji, Web Developer.",
    },
    { name: 'heroSubheadline', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'aboutTitle', type: 'text', defaultValue: 'About Me' },
    { name: 'aboutName', type: 'text', defaultValue: 'Restu Edo Setiaji' },
    { name: 'aboutText', type: 'textarea' },
    { name: 'aboutImage', type: 'upload', relationTo: 'media' },
    { name: 'cvFile', type: 'upload', relationTo: 'media' },
    {
      name: 'skills',
      type: 'array',
      label: 'Skillset',
      admin: {
        description: 'Skill tags shown in the About section.',
      },
      fields: [{ name: 'label', type: 'text', required: true, label: 'Skill name' }],
    },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    { name: 'contactAddress', type: 'textarea' },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['facebook', 'twitter', 'instagram', 'linkedin', 'github'],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'theme',
      type: 'group',
      label: 'Theme colors',
      admin: {
        description: 'Website color palette. Primary is used for accents, links, and highlights.',
      },
      fields: [
        colorField('primaryColor', 'Primary (accent)', '#e31837'),
        colorField('secondaryColor', 'Secondary', '#ffffff'),
        colorField('backgroundColor', 'Background', '#121212'),
        colorField('backgroundDeepColor', 'Background deep', '#000000'),
        colorField('surfaceColor', 'Surface', '#1c1c1c'),
        colorField('surfaceElevatedColor', 'Surface elevated', '#242424'),
        colorField('textColor', 'Text', '#ffffff'),
        colorField('mutedColor', 'Muted text', '#a8a8a8'),
        colorField('mutedLightColor', 'Muted light', '#d4d4d4'),
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: 'Copyright © 2020 All rights reserved | Made with ♥ by EDZero',
    },
  ],
};
