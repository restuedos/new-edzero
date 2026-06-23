import {
  RichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react';
import { articleRichTextConverters } from '@/lib/lexical-converters';
import type { Article } from '@/payload-types';

type Props = {
  data?: Article['body'];
  className?: string;
};

export function LexicalRichText({ data, className }: Props) {
  if (!data) return null;

  return (
    <RichText
      className={className ?? 'payload-richtext'}
      data={data}
      converters={articleRichTextConverters as JSXConvertersFunction}
    />
  );
}
