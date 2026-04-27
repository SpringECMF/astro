import { supabase } from './supabase.js';

export const CONSENT_VERSION = '1.0';
const STORAGE_KEY  = 'ecmf-cookie-consent';
const SESSION_KEY  = 'ecmf-sid';
const EXPIRY_MS    = 365 * 24 * 60 * 60 * 1000;

export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.version !== CONSENT_VERSION) return null;
    if (Date.now() - new Date(data.date).getTime() > EXPIRY_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function hasValidConsent() {
  return getStoredConsent() !== null;
}

function getOrCreateSessionId() {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export async function saveConsent({ analytics = false, marketing = false }, action) {
  const record = {
    version:     CONSENT_VERSION,
    date:        new Date().toISOString(),
    preferences: { technical: true, analytics, marketing },
    action,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));

  try {
    const { error } = await supabase.from('cookie_consents').insert({
      session_id:      getOrCreateSessionId(),
      technical:       true,
      analytics,
      marketing,
      consent_version: CONSENT_VERSION,
      action,
      user_agent:      navigator.userAgent.slice(0, 250),
      page_url:        window.location.pathname,
    });
    if (error) console.warn('[CookieConsent] Supabase:', error.message);
  } catch (e) {
    console.warn('[CookieConsent] No se pudo registrar en Supabase:', e);
  }

  window.dispatchEvent(
    new CustomEvent('ecmf:consent', { detail: record.preferences })
  );
}
