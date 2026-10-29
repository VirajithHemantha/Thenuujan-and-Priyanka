// Web App URL of the Apps Script deployment (see code.ts).
const DEPLOYED_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzfGxXGdX8vnECTXC5TW0qQIswRiIKvJosd90ObXZ0j6EaOejP__jjFYgdulg0bVOeW/exec';

export const SCRIPT_URL = DEPLOYED_SCRIPT_URL;

export async function submitToSheet(fields: Record<string, string>) {
  if (!SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured in src/config.ts');
  }

  // URL-encoded body keeps this a "simple" request (no CORS preflight) and
  // populates e.parameter in Apps Script.
  await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams(fields),
  });
}

export interface SheetWish {
  timestamp: string;
  name: string;
  message: string;
}

export async function fetchWishes(): Promise<SheetWish[]> {
  if (!SCRIPT_URL) return [];
  const res = await fetch(`${SCRIPT_URL}?sheet=Wishes`);
  const data = await res.json();
  return data.ok ? data.wishes : [];
}
