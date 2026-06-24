'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TechGameDecor } from '@/components/ui/TechGameDecor';
import { cn } from '@/lib/utils';

type Props = {
  siteName?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  className?: string;
  layout?: 'home' | 'page';
};

function ContactInfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="game-contact-row border-b border-neutral-700/40 py-3.5 last:border-b-0 md:py-4">
      <div className="flex items-start justify-end gap-2.5 text-right">
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-heading)] text-[0.6rem] uppercase tracking-[0.2em] text-neutral-500">
            {label}
          </p>
          <div className="mt-1 text-sm leading-snug text-white">{children}</div>
        </div>
        <span className="game-contact-icon mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent)]/40 bg-black/25">
          <Icon size={14} className="text-[var(--color-accent)]" strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
}

export function ContactSection({
  siteName = 'EDZERO',
  email,
  phone,
  address,
  className,
  layout = 'home',
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (json.ok) {
        setStatus('success');
        setMessage('Thank you! Your message has been sent.');
        form.reset();
      } else {
        setStatus('error');
        setMessage(json.message ?? 'Failed to send message.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        layout === 'page'
          ? 'flex flex-1 flex-col justify-center py-8 md:py-12'
          : 'section-padding !py-8 md:!py-10',
        className,
      )}
    >
      <TechGameDecor variant="contact" />
      <div className="relative z-[1]">
        <SectionHeading
          title="Get in Touch"
          variant="light"
          navSafe={layout === 'home'}
          className="mb-6 md:mb-8"
        />
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-10">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <input name="name" required placeholder="Name" className="input-underline" />
            <input name="email" type="email" required placeholder="Email" className="input-underline" />
            <input name="subject" placeholder="Subject" className="input-underline" />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Write your message"
              className="input-underline resize-none"
            />
            <button type="submit" disabled={status === 'loading'} className="btn-pill game-btn disabled:opacity-50">
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
            {message && (
              <p className={status === 'success' ? 'text-green-400' : 'text-red-400'}>{message}</p>
            )}
          </form>

          <aside className="game-contact-aside relative px-5 py-6 text-right md:px-7 md:py-7">
            <span className="game-hud-corner absolute left-2.5 top-2.5 opacity-50" aria-hidden />
            <span
              className="game-hud-corner game-hud-corner-accent absolute bottom-2.5 right-2.5 rotate-180 opacity-50"
              aria-hidden
            />

            <p className="site-logo text-lg md:text-xl">
              {siteName}
              <span className="accent-dot" />
            </p>
            <p className="mt-2 font-[family-name:var(--font-body)] text-[0.65rem] tracking-[0.16em] text-neutral-500 uppercase">
              Contact Information
            </p>

            <div className="mt-5">
              {email && (
                <ContactInfoRow icon={Mail} label="Email">
                  <a href={`mailto:${email}`} className="break-all hover:text-[var(--color-accent)]">
                    {email}
                  </a>
                </ContactInfoRow>
              )}
              {phone && (
                <ContactInfoRow icon={Phone} label="Phone">
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-[var(--color-accent)]">
                    {phone}
                  </a>
                </ContactInfoRow>
              )}
              {address && (
                <ContactInfoRow icon={MapPin} label="Address">
                  <span className="whitespace-pre-line">{address}</span>
                </ContactInfoRow>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
