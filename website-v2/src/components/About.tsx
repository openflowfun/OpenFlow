import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const charRef    = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Character slides in from right
      gsap.fromTo(charRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )

      // Text lines cascade in
      const lines = textRef.current?.querySelectorAll('.text-line')
      gsap.fromTo(lines,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050510 0%, #080215 60%, #0a0520 100%)' }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Orb */}
      <div className="orb absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
           style={{ background: 'rgba(123,47,255,0.07)', transform: 'translate(20%, -20%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: text */}
          <div ref={textRef}>
            <div className="text-line section-label mb-6">The Story of Flow</div>

            <h2 className="text-line font-display font-bold text-4xl md:text-5xl leading-tight mb-8 text-white">
              A digital studio<br />
              <span className="text-gradient">built for builders.</span>
            </h2>

            <div className="space-y-5 text-white/60 leading-relaxed">
              <p className="text-line">
                Openflow was born from one simple belief: great digital work shouldn't take forever or cost a fortune.
                We combine cutting-edge technology with deep creative instinct to deliver digital experiences that
                actually move the needle.
              </p>
              <p className="text-line">
                Meet Flow — our digital mascot and the spirit behind every project. A constellation-cloaked guardian
                of the digital realm, Flow embodies what we stand for: agility, intelligence, and the kind of energy
                that makes things happen.
              </p>
              <p className="text-line">
                From a solo MVP to a full brand ecosystem — we build anything digital, fast, and with relentless
                attention to quality.
              </p>
            </div>

            <div className="text-line mt-10 flex flex-wrap gap-4">
              <a href="#services" className="btn-ghost">
                What We Build
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

            {/* Values chips */}
            <div className="text-line mt-10 flex flex-wrap gap-3">
              {['Fast Delivery', 'AI-Powered', 'Crypto Native', 'Full Stack', 'Brand Forward'].map((v) => (
                <span
                  key={v}
                  className="px-4 py-2 text-xs font-medium tracking-wide rounded-full font-display"
                  style={{
                    background: 'rgba(0,240,255,0.08)',
                    border: '1px solid rgba(0,240,255,0.2)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Flow character */}
          <div ref={charRef} className="relative flex justify-center">
            {/* Glow rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[280, 340, 400].map((size, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    border: `1px solid rgba(0,240,255,${0.12 - i * 0.03})`,
                    animation: `ring-pulse ${3 + i}s ease-out infinite ${i * 0.8}s`,
                  }}
                />
              ))}
            </div>

            {/* Character image */}
            <div
              className="relative w-72 md:w-80 rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(123,47,255,0.08))',
                border: '1px solid rgba(0,240,255,0.2)',
                boxShadow: '0 0 60px rgba(0,240,255,0.15), 0 0 120px rgba(123,47,255,0.1)',
                animation: 'float 5s ease-in-out infinite',
              }}
            >
              <img
                src="./flow-hero.png"
                alt="Flow — Openflow's digital mascot"
                className="w-full object-cover"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.6)) drop-shadow(0 0 40px rgba(0,136,255,0.3))',
                  background: 'linear-gradient(160deg, #1a0b2e, #0a0520)',
                }}
              />
              {/* Inner glow overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 80%, rgba(0,240,255,0.15) 0%, transparent 70%)',
                }}
              />
            </div>

            {/* Floating tag */}
            <div
              className="absolute bottom-4 right-4 px-4 py-2 rounded-xl glass text-xs font-display font-semibold tracking-wide"
              style={{ color: '#00f0ff', border: '1px solid rgba(0,240,255,0.25)' }}
            >
              ✦ The Flow
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
