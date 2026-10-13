import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Discovery & Vision',
    desc: 'We dive deep into your idea, goals, and market. Flow analyzes the landscape and maps out exactly what needs to be built and why.',
    icon: '◉',
    color: '#00f0ff',
  },
  {
    num: '02',
    title: 'Strategy & Architecture',
    desc: 'A crystal-clear game plan — technology stack, timeline, budget, and feature scope. No surprises, no scope creep.',
    icon: '⬢',
    color: '#7b2fff',
  },
  {
    num: '03',
    title: 'Design & Prototype',
    desc: 'Premium design that makes your competition jealous. We deliver interactive prototypes so you see and feel it before a line of code is written.',
    icon: '◈',
    color: '#0088ff',
  },
  {
    num: '04',
    title: 'Build & Integrate',
    desc: 'Our engineers execute with precision. Daily progress updates, continuous integration, and quality gates at every stage.',
    icon: '◍',
    color: '#00f0ff',
  },
  {
    num: '05',
    title: 'Launch & Scale',
    desc: 'We go live, monitor performance, and optimize. Then we build the roadmap for what comes next.',
    icon: '◎',
    color: '#7b2fff',
  },
]

export default function Process() {
  const sectionRef  = useRef<HTMLElement>(null)
  const lineRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the vertical progress line
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: true,
          },
        }
      )

      // Animate each step
      steps.forEach((_, i) => {
        const stepEl = document.querySelector(`.process-step-${i}`)
        if (!stepEl) return
        gsap.fromTo(
          stepEl,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepEl,
              start: 'top 78%',
            },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050510, #0a0520)' }}
    >
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="orb absolute right-0 top-1/3 w-[500px] h-[500px] pointer-events-none"
           style={{ background: 'rgba(0,136,255,0.06)', transform: 'translate(30%, 0)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <div className="reveal text-center mb-20">
          <div className="section-label justify-center mb-5">How We Flow</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight">
            From idea to launch,<br />
            <span className="text-gradient">step by step.</span>
          </h2>
          <p className="text-white/50 mt-5 max-w-lg mx-auto">
            Our battle-tested process has been refined across 50+ projects.
            It's how we deliver consistently and without surprises.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative flex">
          {/* Vertical line */}
          <div className="hidden md:flex flex-col items-center mr-10 pt-2">
            <div className="w-px flex-1 relative overflow-hidden" style={{ background: 'rgba(0,240,255,0.1)' }}>
              <div
                ref={lineRef}
                className="absolute inset-0 origin-top"
                style={{ background: 'linear-gradient(to bottom, #00f0ff, #7b2fff, #0088ff)' }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="flex-1 space-y-14">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`process-step-${i} flex gap-6 md:gap-8 items-start`}
              >
                {/* Number + dot */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-sm relative"
                    style={{
                      background: `${step.color}12`,
                      border: `1px solid ${step.color}30`,
                      color: step.color,
                      boxShadow: `0 0 20px ${step.color}15`,
                    }}
                  >
                    <span className="text-2xl">{step.icon}</span>
                    {/* Connector dot (for mobile / inline line) */}
                    <div
                      className="absolute -left-[54px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full hidden md:block"
                      style={{ background: step.color, boxShadow: `0 0 12px ${step.color}` }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex-1 glass glass-hover gradient-border rounded-2xl p-7"
                  style={{ border: `1px solid ${step.color}15` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="font-display font-bold text-xs tracking-widest"
                      style={{ color: step.color }}
                    >
                      {step.num}
                    </span>
                    <h3 className="font-display font-semibold text-xl text-white">{step.title}</h3>
                  </div>
                  <p className="text-white/55 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="reveal mt-20 text-center">
          <p className="text-white/50 mb-6">Ready to start your project?</p>
          <a href="#contact" className="btn-primary">
            Let's Begin — Step 01
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
