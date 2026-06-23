import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '@payload-config';
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload';
import { placeholderImages } from '../lib/placeholder-images';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const cvSourcePath = path.join(projectRoot, 'storage/cv/restu-edo-setiaji-resume.pdf');
const cvFilename = 'restu-edo-setiaji-resume.pdf';

const services = [
  {
    title: 'Back End Development',
    description:
      'Building scalable backend services with PHP, Node.js, and Go — RESTful APIs, microservices, and server-side logic for production applications.',
    icon: 'backend' as const,
    displayOrder: 1,
  },
  {
    title: 'Web Development',
    description:
      'Developing and maintaining full-stack web applications, from ePuskesmas systems to exam platforms, with clean architecture and reliable delivery.',
    icon: 'web' as const,
    displayOrder: 2,
  },
  {
    title: 'API Integration',
    description:
      'Integrating third-party services such as BPJS, SatuSehat, payment gateways (AstraPay, Xendit), KYC providers, and internal enterprise systems.',
    icon: 'api' as const,
    displayOrder: 3,
  },
  {
    title: 'Cloud & DevOps',
    description:
      'Deploying and maintaining services on AWS, Azure, and GCP using Docker, Kubernetes, CI/CD pipelines, Function Apps, and API Management.',
    icon: 'cloud' as const,
    displayOrder: 4,
  },
  {
    title: 'Database Engineering',
    description:
      'Designing and optimizing data layers with MySQL, PostgreSQL, MongoDB, and SQL Server for high-traffic, mission-critical applications.',
    icon: 'database' as const,
    displayOrder: 5,
  },
  {
    title: 'Performance & Troubleshooting',
    description:
      'Analyzing bugs, optimizing performance, and resolving production issues — from Jira/Zoho tickets to root-cause fixes in live systems.',
    icon: 'performance' as const,
    displayOrder: 6,
  },
];

const testimonials = [
  {
    quote:
      'Restu delivered a robust backend for our ePuskesmas platform — reliable integrations with BPJS and SatuSehat that our teams depend on every day.',
    authorName: 'Ahmad Rizki',
    authorTitle: 'Product Manager, Infokes Indonesia',
    displayOrder: 1,
  },
  {
    quote:
      'Excellent work on TRACtoGo and our payment gateway services. Fast troubleshooting, clean API design, and always production-ready code.',
    authorName: 'Diana Putri',
    authorTitle: 'Engineering Lead, Serasi Autoraya',
    displayOrder: 2,
  },
  {
    quote:
      'The exam platform improvements were outstanding — new question types, IRT scoring, and analytics that genuinely helped our students and teachers.',
    authorName: 'Budi Santoso',
    authorTitle: 'CTO, Crayonpedia',
    displayOrder: 3,
  },
  {
    quote:
      'A dependable fullstack developer who understands microservices, Azure, and the urgency of live healthcare systems. Highly recommended.',
    authorName: 'Siti Rahmawati',
    authorTitle: 'Technical Director, Dinkes Jawa Barat',
    displayOrder: 4,
  },
  {
    quote:
      'Professional, detail-oriented, and great at API integration. Restu helped us ship critical features ahead of schedule without compromising quality.',
    authorName: 'Michael Chen',
    authorTitle: 'Project Manager, TRAC Digital',
    displayOrder: 5,
  },
  {
    quote:
      'Strong DevOps mindset — Docker, Kubernetes, and CI/CD pipelines that made our deployments smoother and our infrastructure easier to maintain.',
    authorName: 'Rina Wulandari',
    authorTitle: 'DevOps Manager, Enterprise Client',
    displayOrder: 6,
  },
];

