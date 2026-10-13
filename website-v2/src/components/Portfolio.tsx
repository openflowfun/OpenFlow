import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    title: 'NovaDEX',
    category: 'Crypto & DeFi',
    desc: 'A next-gen decentralised exchange with cross-chain swaps, real-time analytics, and a sleek Web3 trading interface.',
    tags: ['DeFi', 'Solidity', 'React', 'Web3'],
    gradient: 'linear-gradient(135deg, #0b1a3d 0%, #1a0b2e 50%, #0a0520 100%)',
    accent: '#00f0ff',
    year: '2024',
  },
  {
    id: 2,
    title: 'Aura AI',
    category: 'AI Integration',
    desc: 'An enterprise AI copilot platform integrating GPT-4, custom fine-tuning, and workflow automation for B2B teams.',
    tags: ['OpenAI', 'Next.js', 'LangChain', 'SaaS'],
    gradient: 'linear-gradient(135deg, #0a0520 0%, #7b2fff20 50%, #0b1a3d 100%)',
    accent: '#7b2fff',
    year: '2024',
  },
  {
    id: 3,
    title: 'Blaze Studio',
    category: 'Brand Identity',
    desc: 'Full brand identity for a creative production agency — logo, motion system, typography, and a launch-ready website.',
    tags: ['Branding', 'Motion', 'Website', 'Strategy'],
    gradient: 'linear-gradient(135deg, #1a0b2e 0%, #0b1a3d 100%)',
    accent: '#0088ff',
    year: '2024',
  },
  {
    id: 4,
    title: 'Vortex Run',
    category: 'Game Development',
    desc: 'An addictive hyper-casual mobile game with procedurally-generated levels, global leaderboards, and in-app purchases.',
    tags: ['Unity', 'C#', 'iOS', 'Android'],
    gradient: 'linear-gradient(135deg, #0a0520 0%, #1a0b2e 60%, #050510 100%)',
    accent: '#00f0ff',
    year: '2023',
  },
  {
    id: 5,
    title: 'PulseHealth',
    category: 'Web Application',
    desc: 'A telemedicine platform connecting patients with doctors — real-time video, prescription management, and EHR sync.',
    tags: ['React', 'WebRTC', 'Node.js', 'HIPAA'],
    gradient: 'linear-gradient(135deg, #0b1a3d 0%, #0a0520 100%)',
    accent: '#7b2fff',
    year: '2023',
  },
  {
    id: 6,
    title: 'Orbit Launch',
    category: 'Marketing & SEO',
    desc: 'A full-funnel digital marketing campaign that took a fintech startup from 0 to 50k users in 90 days.',
    tags: ['SEO', 'Meta Ads', 'Content', 'Analytics'],
    gradient: 'linear-gradient(135deg, #1a0b2e 0%, #0b1a3d 100%)',
    accent: '#0088ff',
    year: '2023',
  },
]

function ProjectModal({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(5,5,16,0.92)', backdropFilter: 'blur(16px)' }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden glass"
          style={{ border: `1px solid ${project.accent}30` }}
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        >
          {/* Hero area */}
          <div
            className="h-56 relative flex items-center justify-center"
            style={{ background: project.gradient }}
          >
            <div
              className="font-display font-bold text-5xl"
              style={{
                background: `linear-gradient(90deg, ${project.accent}, #ffffff)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {project.title}
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="section-label">{project.category}</span>
              <span className="text-white/25 text-xs">•</span>
              <span className="text-white/40 text-xs">{project.year}</span>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">{project.desc}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{
                    background: `${project.accent}15`,
                    color: project.accent,
                    border: `1px solid ${project.accent}25`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <a href="#contact" onClick={onClose} className="btn-primary">
              Build Something Similar
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Portfolio() {
  const sectionRef  = useRef<HTMLElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<typeof projects[0] | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll pinning
      const track = trackRef.current
      if (!track) return

      const totalWidth = track.scrollWidth - window.innerWidth + 120

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalWidth + 200}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <section
        id="work"
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a0520, #050510, #080215)' }}
      >
        <div className="relative z-10 px-6 md:px-10 pt-32 pb-16">
          <div className="max-w-7xl mx-auto mb-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="section-label mb-5">The Work</div>
                <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight">
                  What we've built.<br />
                  <span className="text-gradient">What's possible.</span>
                </h2>
              </div>
              <p className="text-white/50 max-w-xs leading-relaxed md:text-right">
                Real projects. Real results. Click any card to explore the story.
              </p>
            </div>
          </div>

          {/* Horizontal scroll track */}
          <div ref={trackRef} className="flex gap-6 items-stretch pr-24" style={{ width: 'max-content' }}>
            {projects.map((p) => (
              <motion.div
                key={p.id}
                className="relative flex-shrink-0 w-80 md:w-96 rounded-2xl cursor-pointer overflow-hidden glass gradient-border"
                style={{
                  border: `1px solid ${p.accent}20`,
                  minHeight: '480px',
                }}
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onClick={() => setSelected(p)}
              >
                {/* Card hero */}
                <div
                  className="h-48 relative flex items-end p-6"
                  style={{ background: p.gradient }}
                >
                  <div
                    className="font-display font-bold text-3xl"
                    style={{
                      background: `linear-gradient(90deg, ${p.accent}, #fff)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${p.accent}20`, border: `1px solid ${p.accent}40` }}
                  >
                    <span style={{ color: p.accent, fontSize: 18 }}>↗</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <div className="section-label mb-3 text-xs" style={{ color: p.accent }}>
                    <span style={{ background: p.accent, width: 16, height: 1 }} />
                    {p.category}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          background: `${p.accent}10`,
                          color: `${p.accent}bb`,
                          border: `1px solid ${p.accent}20`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Drag hint */}
          <div className="mt-10 flex items-center gap-3 text-white/30 text-sm">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
              ))}
            </div>
            Scroll to explore
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
