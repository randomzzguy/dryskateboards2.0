"use client"

import { useEffect, useRef, useState } from "react"
import ThemeToggle from "./ui/ThemeToggle"

export default function DrySkateboards() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    let frame: number | null = null
    const handleScroll = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        frame = null
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  // Animated grain canvas
  useEffect(() => {
    const canvas = noiseCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const W = 160
    const H = 160
    canvas.width = W
    canvas.height = H
    const imageData = ctx.createImageData(W, H)
    function drawNoise() {
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 28 | 0
        d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 35
      }
      ctx!.putImageData(imageData, 0, 0)
    }
    drawNoise()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const intervalId = window.setInterval(drawNoise, 100)
    return () => window.clearInterval(intervalId)
  }, [])

  // Intersection observer for scroll-reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const isVisible = (id: string) => visibleSections.has(id)

  const colorStripe = (
    <div className="flex w-full h-[8px] border-y-2" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex-[2]" style={{ background: "var(--color-charcoal)" }} />
      <div className="flex-[3]" style={{ background: "var(--color-primary)" }} />
      <div className="flex-[2]" style={{ background: "var(--color-secondary)" }} />
      <div className="flex-[1]" style={{ background: "var(--color-border)" }} />
    </div>
  )

  const products = [
    {
      name: "TAG MARK TEE",
      price: "AED 180",
      tag: "APPAREL",
      img: "/assets/shirt.jpg",
      desc: "Oversized tee, red tag on back",
    },
    {
      name: "HEAT DECK 8.25\"",
      price: "AED 350",
      tag: "BOARDS",
      img: "/assets/board-logo.jpg",
      desc: "7-ply Canadian maple, desert pressed",
    },
    {
      name: "DRY TOTE BAG",
      price: "AED 120",
      tag: "ACCESSORIES",
      img: "/assets/bags.jpg",
      desc: "Kraft paper bag with tag mark print",
    },
  ]

  const marqueeItems = [
    "DRY SKATEBOARDS",
    "BORN IN THE HEAT",
    "ABU DHABI, UAE",
    "EST. 2024",
    "BOARD GOODS",
    "STREETWEAR",
    "EMIRATI-OWNED",
    "Y2026",
  ]

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "var(--color-background)", color: "var(--color-foreground)", fontFamily: "'News Gothic MT', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}
    >
      {/* Animated grain overlay */}
      <canvas
        ref={noiseCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[100]"
        style={{ mixBlendMode: "screen", opacity: 0.16, imageRendering: "pixelated" }}
        aria-hidden="true"
      />

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b-2"
        style={{
          background: "rgba(10, 10, 10, 0.95)",
          borderColor: "var(--color-primary)",
          backdropFilter: "blur(8px)"
        }}
      >
        {/* Raw logo */}
        <div 
          className="px-4 py-2 border-2"
          style={{ 
            borderColor: "var(--color-primary)", 
            background: "transparent"
          }}
        >
          <span
            className="text-xs tracking-[0.3em] uppercase font-bold"
            style={{ 
              color: "var(--color-foreground)",
              fontFamily: "var(--font-display)"
            }}
          >
            DRY SKATEBOARDS
          </span>
        </div>

        <div className="hidden md:flex gap-1">
          {["Boards", "Apparel", "About", "Shop"].map((item, i) => (
            <button
              key={item}
              className="px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold border-2 transition-all duration-150 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]"
              style={{ 
                color: "var(--color-foreground)", 
                borderColor: "var(--color-border)",
                background: "transparent",
                fontFamily: "var(--font-display)"
              }}
              onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div 
            className="px-4 py-2 border-2 font-bold"
            style={{ 
              borderColor: "var(--color-primary)",
              background: "transparent",
              color: "var(--color-primary)",
              fontFamily: "var(--font-display)"
            }}
          >
            2026
          </div>
          <ThemeToggle />
        </div>

        <button
          className="md:hidden p-3 border-2"
          style={{ borderColor: "var(--color-primary)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-[4px]">
            {[0, 1, 2].map((n) => (
              <span
                key={n}
                className="block w-6 h-[2px] transition-all duration-200"
                style={{
                  background: "var(--color-primary)",
                  transform: menuOpen
                    ? n === 0 ? "rotate(45deg) translate(4px, 4px)"
                    : n === 2 ? "rotate(-45deg) translate(4px, -4px)"
                    : ""
                    : "",
                  opacity: menuOpen && n === 1 ? 0 : 1,
                }}
              />
            ))}
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-4 md:hidden"
        style={{
          background: "var(--color-background)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          transform: menuOpen ? "translateY(0)" : "translateY(-24px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        {["Boards", "Apparel", "About", "Shop"].map((item, i) => (
          <button
            key={item}
            className="text-4xl font-black uppercase tracking-widest px-8 py-4 border-4 transition-all duration-150 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]"
            style={{
              color: "var(--color-foreground)",
              borderColor: "var(--color-border)",
              background: "transparent",
              fontFamily: "var(--font-urban)",
              transform: menuOpen ? "translateX(0)" : "translateX(-30px)",
              opacity: menuOpen ? 1 : 0,
              transition: `transform 0.3s ease ${i * 0.05}s, opacity 0.3s ease ${i * 0.05}s`,
            }}
            onClick={() => {
              setMenuOpen(false)
              document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* ── HERO ── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ 
          background: "var(--color-background)",
          backgroundImage: "linear-gradient(180deg, var(--color-background) 0%, #1a1a1a 100%)"
        }}
      >
        {/* Raw urban texture overlay */}
        <div className="urban-grid absolute inset-0 opacity-35" aria-hidden="true" />

        {/* Asymmetric layout */}
        <div className="relative z-10 w-full px-6 md:px-16 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Raw badge */}
            <div className="mb-8">
              <div 
                className="inline-block px-4 py-2 border-2"
                style={{ 
                  borderColor: "var(--color-primary)", 
                  background: "transparent"
                }}
              >
                <span className="text-xs tracking-[0.4em] uppercase" style={{ color: "var(--color-primary)" }}>
                  EST. 2024 — ABU DHABI
                </span>
              </div>
            </div>

            {/* Main rebellious title */}
            <div className="relative">
              <h1
                className="text-7xl md:text-[14rem] font-black uppercase leading-none tracking-tighter"
                style={{
                  fontFamily: "var(--font-urban)",
                  color: "var(--color-foreground)",
                  lineHeight: "0.85",
                  letterSpacing: "-0.05em"
                }}
              >
                BORN IN
              </h1>
              <h1
                className="text-7xl md:text-[14rem] font-black uppercase leading-none tracking-tighter mt-2"
                style={{
                  fontFamily: "var(--font-urban)",
                  color: "var(--color-primary)",
                  lineHeight: "0.85",
                  letterSpacing: "-0.05em",
                  WebkitTextStroke: "1px var(--color-foreground)"
                }}
              >
                THE HEAT
              </h1>
              
              {/* Urban accent elements */}
              <div className="absolute -top-4 -right-8 w-32 h-32 border-4" style={{ 
                borderColor: "var(--color-primary)",
                opacity: 0.3
              }} />
              <div className="absolute bottom-8 -left-4 w-24 h-24" style={{ 
                background: "var(--color-secondary)",
                opacity: 0.1
              }} />
            </div>

            {/* Raw subtitle */}
            <div className="mt-12 max-w-2xl">
              <p className="text-lg md:text-xl leading-relaxed" style={{ 
                color: "var(--color-muted-foreground)",
                fontFamily: "var(--font-display)",
                fontWeight: "500"
              }}>
                EMIRATI-OWNED SKATE & STREETWEAR. BOARD GOODS, CLOTHING, ACCESSORIES.
              </p>
              <p className="text-lg md:text-xl leading-relaxed mt-2" style={{ 
                color: "var(--color-primary)",
                fontFamily: "var(--font-display)",
                fontWeight: "700"
              }}>
                MADE FOR THE STREET. SHAPED BY THE DESERT.
              </p>
            </div>

            {/* Bold CTAs */}
            <div className="mt-16 flex flex-col sm:flex-row gap-4">
              <button
                className="px-12 py-5 text-sm tracking-[0.2em] uppercase font-bold border-4 transition-all duration-200 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]"
                style={{ 
                  borderColor: "var(--color-primary)", 
                  background: "transparent",
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-display)",
                  minWidth: "200px"
                }}
                onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
              >
                SHOP NOW
              </button>
              <button
                className="px-12 py-5 text-sm tracking-[0.2em] uppercase font-bold border-4 transition-all duration-200 hover:bg-[var(--color-secondary)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary-foreground)]"
                style={{ 
                  borderColor: "var(--color-secondary)", 
                  background: "transparent",
                  color: "var(--color-secondary)",
                  fontFamily: "var(--font-display)",
                  minWidth: "200px"
                }}
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              >
                OUR STORY
              </button>
            </div>
          </div>
        </div>

        {/* Raw scroll indicator */}
        <div
          className="absolute bottom-8 left-8 flex flex-col items-start gap-2"
          style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
        >
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--color-muted-foreground)" }}>SCROLL</span>
          <div className="w-16 h-1" style={{ background: "var(--color-primary)" }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div
        className="relative overflow-hidden py-6 border-y-4"
        style={{ 
          background: "var(--color-primary)", 
          borderColor: "var(--color-border)"
        }}
      >
        <div
          className="flex gap-20 whitespace-nowrap"
          style={{ animation: "marquee 15s linear infinite" }}
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-sm font-bold tracking-[0.2em] uppercase shrink-0"
              style={{ 
                color: "var(--color-primary-foreground)",
                fontFamily: "var(--font-display)"
              }}
            >
              {item}
              <span className="mx-8" style={{ color: "var(--color-secondary)" }}>///</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STREET CULTURE / ABOUT ── */}
      <section id="about" data-reveal className="relative overflow-hidden border-b-4 border-[var(--color-border)] bg-[var(--color-background)] px-6 py-24 md:px-16">
        <div className="urban-grid absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div
            className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0"
            style={{
              opacity: isVisible("about") ? 1 : 0,
              transform: isVisible("about") ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <div className="relative z-10 flex flex-col justify-between border-4 border-[var(--color-foreground)] bg-[var(--color-background)] p-6 md:p-10 lg:-mr-8 lg:my-12">
              <div>
                <div className="mb-8 flex items-center justify-between border-b-2 border-[var(--color-primary)] pb-3 text-[10px] font-bold uppercase tracking-[0.35em]">
                  <span className="text-[var(--color-primary)]">01 / Our ground</span>
                  <span>AUH — UAE</span>
                </div>
                <h2 className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.06em] md:text-8xl" style={{ fontFamily: "var(--font-urban)" }}>
                  HEAT.<br />CONCRETE.<br /><span className="text-[var(--color-primary)]">NO APOLOGY.</span>
                </h2>
                <p className="mt-8 max-w-lg text-sm font-medium uppercase leading-7 tracking-[0.08em] text-[var(--color-muted-foreground)]" style={{ fontFamily: "var(--font-display)" }}>
                  Dry Skateboards is an Emirati-owned skate and streetwear label born in Abu Dhabi. Desert pressure, graffiti, asphalt and late-night sessions shape every deck, garment and graphic.
                </p>
              </div>
              <div className="mt-12 grid grid-cols-3 border-2 border-[var(--color-border)] text-center">
                {[['2024', 'Founded'], ['AUH', 'Home'], ['100%', 'Independent']].map(([value, label], i) => (
                  <div key={label} className={`p-3 ${i < 2 ? 'border-r-2 border-[var(--color-border)]' : ''}`}>
                    <strong className="block text-xl text-[var(--color-primary)]" style={{ fontFamily: "var(--font-urban)" }}>{value}</strong>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="about-img" data-reveal className="relative min-h-[520px] overflow-hidden border-4 border-[var(--color-primary)] md:min-h-[680px]">
              <img
                src="/assets/skate.jpg"
                alt="Skaters in front of graffiti tags in Abu Dhabi"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  filter: "grayscale(0.45) contrast(1.25) brightness(0.72)",
                  transform: `scale(1.08) translateY(${scrollY * 0.012}px)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
              <div className="absolute right-0 top-0 bg-[var(--color-primary)] px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-white">Field notes / 001</div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 border-t-2 border-white pt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white md:bottom-10 md:left-10 md:right-10">
                <span>Street level / Abu Dhabi</span>
                <span className="text-[var(--color-primary)]">25.2048° N</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MADE IN THE HEAT BANNER ── */}
      <section className="relative min-h-[420px] overflow-hidden border-b-4 border-[var(--color-primary)]" data-reveal id="banner">
        <img
          src="/assets/made-in-heat.jpg"
          alt="MADE IN THE HEAT — DRY SKATEBOARDS"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: "center",
            transform: `scale(1.04) translateY(${scrollY * 0.03}px)`,
            transition: "transform 0.05s linear",
            filter: "contrast(1.2) saturate(0.9)",
          }}
        />
        <div className="absolute inset-x-0 top-6 flex rotate-[-2deg] justify-center bg-white py-2 text-center text-xs font-black uppercase tracking-[0.3em] text-black shadow-[0_5px_0_#ff0000]">
          Made in the heat /// Made in the heat /// Made in the heat
        </div>
        <span className="absolute bottom-5 right-5 border-2 border-white bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white">Campaign / Y2026</span>
      </section>

      {/* ── PRODUCTS ── */}
      <section
        id="shop"
        data-reveal
        className="urban-grid px-6 py-24 md:px-16"
      >
        <div
          className="mb-10 flex items-end justify-between gap-6 border-b-4 border-[var(--color-foreground)] pb-6"
          style={{
            opacity: isVisible("shop") ? 1 : 0,
            transform: isVisible("shop") ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h2
            className="text-5xl font-black uppercase tracking-tighter md:text-8xl"
            style={{ fontFamily: "var(--font-urban)" }}
          >
            NEW DROPS
          </h2>
          <span className="hidden border-2 border-[var(--color-primary)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] sm:block">
            Drop 001 / Limited
          </span>
        </div>
        {colorStripe}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mt-px" style={{ background: "var(--color-muted)" }}>
          {products.map((product, i) => (
            <div
              key={i}
              style={{
                opacity: isVisible("shop") ? 1 : 0,
                transform: isVisible("shop") ? "translateY(0)" : "translateY(50px)",
                transition: `opacity 0.8s ease ${0.15 + i * 0.12}s, transform 0.8s ease ${0.15 + i * 0.12}s`,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            className="border-4 border-[var(--color-primary)] px-12 py-4 text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] transition-all duration-200 hover:bg-[var(--color-primary)] hover:text-white"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* ── BOARDS SECTION ── */}
      <section
        id="boards"
        data-reveal
        className="border-y-4 border-[var(--color-border)] bg-[var(--color-card)] px-6 py-24 md:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid items-stretch gap-0 md:grid-cols-2">
            <div
              className="flex flex-col justify-center border-4 border-[var(--color-foreground)] p-8 md:p-12"
              style={{
                opacity: isVisible("boards") ? 1 : 0,
                transform: isVisible("boards") ? "translateX(0)" : "translateX(-40px)",
                transition: "opacity 0.9s ease, transform 0.9s ease",
              }}
            >
              <span className="mb-8 block text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-primary)]">
                02 / Board goods
              </span>
              <h2
                className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-balance"
                style={{ fontFamily: "var(--font-urban)" }}
              >
                DECK<br />THE<br />STREETS
              </h2>
              <div className="mt-6 h-1 w-24 bg-[var(--color-primary)]" style={{ animation: "expandWidth 1.2s ease 0.5s both" }} />
              <p className="mt-8 max-w-md text-sm font-medium uppercase leading-7 tracking-[0.06em] text-[var(--color-muted-foreground)]">
                7-ply Canadian maple pressed under desert conditions. Every board carries the DRY tag mark — designed to take the heat of Abu Dhabi concrete.
              </p>
              <div className="mt-8 flex gap-4 flex-wrap">
                {["8.0\"", "8.25\"", "8.5\""].map((size) => (
                  <button
                    key={size}
                    className="border-2 border-[var(--color-border)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-muted-foreground)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="relative min-h-[480px] overflow-hidden border-4 border-t-0 border-[var(--color-primary)] md:border-l-0 md:border-t-4"
              style={{
                opacity: isVisible("boards") ? 1 : 0,
                transform: isVisible("boards") ? "translateX(0) rotate(0deg)" : "translateX(40px) rotate(1deg)",
                transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
              }}
            >
              <img
                src="/assets/board-logo.jpg"
                alt="DRY Skateboards logo on lava texture"
                className="h-full w-full object-cover"
                style={{ filter: "contrast(1.25)", animation: "subtleScale 8s ease-in-out infinite alternate" }}
              />
              <div className="absolute right-4 top-4 bg-[var(--color-primary)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white">
                Heat Series / AED 350
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── APPAREL ── */}
      <section
        id="apparel"
        data-reveal
        className="bg-[var(--color-background)] px-6 py-24 md:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid items-stretch gap-0 md:grid-cols-2">
            <div
              className="relative order-2 min-h-[520px] overflow-hidden border-4 border-t-0 border-[var(--color-foreground)] md:order-1 md:border-r-0 md:border-t-4"
              style={{
                opacity: isVisible("apparel") ? 1 : 0,
                transform: isVisible("apparel") ? "translateX(0)" : "translateX(-40px)",
                transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
              }}
            >
              <img
                src="/assets/shirt.jpg"
                alt="Model wearing DRY Skateboards tag mark tee"
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(0.3) contrast(1.15) brightness(0.85)", animation: "subtleScale 10s ease-in-out infinite alternate" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-6"
                style={{ background: "linear-gradient(to top, #080808, transparent)" }}
              >
                <p className="inline-block bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black">
                  Tag Mark Tee / SS26 / AED 180
                </p>
              </div>
            </div>

            <div
              className="order-1 flex flex-col justify-center border-4 border-[var(--color-primary)] bg-[var(--color-card)] p-8 md:order-2 md:p-12"
              style={{
                opacity: isVisible("apparel") ? 1 : 0,
                transform: isVisible("apparel") ? "translateX(0)" : "translateX(40px)",
                transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
              }}
            >
              <span className="mb-8 block text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-primary)]">
                03 / Uniform
              </span>
              <h2
                className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-balance"
                style={{ fontFamily: "var(--font-urban)" }}
              >
                WEAR<br />THE<br />TAG
              </h2>
              <div className="mt-6 h-1 w-24 bg-[var(--color-primary)]" />
              <p className="mt-8 max-w-md text-sm font-medium uppercase leading-7 tracking-[0.06em] text-[var(--color-muted-foreground)]">
                Oversized silhouettes carrying the DRY tag mark. Heavy cotton, screen printed in the UAE. Built for the skate session and the street.
              </p>
              <button
                className="mt-10 self-start border-4 border-[var(--color-primary)] bg-[var(--color-primary)] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:bg-transparent hover:text-[var(--color-primary)]"
              >
                Shop Apparel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND IDENTITY / LOGOS ── */}
      <section
        data-reveal
        id="mark"
        className="border-y-4 border-[var(--color-border)] bg-[var(--color-card)] px-6 py-24 md:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <div
            className="mb-8 flex items-end justify-between border-b-4 border-[var(--color-foreground)] pb-6"
            style={{
              opacity: isVisible("mark") ? 1 : 0,
              transform: isVisible("mark") ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <h2
              className="text-5xl font-black uppercase tracking-tighter md:text-7xl"
              style={{ fontFamily: "var(--font-urban)" }}
            >
              THE MARK
            </h2>
            <span className="hidden text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] sm:block">
              04 / Visual system
            </span>
          </div>
          {colorStripe}

          <div className="mt-8 grid grid-cols-2 gap-1 bg-[var(--color-primary)] md:grid-cols-4">
            {[
              { bg: "#222222", label: "ASPHALT" },
              { bg: "#ff0000", label: "SIGNAL RED" },
              { bg: "#ffffff", label: "RAW WHITE" },
              { bg: "#050505", label: "NIGHT BLACK" },
            ].map(({ bg, label }, i) => (
              <LogoCard key={i} bg={bg} label={label} index={i} isVisible={isVisible("mark")} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BAGS / MERCH ── */}
      <section
        data-reveal
        id="bags"
        className="relative min-h-[680px] overflow-hidden border-b-4 border-[var(--color-primary)]"
      >
        <img
          src="/assets/bags.jpg"
          alt="Two people holding DRY Skateboards shopping bags"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: "center 30%",
            transform: `scale(1.04) translateY(${scrollY * 0.025}px)`,
            transition: "transform 0.05s linear",
            filter: "grayscale(0.2) contrast(1.15) brightness(0.65)",
          }}
        />
        <div
          className="absolute inset-0 flex flex-col justify-end p-6 md:p-16"
          style={{ background: "linear-gradient(to top, #050505 12%, transparent 70%)" }}
        >
          <div
            className="max-w-3xl border-l-8 border-[var(--color-primary)] bg-black/85 p-6 backdrop-blur-sm md:p-10"
            style={{
              opacity: isVisible("bags") ? 1 : 0,
              transform: isVisible("bags") ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-primary)]">
              05 / Home ground
            </span>
            <h3
              className="mt-3 text-5xl font-black uppercase leading-[0.88] tracking-tighter text-white md:text-8xl"
              style={{ fontFamily: "var(--font-urban)" }}
            >
              ABU DHABI, UAE<br />EST. 2024
            </h3>
            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-white/55">
              Board Goods / Clothing / Accessories
            </p>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER / CTA ── */}
      <section
        data-reveal
        id="cta"
        className="relative overflow-hidden border-b-4 border-[var(--color-foreground)] bg-[var(--color-primary)] px-6 py-20 md:px-16"
      >
        <div
          className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]"
          style={{
            opacity: isVisible("cta") ? 1 : 0,
            transform: isVisible("cta") ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <div>
            <div className="mb-6 inline-block border-2 border-white bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-white">
              DRY dispatch / No spam
            </div>
            <h2 className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.05em] text-white md:text-9xl" style={{ fontFamily: "var(--font-urban)", textShadow: "5px 5px 0 #000" }}>
              STAY IN<br />THE HEAT.
            </h2>
          </div>
          <div className="border-4 border-black bg-[var(--color-background)] p-6 shadow-[10px_10px_0_#fff] md:p-8">
            <p className="mb-6 text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white">
              New drops, collabs and ground-level Abu Dhabi skate culture. Straight from the source.
            </p>
            <label htmlFor="drop-email" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">Your email</label>
            <div className="flex flex-col sm:flex-row">
              <input id="drop-email" type="email" placeholder="YOU@EMAIL.COM" className="min-w-0 flex-1 border-2 border-white bg-black px-5 py-4 text-sm font-bold uppercase text-white outline-none placeholder:text-white/35 focus:border-[var(--color-primary)]" />
              <button type="button" className="border-2 border-white bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white">
                Join the drop
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative overflow-hidden bg-[#050505] px-6 pb-8 pt-16 md:px-16">
        <div className="urban-grid absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-14 grid gap-12 border-b-2 border-[var(--color-border)] pb-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--color-primary)]">Built under pressure / Abu Dhabi</p>
              <h2 className="text-7xl font-black uppercase leading-[0.75] tracking-[-0.07em] text-white md:text-[10rem]" style={{ fontFamily: "var(--font-urban)" }}>
                DRY<span className="text-[var(--color-primary)]">.</span>
              </h2>
              <p className="mt-8 max-w-md text-xs font-bold uppercase leading-6 tracking-[0.1em] text-white/45">
                Independent Emirati skateboarding and streetwear. Board goods, clothing and objects for life at street level.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-xs md:grid-cols-3">
              {[
                { title: "Shop", links: [["Boards", "#boards"], ["Apparel", "#apparel"], ["New drops", "#shop"], ["Accessories", "#shop"]] },
                { title: "Brand", links: [["Our story", "#about"], ["The mark", "#mark"], ["Campaigns", "#banner"], ["Stockists", "#cta"]] },
                { title: "Social", links: [["Instagram ↗", "#"], ["TikTok ↗", "#"], ["YouTube ↗", "#"], ["Contact", "mailto:hello@dryskateboards.com"]] },
              ].map(({ title, links }) => (
                <div key={title}>
                  <p className="mb-5 border-b-2 border-[var(--color-primary)] pb-3 font-bold uppercase tracking-[0.25em] text-white">{title}</p>
                  <ul className="space-y-3">
                    {links.map(([label, href]) => (
                      <li key={label}>
                        <a href={href} className="font-bold uppercase tracking-[0.12em] text-white/45 transition-colors hover:text-[var(--color-primary)]">{label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10 overflow-hidden border-y-2 border-white bg-[var(--color-primary)] py-3">
            <div className="footer-marquee flex w-max gap-12 whitespace-nowrap text-sm font-black uppercase tracking-[0.25em] text-white">
              {[0, 1].map((group) => (
                <span key={group} aria-hidden={group === 1}>BORN IN THE HEAT /// MADE FOR THE STREET /// ABU DHABI, UAE /// EST. 2024 ///</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 text-[9px] font-bold uppercase tracking-[0.22em] text-white/35 md:flex-row md:items-center">
            <span>© 2026 Dry Skateboards. All rights reserved.</span>
            <span className="text-[var(--color-primary)]">25.2048° N / 55.2708° E</span>
            <div className="flex gap-5"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a><span>Y2026 / V.01</span></div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes heroFloat {
          0%   { transform: translateY(0px) rotate(0deg); }
          33%  { transform: translateY(-10px) rotate(-0.3deg); }
          66%  { transform: translateY(-5px) rotate(0.2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes ambientPulse {
          0%   { opacity: 0.7; transform: scale(1); }
          50%  { opacity: 1;   transform: scale(1.08); }
          100% { opacity: 0.6; transform: scale(0.96); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
        @keyframes subtleScale {
          0%   { transform: scale(1); }
          100% { transform: scale(1.03); }
        }
        @keyframes expandWidth {
          from { width: 0; }
          to   { width: 6rem; }
        }
        @keyframes textFlicker {
          0%, 92%, 100% { opacity: 1; }
          93%            { opacity: 0.85; }
          95%            { opacity: 1; }
          97%            { opacity: 0.9; }
        }
        @keyframes ctaShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes logoHover {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-4px) rotate(-0.5deg); }
        }
        @keyframes footerMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-50% - 1.5rem)); }
        }
        .urban-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
            repeating-linear-gradient(115deg, transparent 0 84px, rgba(255,0,0,0.025) 84px 86px);
          background-size: 48px 48px, 48px 48px, auto;
        }
        .footer-marquee { animation: footerMarquee 14s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .footer-marquee { animation: none; }
        }
        html { scroll-behavior: smooth; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </main>
  )
}

function ProductCard({ product }: { product: { name: string; price: string; tag: string; img: string; desc: string } }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden cursor-pointer border-4"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-border)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hovered ? "8px 8px 0px var(--color-primary)" : "4px 4px 0px var(--color-border)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Raw accent line */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: "var(--color-primary)" }} />

      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.3s ease",
            filter: hovered ? "contrast(1.1) grayscale(0.2)" : "contrast(1) grayscale(0.4)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, var(--color-card) 30%, transparent 70%)`,
            opacity: hovered ? 0.9 : 0.7,
            transition: "opacity 0.2s ease",
          }}
        />
        <div
          className="absolute top-4 left-4 px-4 py-2 text-[10px] tracking-[0.3em] uppercase font-bold border-2"
          style={{ 
            background: "var(--color-background)", 
            color: "var(--color-primary)",
            borderColor: "var(--color-primary)"
          }}
        >
          {product.tag}
        </div>
      </div>

      <div className="p-6 border-t-2" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-baseline justify-between mb-3">
          <h3
            className="text-xl font-black uppercase tracking-tighter"
            style={{ 
              fontFamily: "var(--font-urban)",
              color: "var(--color-foreground)"
            }}
          >
            {product.name}
          </h3>
          <span 
            className="text-lg font-bold px-3 py-1 border-2"
            style={{ 
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              background: "transparent",
              fontFamily: "var(--font-display)"
            }}
          >
            {product.price}
          </span>
        </div>
        <p className="text-xs mb-4 leading-relaxed" style={{ 
          color: "var(--color-muted-foreground)",
          fontFamily: "var(--font-display)"
        }}>
          {product.desc}
        </p>
        <button
          className="w-full py-4 text-xs tracking-[0.2em] uppercase font-bold border-4 transition-all duration-150 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]"
          style={{
            background: "transparent",
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
            fontFamily: "var(--font-display)"
          }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  )
}

function LogoCard({ bg, label, index, isVisible }: { bg: string; label: string; index: number; isVisible: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="flex items-center justify-center aspect-video relative overflow-hidden cursor-pointer"
      style={{
        background: bg,
        transform: hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.4s ease",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 0.1}s`,
        transitionProperty: "opacity, transform",
        transitionDuration: "0.8s, 0.4s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src="/assets/dry-logos.jpg"
        alt={`DRY Skateboards logo — ${label}`}
        className="w-3/5 h-auto object-contain"
        style={{
          filter: index === 3 ? "brightness(10)" : index === 2 ? "invert(1) brightness(0.3)" : "none",
          transform: hovered ? "scale(1.06) rotate(-1deg)" : "scale(1) rotate(0deg)",
          transition: "transform 0.5s ease",
          animation: "logoHover 5s ease-in-out infinite",
          animationDelay: `${index * 0.8}s`,
        }}
      />
      <span
        className="absolute bottom-2 left-3 text-[8px] tracking-widest uppercase"
        style={{ color: index === 2 ? "#33333380" : "#ffffff30" }}
      >
        {label}
      </span>
    </div>
  )
}