const projects = [
  {
    title: 'ePuskesmas Platform',
    slug: 'epuskesmas-platform',
    category: 'web-development' as const,
    displayOrder: 1,
  },
  {
    title: 'TRACtoGo',
    slug: 'tractogo',
    category: 'web-development' as const,
    displayOrder: 2,
  },
  {
    title: 'E-Form Digital',
    slug: 'e-form-digital',
    category: 'web-development' as const,
    displayOrder: 3,
  },
  {
    title: 'TRAC Reservation',
    slug: 'trac-reservation',
    category: 'web-development' as const,
    displayOrder: 4,
  },
  {
    title: 'Crayonpedia Exam System',
    slug: 'crayonpedia-exam',
    category: 'backend-api' as const,
    displayOrder: 5,
  },
  {
    title: 'Payment Gateway Integration',
    slug: 'payment-gateway',
    category: 'system-integration' as const,
    displayOrder: 6,
  },
  {
    title: 'BPJS & SatuSehat',
    slug: 'bpjs-satusehat',
    category: 'system-integration' as const,
    displayOrder: 7,
  },
  {
    title: 'Azure Microservices',
    slug: 'azure-microservices',
    category: 'cloud-devops' as const,
    displayOrder: 8,
  },
  {
    title: 'Docker & Kubernetes Pipeline',
    slug: 'docker-kubernetes',
    category: 'cloud-devops' as const,
    displayOrder: 9,
  },
];

async function ensureMediaFromUrl(
  payload: Awaited<ReturnType<typeof getPayload>>,
  { url, filename, alt }: { url: string; filename: string; alt: string },
) {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  });

  if (existing.docs[0]) {
    return existing.docs[0].id;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const tmpPath = path.join(os.tmpdir(), filename);
  fs.writeFileSync(tmpPath, Buffer.from(await response.arrayBuffer()));

  try {
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: tmpPath,
    });
    console.log('Uploaded media:', doc.filename);
    return doc.id;
  } finally {
    fs.unlinkSync(tmpPath);
  }
}

async function ensureCvMedia(payload: Awaited<ReturnType<typeof getPayload>>) {
  if (!fs.existsSync(cvSourcePath)) {
    console.warn(`CV not found at ${cvSourcePath} — skipping cvFile`);
    return undefined;
  }

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: cvFilename } },
    limit: 1,
  });

  if (existing.docs[0]) {
    await payload.delete({ collection: 'media', id: existing.docs[0].id });
  }

  const doc = await payload.create({
    collection: 'media',
    data: { alt: 'Restu Edo Setiaji — Resume (CV)' },
    filePath: cvSourcePath,
  });

  console.log('Uploaded CV media:', doc.filename);
  return doc.id;
}

