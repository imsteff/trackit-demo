export function decodeHtmlEntities(str) {
  if (!str) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

export function getPlainSubject(raw) {
  if (!raw) return '—';
  const decoded = decodeHtmlEntities(raw);
  if (!decoded.trim().startsWith('<')) return decoded.trim() || '—';
  const tmp = document.createElement('div');
  tmp.innerHTML = decoded;
  const th = tmp.querySelector('th');
  if (th?.textContent?.trim()) return th.textContent.trim();
  const text = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
  return text.slice(0, 100) || '—';
}

export function parseChatBody(body) {
  if (!body) return '';
  if (!body.includes('Content-Type:')) return body;

  const HEADER_MARKERS = ['quoted-printable', '7bit', '8bit', 'base64'];
  let contentStart = -1;
  for (const marker of HEADER_MARKERS) {
    const idx = body.lastIndexOf(marker);
    if (idx !== -1) { contentStart = idx + marker.length; break; }
  }
  if (contentStart === -1) {
    const idx = body.lastIndexOf('Content-Transfer-Encoding:');
    if (idx !== -1) {
      const eol = body.indexOf('\n', idx);
      contentStart = eol !== -1 ? eol : idx + 30;
    }
  }

  if (contentStart !== -1) {
    const raw = body.slice(contentStart).trimStart();
    const decoded = raw
      .replace(/=\r?\n/g, '')
      .replace(/=([A-Fa-f0-9]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    return decoded.trim() || body;
  }

  return body;
}
