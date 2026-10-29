import React, { useState } from 'react';
import { Copy, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
  BRIDE_NAME,
  GROOM_NAME,
  PREFIXES,
  PrefixCode,
  buildDisplayName,
  buildInviteLink,
  buildInviteMessage,
} from './guest';

export function AdminPage() {
  const [prefix, setPrefix] = useState<PrefixCode>('mr');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ link: string; displayName: string; message: string } | null>(null);

  const handleGenerate = () => {
    if (!guestName.trim()) return;
    const displayName = buildDisplayName(prefix, guestName);
    const link = buildInviteLink(window.location.origin, prefix, guestName);
    setGenerated({ link, displayName, message: buildInviteMessage(displayName, link) });
  };

  const copy = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Could not copy. Please copy it manually.');
    }
  };

  const fieldClass =
    'w-full px-4 py-3 rounded-lg border border-brand-beige focus:ring-2 focus:ring-brand-beige-deep focus:border-transparent outline-none transition-all bg-white font-sans';
  const secondaryButtonClass =
    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-beige-deep text-brand-beige-deep font-sans text-xs tracking-[0.15em] uppercase hover:bg-brand-beige/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-brand-ivory py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgba(176,137,104,0.15)] overflow-hidden border border-brand-beige/50">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-2 text-stone-800">Link Generator</h2>
            <p className="text-stone-500 font-sans text-sm uppercase tracking-[0.2em]">
              {GROOM_NAME} & {BRIDE_NAME}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Select Prefix
              </label>
              <select
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value as PrefixCode)}
                className={fieldClass}
              >
                {PREFIXES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Guest Name
              </label>
              <input
                type="text"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Sanjaya"
                className={fieldClass}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!guestName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-beige-deep text-white font-sans text-sm tracking-[0.2em] uppercase shadow-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon className="w-5 h-5" />
              Generate Link
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => generated && copy(generated.link, 'Link copied!')}
                disabled={!generated}
                className={secondaryButtonClass}
              >
                <Copy className="w-4 h-4" />
                Copy Link Only
              </button>
              <button
                onClick={() => generated && copy(generated.message, 'Message copied!')}
                disabled={!generated}
                className={secondaryButtonClass}
              >
                <MessageCircle className="w-4 h-4" />
                Copy Full Message
              </button>
            </div>

            {generated && (
              <div className="mt-2 space-y-4">
                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2 font-medium">Generated Link</p>
                  <a
                    href={generated.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-brand-beige-deep break-all underline underline-offset-2"
                  >
                    {generated.link}
                  </a>
                </div>

                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2 font-medium">Message Preview</p>
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm text-stone-600 leading-relaxed">
                    {generated.message}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
