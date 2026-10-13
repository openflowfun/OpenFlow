import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: '◈',
    title: 'Modern Websites & Landing Pages',
    desc: 'Blazing-fast, conversion-optimised web experiences that make your brand impossible to ignore.',
    tags: ['React', 'Next.js', 'Webflow', 'Framer'],
    color: '#00f0ff',
  },
  {
    icon: '⬡',
    title: 'Mobile & Web Applications',
    desc: 'Full-stack apps built to scale — from MVP to enterprise-grade platforms.',
    tags: ['React Native', 'Flutter', 'Node.js', 'Supabase'],
    color: '#7b2fff',
  },
  {
    icon: '◉',
    title: 'Game Development',
    desc: 'Immersive 2D/3D games and interactive experiences for web, mobile and beyond.',
    tags: ['Unity', 'Godot', 'Three.js', 'WebGL'],
    color: '#0088ff',
  },
  {
    icon: '◍',
    title: 'Logo & Full Brand Identity',
    desc: 'Brands that command attention — logos, typography, colours, guidelines and full visual systems.',
    tags: ['Strategy', 'Identity', 'Motion', 'Print'],
    color: '#00f0ff',
  },
  {
    icon: '⬢',
    title: 'AI Integrations & Automations',
    desc: 'Supercharge your product with smart AI features, chatbots, workflows and custom LLM integrations.',
    tags: ['OpenAI', 'Anthropic', 'LangChain', 'n8n'],
    color: '#7b2fff',
  },
  {
    icon: '◈',
    title: 'Crypto & Blockchain Solutions',
    desc: 'Smart contracts, DeFi protocols, NFT platforms, and Web3 product development from the ground up.',
    tags: ['Solidity', 'EVM', 'Solana', 'IPFS'],
    color: '#0088ff',
  },
  {
    icon: '◎',
    title: 'Digital Marketing',
    desc: 'Data-driven marketing that drives real growth — SEO, paid ads, social strategy and analytics.',
    tags: ['SEO', 'Meta Ads', 'Analytics', 'Content'],
    color: '#00f0ff',
  },
]

// ─── 3D tilt card hook ───────────────────────────────────────────────
function useTilt() {
  const cardRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5  // -0.5 to 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale3d(1.02,1.02,1.02)`
    cardRef.current.style.transition = 'transform 0.05s linear'
  }

  const onLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)'
    cardRef.current.style.transition = 'transform 0.5s ease'
  }

  return { cardRef, onMove, onLeave }
}

function ServiceCard({ svc, index }: { svc: typeof services[0]; index: number }) {
  const { cardRef, onMove, onLeave } = useTilt()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={() => { onLeave(); setHovered(false) }}
      onMouseEnter={() => setHovered(true)}
      className="reveal gradient-border glass glass-hover rounded-2xl p-7 cursor-pointer"
      style={{ transitionDelay: `${index * 0.06}s`, willChange: 'transform' }}
    >
      {/* Icon */}
      <div
        className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center font-display text-2xl"
        style={{
          background: `${svc.color}15`,
          border: `1px solid ${svc.color}30`,
          color: svc.color,
          boxShadow: hovered ? `0 0 20px ${svc.color}30` : 'none',
          transition: 'box-shadow 0.3s',
        }}
      >
        {svc.icon}
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-lg text-white mb-3 leading-snug">
        {svc.title}
      </h3>

      {/* Description */}
      <p className="text-white/55 text-sm leading-relaxed mb-5">{svc.desc}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {svc.tags.map((t) => (
          <span
            key={t}
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              background: `${svc.color}10`,
              color: `${svc.color}cc`,
              border: `1px solid ${svc.color}20`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px rounded-full transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${svc.color}, transparent)`,
          opacity: hovered ? 0.8 : 0.2,
        }}
      />
    </div>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.services-heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-32"
      style={{ background: '#050510' }}
    >
      <div className="orb absolute top-1/2 left-0 w-[400px] h-[400px] pointer-events-none"
           style={{ background: 'rgba(0,240,255,0.05)', transform: 'translate(-30%, -50%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <div className="services-heading text-center mb-16">
          <div className="section-label justify-center mb-5">What We Build</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight">
            Every digital discipline,<br />
            <span className="text-gradient">one studio.</span>
          </h2>
          <p className="text-white/50 mt-5 max-w-xl mx-auto leading-relaxed">
            From concept to launch and beyond — we cover every angle of the digital landscape
            so you never need to go anywhere else.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <div key={svc.title} className={i === 6 ? 'lg:col-start-2' : ''}>
              <ServiceCard svc={svc} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
