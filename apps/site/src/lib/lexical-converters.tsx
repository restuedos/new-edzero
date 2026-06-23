import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';

type RelationshipNode = {
  type: 'relationship';
  relationTo: string;
  value?:
    | number
    | string
    | {
        id?: number | string;
        email?: string | null;
        name?: string | null;
        title?: string | null;
        slug?: string | null;
      }
    | null;
};

type BlockLikeNode = {
  fields?: {
    blockType?: string;
    relationTo?: string;
    value?: RelationshipNode['value'];
    code?: string;
    language?: string | null;
    [key: string]: unknown;
  };
};

function resolveRelationshipLabel(relationTo: string, value: RelationshipNode['value']): string {
  if (value == null || value === '') return 'Related document';

  if (typeof value === 'object') {
    return (
      value.email ||
      value.name ||
      value.title ||
      (typeof value.slug === 'string' ? value.slug : null) ||
      String(value.id ?? 'Related document')
    );
  }

  return `${relationTo} #${value}`;
}

function RelationshipCard({
  relationTo,
  value,
}: {
  relationTo: string;
  value: RelationshipNode['value'];
}) {
  const label = resolveRelationshipLabel(relationTo, value);

  return (
    <aside className="article-relationship">
      <p className="article-relationship__label">Related {relationTo}</p>
      <p className="article-relationship__value">{label}</p>
    </aside>
  );
}

function relationshipFromBlock(node: BlockLikeNode) {
  const fields = node.fields;
  if (!fields) return null;

  const relationTo = typeof fields.relationTo === 'string' ? fields.relationTo : 'document';
  const value = fields.value as RelationshipNode['value'] | undefined;

  if (value == null && !fields.blockType?.includes('relationship')) {
    return null;
  }

  return <RelationshipCard relationTo={relationTo} value={value} />;
}

function CodeBlock({ code, language }: { code?: string; language?: string | null }) {
  if (!code) return null;

  return (
    <pre className="article-code-block">
      <code className={language ? `language-${language}` : undefined}>{code}</code>
    </pre>
  );
}

function codeFromBlock(node: BlockLikeNode) {
  const fields = node.fields;
  if (!fields?.code) return null;

  return <CodeBlock code={fields.code} language={fields.language} />;
}

export const articleRichTextConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  relationship: ({ node }) => {
    const relationship = node as RelationshipNode;
    return (
      <RelationshipCard relationTo={relationship.relationTo} value={relationship.value} />
    );
  },
  blocks: {
    ...(defaultConverters.blocks ?? {}),
    Code: ({ node }: { node: BlockLikeNode }) => codeFromBlock(node),
    'user-relationship': ({ node }: { node: BlockLikeNode }) =>
      relationshipFromBlock(node),
  },
  inlineBlocks: {
    ...(defaultConverters.inlineBlocks ?? {}),
    'user-relationship': ({ node }: { node: BlockLikeNode }) =>
      relationshipFromBlock(node),
  },
});
