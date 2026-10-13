const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

const socials = [
  { label: '𝕏', href: 'https://x.com/openflowfun', aria: 'X / Twitter' },
  { label: 'f', href: 'https://www.facebook.com/openflow.fun', aria: 'Facebook' },
  { label: 'ig', href: 'https://www.instagram.com/openflow.fun/', aria: 'Instagram' },
  { label: 'in', href: 'https://www.linkedin.com/company/openflowfun', aria: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer
      className="relative pt-20 pb-10 overflow-hidden"
      style={{ background: '#030309', borderTop: '1px solid rgba(0,240,255,0.08)' }}
    >
      {/* Glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,240,255,0.08), transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-3 mb-5 group">
              <img
                src="./logo-mark.png"
                alt="Openflow"
                className="w-8 h-8 object-contain"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.5))' }}
              />
              <span
                className="font-display font-bold text-lg tracking-tight"
                style={{
                  background: 'linear-gradient(90deg,#00f0ff,#0088ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                openflow
              </span>
            </a>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Build anything digital — fast, affordable, and built to solve real problems.
              Guided by Flow.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="font-display font-semibold text-white/80 text-sm mb-5 tracking-wide uppercase text-xs">Navigate</div>
            <div className="space-y-3">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="block text-white/45 hover:text-white text-sm transition-colors duration-200"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <div className="font-display font-semibold text-white/80 text-sm mb-5 tracking-wide uppercase text-xs">Connect</div>
            <div className="flex gap-3 mb-6">
              {socials.map((s) => (
                <a
                  key={s.aria}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.aria}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display font-bold transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(0,240,255,0.06)',
                    border: '1px solid rgba(0,240,255,0.15)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                  onMouseEnter={e => {
                    const t = e.currentTarget
                    t.style.background = 'rgba(0,240,255,0.15)'
                    t.style.borderColor = 'rgba(0,240,255,0.4)'
                    t.style.color = '#00f0ff'
                    t.style.boxShadow = '0 0 16px rgba(0,240,255,0.2)'
                  }}
                  onMouseLeave={e => {
                    const t = e.currentTarget
                    t.style.background = 'rgba(0,240,255,0.06)'
                    t.style.borderColor = 'rgba(0,240,255,0.15)'
                    t.style.color = 'rgba(255,255,255,0.6)'
                    t.style.boxShadow = 'none'
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
            <a
              href="mailto:openflow.ink@gmail.com"
              className="text-white/45 hover:text-white text-sm transition-colors"
            >
              openflow.ink@gmail.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Openflow. All rights reserved.
          </p>
          <p className="text-white/25 text-xs flex items-center gap-1">
            Crafted with Flow
            <span style={{ color: '#00f0ff', filter: 'drop-shadow(0 0 4px #00f0ff)' }}>✦</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
