import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { num: 50, suffix: '+', label: 'Projects Delivered', desc: 'Across web, apps, games and blockchain' },
  { num: 100, suffix: '%', label: 'Client Satisfaction', desc: 'Zero unhappy clients, zero excuses' },
  { num: 3, suffix: '×', label: 'Faster Delivery', desc: 'Compared to traditional agencies' },
  { num: 7, suffix: '', label: 'Disciplines', desc: 'One studio. Complete coverage.' },
]

const testimonials = [
  {
    text: 'Openflow delivered our full brand identity and website in 3 weeks. The quality blew us away — it looked like it cost 10× what we paid.',
    name: 'Alex M.',
    role: 'Founder, TechLaunch',
    accent: '#00f0ff',
  },
  {
    text: 'We needed a smart contract + DeFi platform in record time. Flow guided the whole process. Shipped on time, no bugs, no drama.',
    name: 'Jordan K.',
    role: 'CTO, CryptoVault',
    accent: '#7b2fff',
  },
  {
    text: 'The AI integration Openflow built for our CRM completely changed how our team works. ROI was visible within 30 days of launch.',
    name: 'Priya S.',
    role: 'CEO, Automate.io',
    accent: '#0088ff',
  },
]

const differentiators = [
  {
    icon: '⚡',
    title: 'Warp-Speed Delivery',
    desc: 'We ship fast without cutting corners. Proven workflows, AI-assisted development, and no unnecessary meetings.',
    color: '#00f0ff',
  },
  {
    icon: '◈',
    title: 'AI-Powered Everything',
    desc: 'We use the latest AI tools internally and build them into your product. Every project benefits from the cutting edge.',
    color: '#7b2fff',
  },
  {
    icon: '◎',
    title: 'Premium at Every Price',
    desc: 'Agency-level quality without agency-level pricing. We believe everyone deserves a great digital product.',
    color: '#0088ff',
  },
  {
    icon: '⬡',
    title: 'Full Ownership',
    desc: 'You own everything. Code, design, IP. No lock-in, no dependencies on our platform — your product, your rules.',
    color: '#00f0ff',
  },
]

// ─── Animated Counter ─────────────────────────────────────────────────
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0)
  const triggered = useRef(false)
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true
          const start = Date.now()
          const duration = 1800

          const tick = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(ease * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    if (elRef.current) observer.observe(elRef.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={elRef} className="font-display font-bold text-gradient" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}>
      {value}{suffix}
    </div>
  )
}

export default function Stats() {
  return (
    <section
      id="why"
      className="relative py-32 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #080215, #050510, #0a0520)' }}
    >
      <div className="orb absolute top-0 left-1/2 w-[600px] h-[300px] pointer-events-none"
           style={{ background: 'rgba(0,240,255,0.06)', transform: 'translate(-50%, -40%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Stats row */}
        <div className="reveal text-center mb-24">
          <div className="section-label justify-center mb-5">Why Openflow</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-14">
            Numbers don't<br />
            <span className="text-gradient">lie.</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="reveal text-center">
                <Counter target={s.num} suffix={s.suffix} />
                <div className="font-display font-semibold text-white/90 mt-2 mb-1">{s.label}</div>
                <div className="text-white/40 text-xs leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiators */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
          {differentiators.map((d, i) => (
            <div
              key={d.title}
              className="reveal glass glass-hover gradient-border rounded-2xl p-6"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div
                className="text-3xl mb-4"
                style={{ color: d.color, filter: `drop-shadow(0 0 8px ${d.color}80)` }}
              >
                {d.icon}
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{d.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="reveal mb-6 text-center">
          <div className="section-label justify-center">What Clients Say</div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="reveal glass gradient-border rounded-2xl p-7"
              style={{
                border: `1px solid ${t.accent}20`,
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              {/* Quote mark */}
              <div
                className="font-display font-bold text-4xl leading-none mb-4"
                style={{ color: t.accent, opacity: 0.5 }}
              >
                "
              </div>
              <p className="text-white/70 leading-relaxed mb-6 text-sm">{t.text}</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm"
                  style={{ background: `${t.accent}20`, color: t.accent }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-display font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
