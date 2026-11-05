/**
 * openflow.fun — Cloudflare Worker
 * Serves the static site from ./public and handles the contact form at POST /api/contact,
 * delivering every submission to Gmail through Resend.
 *
 * Required secret:  RESEND_API_KEY   (Workers → openflow → Settings → Variables and Secrets)
 * Vars (wrangler.toml): CONTACT_TO, CONTACT_FROM
 */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const clip = (s, n) => String(s ?? '').trim().slice(0, n);

async function handleContact(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  const origin = request.headers.get('origin');
  if (origin) {
    const host = new URL(origin).hostname;
    const allowed = host === 'openflow.fun' || host.endsWith('.openflow.fun') || host.endsWith('.workers.dev') || host === 'localhost';
    if (!allowed) return json({ ok: false, error: 'Forbidden' }, 403);
  }

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'Invalid JSON' }, 400); }

  // honeypot — bots fill the hidden "website" field
  if (body.website) return json({ ok: true });

  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const company = clip(body.company, 160);
  const phone = clip(body.phone, 60);
  const budget = clip(body.budget, 40);
  const message = clip(body.message, 5000);
  const services = Array.isArray(body.services) ? body.services.map(s => clip(s, 40)).slice(0, 8) : [];

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Please provide your name, a valid email and a message.' }, 422);
  }
  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'Email service not configured' }, 500);

  const ip = request.headers.get('cf-connecting-ip') || '';
  const country = request.cf?.country || '';
  const rows = [
    ['Name', name], ['Email', email], ['Company', company], ['Phone', phone],
    ['Services', services.join(', ')], ['Budget', budget], ['Location', country]
  ].filter(([, v]) => v);

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;background:#03050c;padding:32px;color:#eaf3ff">
    <div style="max-width:620px;margin:0 auto;background:#0b1328;border:1px solid #1d2c4d;border-radius:16px;overflow:hidden">
      <div style="padding:22px 26px;background:linear-gradient(100deg,#0a6cf0,#22c3e6 55%,#7be8d4);color:#00101a">
        <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:700">openflow.fun · new enquiry</div>
        <div style="font-size:22px;font-weight:700;margin-top:6px">${esc(name)}${company ? ' — ' + esc(company) : ''}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows.map(([k, v]) => `<tr><td style="padding:12px 26px;color:#8b9bb8;width:120px;border-bottom:1px solid #16233f">${k}</td><td style="padding:12px 26px;border-bottom:1px solid #16233f">${esc(v)}</td></tr>`).join('')}
      </table>
      <div style="padding:22px 26px">
        <div style="color:#8b9bb8;font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px">Message</div>
        <div style="white-space:pre-wrap;line-height:1.6">${esc(message)}</div>
      </div>
      <div style="padding:14px 26px;color:#5d6d8a;font-size:12px;border-top:1px solid #16233f">Hit reply to answer ${esc(name)} directly.</div>
    </div>
  </div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nMessage:\n${message}\n\nIP: ${ip}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'openflow website <onboarding@resend.dev>',
      to: (env.CONTACT_TO || 'openflow.ink@gmail.com').split(',').map(s => s.trim()),
      reply_to: email,
      subject: `New enquiry — ${name}${services.length ? ' · ' + services.join(', ') : ''}`,
      html, text
    })
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('Resend error', res.status, detail);
    return json({ ok: false, error: 'Email delivery failed' }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') return handleContact(request, env);

    // redirect www → apex
    if (url.hostname === 'www.openflow.fun') {
      url.hostname = 'openflow.fun';
      return Response.redirect(url.toString(), 301);
    }

    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    const p = url.pathname;
    if (p.startsWith('/assets/') || p.startsWith('/fonts/')) {
      out.headers.set('cache-control', 'public, max-age=31536000, immutable');
    }
    out.headers.set('x-content-type-options', 'nosniff');
    out.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
    out.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');
    return out;
  }
};
