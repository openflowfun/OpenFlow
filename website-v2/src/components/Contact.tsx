import { useRef, useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const services = [
  'Modern Website',
  'Web / Mobile App',
  'Game Development',
  'Brand Identity',
  'AI Integration',
  'Crypto / Blockchain',
  'Digital Marketing',
  'Other',
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      // Formspree endpoint – replace FORM_ID with your real Formspree form ID
      const res = await fetch('https://formspree.io/f/openflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          service: form.service,
          message: form.message,
        }),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass = `
    w-full px-5 py-4 rounded-xl text-white placeholder-white/30 text-sm
    outline-none transition-all duration-200
    focus:ring-2 focus:ring-cyan-400/30
  `
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(0,240,255,0.12)',
  }
  const inputFocusStyle = { borderColor: 'rgba(0,240,255,0.4)' }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0520, #1a0b2e, #050510)' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Orbs */}
      <div className="orb absolute bottom-0 left-1/2 w-[700px] h-[400px] pointer-events-none"
           style={{ background: 'rgba(123,47,255,0.12)', transform: 'translate(-50%, 40%)' }} />
      <div className="orb absolute top-1/3 right-0 w-[400px] h-[400px] pointer-events-none"
           style={{ background: 'rgba(0,240,255,0.06)', transform: 'translate(20%, 0)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: CTA copy */}
          <div>
            <div className="reveal section-label mb-6">Join the Flow</div>
            <h2 className="reveal font-display font-bold leading-tight text-white mb-6"
                style={{ fontSize: 'clamp(2.2rem,4.5vw,3.5rem)' }}>
              Ready to build<br />
              <span className="text-gradient">something great?</span>
            </h2>
            <p className="reveal text-white/55 leading-relaxed mb-10 max-w-md">
              Tell us about your project and we'll come back within 24 hours with a clear plan,
              honest scope, and a price that makes sense.
            </p>

            {/* Contact info */}
            <div className="reveal space-y-5">
              {[
                { icon: '✉', label: 'Email', value: 'openflow.ink@gmail.com', href: 'mailto:openflow.ink@gmail.com' },
                { icon: '𝕏', label: 'Twitter/X', value: '@openflowfun', href: 'https://x.com/openflowfun' },
                { icon: 'ig', label: 'Instagram', value: '@openflow.fun', href: 'https://www.instagram.com/openflow.fun/' },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-display font-bold transition-colors duration-200"
                    style={{
                      background: 'rgba(0,240,255,0.08)',
                      border: '1px solid rgba(0,240,255,0.2)',
                      color: '#00f0ff',
                    }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-white/40 text-xs">{c.label}</div>
                    <div className="text-white/80 text-sm group-hover:text-white transition-colors">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Flow character small */}
            <div className="reveal mt-14 relative w-48">
              <img
                src="./flow-hero.png"
                alt="Flow"
                className="w-full"
                style={{
                  filter: 'drop-shadow(0 0 16px rgba(0,240,255,0.5))',
                  animation: 'float 5s ease-in-out infinite',
                  background: 'linear-gradient(135deg, rgba(0,240,255,0.08), transparent)',
                  borderRadius: 16,
                }}
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="reveal">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-2xl p-10 text-center"
                  style={{ border: '1px solid rgba(0,240,255,0.25)' }}
                >
                  <div className="text-5xl mb-5" style={{ filter: 'drop-shadow(0 0 16px #00f0ff)' }}>✓</div>
                  <h3 className="font-display font-bold text-2xl text-white mb-3">Message Received!</h3>
                  <p className="text-white/60">
                    Flow will deliver your message personally. We'll be back within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="glass rounded-2xl p-8 space-y-5"
                  style={{ border: '1px solid rgba(0,240,255,0.12)' }}
                >
                  <h3 className="font-display font-bold text-xl text-white mb-2">Start Your Project</h3>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2 ml-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Alex Johnson"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2 ml-1">What do you need?</label>
                    <select
                      required
                      value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      className={inputClass}
                      style={{ ...inputStyle, color: form.service ? '#fff' : 'rgba(255,255,255,0.3)' }}
                    >
                      <option value="" disabled>Select a service...</option>
                      {services.map(s => <option key={s} value={s} style={{ background: '#0a0520', color: '#fff' }}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2 ml-1">Tell us about it</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="What are you building? What's the timeline? Any special requirements?"
                      rows={5}
                      className={inputClass}
                      style={{ ...inputStyle, resize: 'none' }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary w-full justify-center"
                    style={{ opacity: status === 'sending' ? 0.7 : 1 }}
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Launch My Project
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm text-center">
                      Something went wrong. Email us directly at openflow.ink@gmail.com
                    </p>
                  )}

                  <p className="text-white/30 text-xs text-center">
                    No spam. No commitment. 24-hour response guarantee.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
