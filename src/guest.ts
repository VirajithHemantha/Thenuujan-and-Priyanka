export const GROOM_NAME = 'Thanuujan';
export const BRIDE_NAME = 'Priyanka';

// `code` is the short value stored in the link's ?p= query parameter.
export const PREFIXES = [
  { label: 'Mr.', code: 'mr' },
  { label: 'Mrs.', code: 'mrs' },
  { label: 'Miss', code: 'miss' },
  { label: 'Mr. & Mrs.', code: 'mrmrs' },
  { label: 'Family', code: 'family' },
  { label: 'Dear', code: 'dear' },
] as const;

export type PrefixCode = (typeof PREFIXES)[number]['code'];

// "Dear" adds nothing here: the greeting itself already starts with "Dear".
export function buildDisplayName(code: string | null, guestName: string): string {
  const name = guestName.trim();
  if (!name) return '';
  if (code === 'family') return `${name} and Family`;
  const prefix = PREFIXES.find((p) => p.code === code);
  if (!prefix || prefix.code === 'dear') return name;
  return `${prefix.label} ${name}`;
}

export function buildInviteLink(baseUrl: string, code: PrefixCode, guestName: string): string {
  const path = `${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(guestName.trim())}`;
  return code === 'dear' ? path : `${path}?p=${code}`;
}

export function buildInviteMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;
}

/**
 * Reads the guest from the current URL: /{guestName}?p={code}.
 * Also accepts the older ?prefix=Mr.&name=Sanjaya links.
 */
export function getGuestDisplayName(): string {
  const params = new URLSearchParams(window.location.search);

  const legacyName = params.get('name');
  if (legacyName) {
    const legacyPrefix = params.get('prefix');
    const code = PREFIXES.find((p) => p.label === legacyPrefix)?.code ?? null;
    return buildDisplayName(code, legacyName);
  }

  const segment = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!segment || segment.includes('/')) return '';
  try {
    return buildDisplayName(params.get('p'), decodeURIComponent(segment));
  } catch {
    return '';
  }
}
