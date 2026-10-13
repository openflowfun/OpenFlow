import { useEffect, useRef, MutableRefObject } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

interface NavbarProps {
  lenisRef: MutableRefObject<Lenis | null>
}

const links = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ lenisRef }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null)
  const isScrolled = useRef(false)

  useEffect(() => {
    // Slide in on load
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' }
    )

    // Glass effect on scroll
    const onScroll = () => {
      if (!navRef.current) return
      if (window.scrollY > 60 && !isScrolled.current) {
        isScrolled.current = true
        navRef.current.classList.add('nav-scrolled')
      } else if (window.scrollY <= 60 && isScrolled.current) {
        isScrolled.current = false
        navRef.current.classList.remove('nav-scrolled')
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target as HTMLElement, { offset: -80 })
    }
  }

  return (
    <>
      <style>{`
        nav { transition: background 0.4s, backdrop-filter 0.4s, box-shadow 0.4s, border-color 0.4s; }
        nav.nav-scrolled {
          background: rgba(5,5,16,0.85) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(0,240,255,0.1);
        }
      `}</style>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group"
            onClick={(e) => { e.preventDefault(); lenisRef.current?.scrollTo(0) }}
          >
            <img
              src="./logo-mark.png"
              alt="Openflow"
              className="w-9 h-9 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' }}
            />
            <span
              className="font-display font-bold text-xl tracking-tight"
              style={{
                background: 'linear-gradient(90deg, #00f0ff, #0088ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              openflow
            </span>
          </a>

          {/* Nav links – desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollTo(e, l.href)}
                className="font-display text-sm font-medium tracking-wide text-white/60 hover:text-white transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-flow to-blue-mid transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => scrollTo(e, '#contact')}
            className="btn-primary text-sm px-6 py-3"
          >
            Start a Project
          </a>
        </div>
      </nav>
    </>
  )
}