async function seed() {
  const payload = await getPayload({ config });
  const cvFile = await ensureCvMedia(payload);

  console.log('Fetching Unsplash template images…');
  const heroImage = await ensureMediaFromUrl(payload, {
    url: placeholderImages.hero,
    filename: 'seed-hero-unsplash.jpg',
    alt: 'Developer workspace — Unsplash',
  });
  const aboutImage = await ensureMediaFromUrl(payload, {
    url: placeholderImages.about,
    filename: 'seed-about-unsplash.jpg',
    alt: 'Professional portrait — Unsplash',
  });

  const testimonialBackgroundIds: number[] = [];
  for (let i = 0; i < placeholderImages.testimonialBackgrounds.length; i++) {
    const id = await ensureMediaFromUrl(payload, {
      url: placeholderImages.testimonialBackgrounds[i]!,
      filename: `seed-testimonial-bg-${i + 1}-unsplash.jpg`,
      alt: `Testimonial background ${i + 1} — Unsplash`,
    });
    testimonialBackgroundIds.push(id);
  }

  const projectCoverIds: number[] = [];
  for (let i = 0; i < placeholderImages.portfolio.length; i++) {
    const id = await ensureMediaFromUrl(payload, {
      url: placeholderImages.portfolio[i]!,
      filename: `seed-project-cover-${i + 1}-unsplash.jpg`,
      alt: `Project cover ${i + 1} — Unsplash`,
    });
    projectCoverIds.push(id);
  }

  const journalCoverIds: number[] = [];
  for (let i = 0; i < placeholderImages.journal.length; i++) {
    const id = await ensureMediaFromUrl(payload, {
      url: placeholderImages.journal[i]!,
      filename: `seed-journal-cover-${i + 1}-unsplash.jpg`,
      alt: `Journal cover ${i + 1} — Unsplash`,
    });
    journalCoverIds.push(id);
  }

  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@edzero.test' } },
    limit: 1,
  });

  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@edzero.test',
        password: 'password',
        name: 'Site Admin',
      },
    });
    console.log('Created admin@edzero.test / password');
  }

  await payload.updateGlobal({
    slug: 'global-settings',
    data: {
      siteName: 'EDZERO',
      tagline: 'Web Developer',
      heroHeadline: "I'm Restu Edo Setiaji, Web Developer.",
      heroSubheadline: 'Crafting digital experiences with passion and precision.',
      aboutTitle: 'About Me',
      aboutName: 'Restu Edo Setiaji',
      aboutText:
        'Fullstack Developer with a strong focus on **Back End and Web Development**. Graduated from SMKN 1 Cimahi (Software Engineering) and currently pursuing Information Systems at Universitas Terbuka, Bandung.\n\nExperienced at Infokes Indonesia, Serasi Autoraya, and Crayonpedia — building scalable backends, API integrations, and cloud services on **AWS, Azure, and GCP**. Proficient in PHP, Node.js, and Go, with strengths in **problem solving**, performance optimization, and working with MySQL, PostgreSQL, and Docker/Kubernetes.',
      contactEmail: 'restuedosetiaji@gmail.com',
      contactPhone: '+62 895 3410 28697',
      contactAddress:
        'Jl. Pojok Selatan RT 001/RW 007\nKel. Setiamanah, Kec. Cimahi Tengah\nCimahi, West Java 40524',
      skills: [
        { label: 'PHP' },
        { label: 'Node.js' },
        { label: 'Go' },
        { label: 'AWS' },
        { label: 'Docker' },
        { label: 'PostgreSQL' },
      ],
      theme: {
        primaryColor: '#e31837',
        secondaryColor: '#ffffff',
        backgroundColor: '#121212',
        backgroundDeepColor: '#000000',
        surfaceColor: '#1c1c1c',
        surfaceElevatedColor: '#242424',
        textColor: '#ffffff',
        mutedColor: '#a8a8a8',
        mutedLightColor: '#d4d4d4',
      },
      copyrightText: `Copyright © ${new Date().getFullYear()} All rights reserved | Made with ♥ by EDZero`,
      socialLinks: [
        { platform: 'facebook', url: 'https://www.facebook.com/restu.edo.s' },
        { platform: 'twitter', url: 'https://www.x.com/restuedos' },
        { platform: 'instagram', url: 'https://www.instagram.com/restuedos' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/in/restu-edo-s-06314b1b0/' },
        { platform: 'github', url: 'https://github.com/restuedos' },
      ],
      ...(cvFile ? { cvFile } : {}),
      heroImage,
      aboutImage,
    },
  });
  console.log('Updated global settings');

  const existingServices = await payload.find({ collection: 'services', limit: 1 });
  if (existingServices.totalDocs === 0) {
    for (const service of services) {
      await payload.create({ collection: 'services', data: { ...service, isActive: true } });
    }
    console.log(`Seeded ${services.length} services`);
  } else {
    for (const service of services) {
      const match = await payload.find({
        collection: 'services',
        where: { displayOrder: { equals: service.displayOrder } },
        limit: 1,
      });
      const doc = match.docs[0];
      if (doc) {
        await payload.update({
          collection: 'services',
          id: doc.id,
          data: { ...service, isActive: true },
        });
      }
    }
    console.log('Synced services from CV');
  }

  const existingProjects = await payload.find({ collection: 'projects', limit: 1 });
  if (existingProjects.totalDocs === 0) {
    for (const project of projects) {
      const data: RequiredDataFromCollectionSlug<'projects'> = {
        ...project,
        isActive: true,
        featured: true,
        coverImage: projectCoverIds[(project.displayOrder - 1) % projectCoverIds.length],
      };
      await payload.create({ collection: 'projects', data });
    }
    console.log(`Seeded ${projects.length} projects`);
  } else {
    for (const project of projects) {
      const match = await payload.find({
        collection: 'projects',
        where: { displayOrder: { equals: project.displayOrder } },
        limit: 1,
      });
      const doc = match.docs[0];
      const data: RequiredDataFromCollectionSlug<'projects'> = {
        ...project,
        isActive: true,
        featured: true,
        coverImage: projectCoverIds[(project.displayOrder - 1) % projectCoverIds.length],
      };
      if (doc) {
        await payload.update({ collection: 'projects', id: doc.id, data });
      } else {
        await payload.create({ collection: 'projects', data });
      }
    }
    console.log('Synced projects from CV');
  }

  const existingTestimonials = await payload.find({ collection: 'testimonials', limit: 1 });
  if (existingTestimonials.totalDocs === 0) {
    for (const testimonial of testimonials) {
      await payload.create({
        collection: 'testimonials',
        data: {
          ...testimonial,
          isActive: true,
          backgroundImage: testimonialBackgroundIds[(testimonial.displayOrder - 1) % testimonialBackgroundIds.length],
        },
      });
    }
    console.log(`Seeded ${testimonials.length} testimonials`);
  } else {
    for (const testimonial of testimonials) {
      const match = await payload.find({
        collection: 'testimonials',
        where: { displayOrder: { equals: testimonial.displayOrder } },
        limit: 1,
      });
      const doc = match.docs[0];
      if (doc) {
        await payload.update({
          collection: 'testimonials',
          id: doc.id,
          data: {
            ...testimonial,
            isActive: true,
            backgroundImage: testimonialBackgroundIds[(testimonial.displayOrder - 1) % testimonialBackgroundIds.length],
          },
        });
      } else {
        await payload.create({
          collection: 'testimonials',
          data: {
            ...testimonial,
            isActive: true,
            backgroundImage: testimonialBackgroundIds[(testimonial.displayOrder - 1) % testimonialBackgroundIds.length],
          },
        });
      }
    }
    console.log('Synced testimonials');
  }

  const existingArticles = await payload.find({ collection: 'articles', limit: 1 });
  const articles = [
    {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-nextjs',
      author: 'Restu Edo Setiaji',
      readTimeMinutes: 5,
      excerpt: 'Learn how to build modern web apps with Next.js App Router.',
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      coverImage: journalCoverIds[0],
    },
    {
      title: 'Design Systems for Startups',
      slug: 'design-systems-startups',
      author: 'Restu Edo Setiaji',
      readTimeMinutes: 7,
      excerpt: 'Why a design system matters from day one.',
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      coverImage: journalCoverIds[1],
    },
    {
      title: 'Building with Payload CMS',
      slug: 'building-with-payload',
      author: 'Restu Edo Setiaji',
      readTimeMinutes: 6,
      excerpt: 'Headless CMS patterns for company profile sites.',
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      coverImage: journalCoverIds[2],
    },
  ];

  if (existingArticles.totalDocs === 0) {
    for (const article of articles) {
      await payload.create({ collection: 'articles', data: article });
    }
    console.log(`Seeded ${articles.length} articles`);
  } else {
    for (const article of articles) {
      const match = await payload.find({
        collection: 'articles',
        where: { slug: { equals: article.slug } },
        limit: 1,
      });
      const doc = match.docs[0];
      if (doc) {
        await payload.update({ collection: 'articles', id: doc.id, data: article });
      } else {
        await payload.create({ collection: 'articles', data: article });
      }
    }
    console.log('Synced articles with cover images');
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
