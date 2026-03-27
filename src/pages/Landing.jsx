import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BiPencil,
  BiCube,
  BiCheck,
  BiLayout,
  BiImageAdd,
} from 'react-icons/bi'
import { HiSparkles, HiArrowRight, HiOutlinePhotograph } from 'react-icons/hi'
import FadeInSection from '@/components/Landing/FadeInSection'

// ========== Pipeline: 3 visual stages (image-first cards) ==========
const WORKFLOW_STAGES = [
  {
    image: '/landing/sketch_2d.png',
    step: '01',
    title: 'Draw 2D plan',
    desc: 'Precision walls, dimensions, doors & windows.',
  },
  {
    image: '/landing/landing1.png',
    step: '02',
    title: 'Furnish & view 3D',
    desc: 'Add furniture, then walk through your space in real time.',
  },
  {
    image: '/landing/ai_enhanced.png',
    step: '03',
    title: 'AI enhance',
    desc: 'Photorealistic render. Your layout, your style.',
  },
]

const PipelineStrip = () => (
  <div className="py-12 md:py-16">
    <div className="text-center mb-12 md:mb-14">
      <span className="pill mb-4 inline-block">One workflow</span>
      <h2 className="font-display text-3xl md:text-4xl font-normal text-[var(--landing-ink)] mb-3">
        From sketch to photorealistic render
      </h2>
      <p className="text-[var(--landing-muted)] max-w-xl mx-auto text-base md:text-lg">
        Draw your floor plan in 2D, furnish it, view in 3D, then enhance with AI—all in one seamless flow.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
      {WORKFLOW_STAGES.map((stage, i) => (
        <FadeInSection key={i}>
          <div className="group relative">
            {/* Arrow between cards (desktop) */}
            {i < 2 && (
              <div className="hidden md:flex absolute top-[45%] -right-4 lg:-right-6 z-10 text-[var(--landing-border)]">
                <HiArrowRight className="text-2xl lg:text-3xl text-[var(--landing-accent)]/50 group-hover:text-[var(--landing-accent)] transition-colors" />
              </div>
            )}
            <div className="landing-workflow-card relative overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:border-[var(--landing-accent)]/30">
              {/* Image is the hero – full visibility */}
              <div className="aspect-[4/3] relative bg-[var(--landing-border)]">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <span className="absolute top-3 left-3 w-9 h-9 rounded-full bg-[var(--landing-ink)] text-white text-sm font-bold flex items-center justify-center">
                  {stage.step}
                </span>
              </div>
              <div className="p-5 bg-white">
                <h3 className="font-semibold text-lg text-[var(--landing-ink)] mb-1">{stage.title}</h3>
                <p className="text-[var(--landing-muted)] text-sm">{stage.desc}</p>
              </div>
            </div>
          </div>
        </FadeInSection>
      ))}
    </div>
  </div>
)

// ========== 2D → 3D section (clear value) ==========
const Section2DTo3D = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <FadeInSection>
          <div className="space-y-6">
            <span className="pill">Phase 1</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-[var(--landing-ink)] leading-tight">
              2D floor plan → 3D model
            </h2>
            <p className="text-[var(--landing-muted)] text-lg leading-relaxed">
              Draw your layout with an intelligent wall engine: automatic intersection detection and precise dimensioning. Add doors, windows, and then furnish with our curated library of professional 3D furniture and fixtures—from modern to classical.
            </p>
            <ul className="space-y-4">
              {[
                'Precision 2D drafting with real dimensions',
                'Automatic wall joins and clean geometry',
                'Instant 3D visualization—see the space as you build',
                'Curated furniture and fixtures; drag and drop',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[var(--landing-accent-light)] flex items-center justify-center shrink-0 mt-0.5">
                    <BiCheck className="text-[var(--landing-accent)] text-sm" />
                  </span>
                  <span className="text-[var(--landing-ink)] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeInSection>
        <FadeInSection>
          <div className="relative rounded-2xl overflow-hidden border border-[var(--landing-border)] shadow-lg bg-[var(--landing-card)]">
            <img
              src="/landing/sketch_2d.png"
              alt="2D floor plan sketch"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white text-sm font-medium">
              2D plan → one click → 3D model
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  </section>
)

// ========== 3D → AI enhancement section (brand green) ==========
const Section3DToAI = () => (
  <section className="section-padding bg-[#142725] text-white">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <FadeInSection>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="/landing/ai_enhanced.png"
              alt="AI-enhanced photorealistic interior"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-sm font-medium">
              AI photorealistic render — layout preserved
            </div>
          </div>
        </FadeInSection>
        <FadeInSection>
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#5B7663]/30 text-[#5B7663] text-xs font-semibold tracking-wider uppercase">
              Phase 2
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-tight">
              <span className="text-white">3D model → </span><span className="text-[#5B7663]">AI photorealistic render</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Turn your 3D scene into magazine-quality imagery. Our AI preserves your exact layout while replacing flat textures with realistic materials, lighting, and atmosphere.
            </p>
            <ul className="space-y-4">
              {[
                'Structure preservation — no extra windows or moved furniture',
                'Style presets: Modern, Scandinavian, Luxury, Bohemian, and more',
                'Accurate perspective and scale for client-ready output',
                'High-resolution output ready for client presentations',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#5B7663]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <BiCheck className="text-[#5B7663] text-sm" />
                  </span>
                  <span className="text-white/90 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeInSection>
      </div>
    </div>
  </section>
)

// ========== Transformation visual (2D → 3D → AI cycle) ==========
const TransformationVisual = () => {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % 3), 4500)
    return () => clearInterval(t)
  }, [])

  const stages = [
    { img: '/landing/sketch_2d.png', label: '2D plan' },
    { img: '/landing/landing1.png', label: '3D render' },
    { img: '/landing/ai_enhanced.png', label: 'AI render' },
  ]

  return (
    <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-[var(--landing-border)] shadow-xl bg-[var(--landing-card)]">
      <div className="absolute inset-0 bg-[var(--landing-border)]">
        {stages.map((s, i) => (
          <img
            key={i}
            src={s.img}
            alt={s.label}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              phase === i ? 'opacity-100 z-10' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      <div className="scanner-line z-20" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-xs font-semibold">
        {stages.map((s, i) => (
          <span
            key={i}
            className={phase === i ? 'text-[var(--brand-gold)]' : 'text-white/50'}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ========== Features grid ==========
const FeaturesSection = () => {
  const features = [
    {
      icon: BiLayout,
      title: 'Intelligent wall engine',
      desc: 'Automatic intersection detection and precise dimensioning so your 2D plan is clean and buildable.',
    },
    {
      icon: BiCube,
      title: 'Curated 3D assets',
      desc: 'Professional-grade furniture and fixtures. Modern, traditional, and more—drag and drop into your plan.',
    },
    {
      icon: HiOutlinePhotograph,
      title: 'AI-powered photorealistic render',
      desc: 'Our AI preserves your layout while adding photorealistic materials and lighting.',
    },
    {
      icon: BiImageAdd,
      title: 'Style presets',
      desc: 'Modern, Scandinavian, Luxury, Bohemian, Industrial—choose a look and let AI apply it to your scene.',
    },
  ]
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="pill mb-4 inline-block">Features</span>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-[var(--landing-ink)] mb-3">
            Built for professional interior design
          </h2>
          <p className="text-[var(--landing-muted)] max-w-xl mx-auto text-lg">
            One workspace for drafting, visualization, and client-ready renders.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <FadeInSection key={i}>
              <div className="card-surface p-6 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[var(--landing-accent-light)] text-[var(--landing-accent)] flex items-center justify-center text-xl mb-4">
                  <f.icon />
                </div>
                <h3 className="font-semibold text-[var(--landing-ink)] text-lg mb-2">{f.title}</h3>
                <p className="text-[var(--landing-muted)] text-sm leading-relaxed flex-1">{f.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========== Main Landing ==========
const Landing = () => {
  return (
    <div className="landing-page min-h-screen text-[var(--landing-ink)] overflow-x-hidden selection:bg-[var(--brand-gold)]/30 selection:text-[var(--landing-ink)]">
      {/* Full-width nav: edge to edge */}
      <header className="relative z-20 w-full bg-[#142725] text-white pt-3 pb-2 md:pt-4 md:pb-2">
        <div className="flex justify-between items-center h-16 md:h-20 max-w-7xl mx-auto px-6 lg:px-12">
          <NavLink to="/" className="shrink-0">
            <img
              src="/landing/logo.png"
              alt="ApnaHomz"
              className="h-16 md:h-20 lg:h-24 w-auto object-contain"
            />
          </NavLink>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              How it works
            </a>
            <a href="#workflow" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#features" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Features
            </a>
            <NavLink to="/plans/all">
              <button type="button" className="bg-white text-[#142725] hover:bg-white/90 font-semibold text-sm px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
                <BiPencil className="text-lg" /> Get started
              </button>
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <main>
          {/* Hero */}
          <section className="pt-12 md:pt-20 pb-16 md:pb-24 text-center max-w-4xl mx-auto">
            <FadeInSection>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-normal text-[var(--landing-ink)] leading-[1.1] mb-6">
                Sketch your floor plan. Explore it in 3D. <br />
                <span className="text-[var(--landing-accent)]">Get a photorealistic render.</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--landing-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
                Draw floor plans with precision, furnish with curated assets, view in real-time 3D, then turn your scene into magazine-quality imagery—layout preserved, style in your control.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <NavLink to="/plans/all">
                  <button type="button" className="btn-primary px-8 py-4 text-base flex items-center gap-2">
                    <BiPencil className="text-xl" /> Start designing
                  </button>
                </NavLink>
                <a href="#how-it-works" className="btn-secondary flex items-center gap-2">
                  See how it works <HiArrowRight className="text-lg" />
                </a>
              </div>
            </FadeInSection>
          </section>

          {/* Pipeline strip */}
          <section id="workflow" className="section-padding">
            <FadeInSection>
              <PipelineStrip />
            </FadeInSection>
          </section>

          {/* 2D → 3D */}
          <section id="how-it-works">
            <Section2DTo3D />
          </section>

          {/* Transformation visual */}
          <section className="section-padding">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <span className="pill mb-4 inline-block">See the flow</span>
              <h2 className="font-display text-2xl md:text-3xl font-normal text-[var(--landing-ink)] mb-8">
                One plan. Three stages.
              </h2>
              <FadeInSection>
                <TransformationVisual />
              </FadeInSection>
            </div>
          </section>

          {/* 3D → AI */}
          <Section3DToAI />

          {/* Features */}
          <section id="features">
            <FeaturesSection />
          </section>

          {/* CTA */}
          <section className="section-padding">
            <FadeInSection>
              <div className="max-w-2xl mx-auto text-center card-surface p-12 md:p-16 rounded-3xl border border-[var(--landing-border)]">
                <h2 className="font-display text-3xl md:text-4xl font-normal text-[var(--landing-ink)] mb-4">
                  Ready to bring your interiors to life?
                </h2>
                <p className="text-[var(--landing-muted)] mb-8">
                  Join professionals who draft, visualize, and present in one place.
                </p>
                <NavLink to="/plans/all">
                  <button type="button" className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2">
                    <HiSparkles className="text-xl" /> Start design journey
                  </button>
                </NavLink>
              </div>
            </FadeInSection>
          </section>
        </main>

        <footer className="border-t border-[var(--landing-border)] py-12 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10">
            <div>
              <h4 className="text-[var(--landing-ink)] font-semibold text-sm mb-3 uppercase tracking-wider">Location</h4>
              <p className="text-[var(--landing-muted)] text-sm leading-relaxed">
                B-902 Empire Skypark, Bhagwat Road,<br />
                Opp. Suramya Greens, Sola,<br />
                Ahmedabad, Gujarat 380060
              </p>
            </div>
            <div>
              <h4 className="text-[var(--landing-ink)] font-semibold text-sm mb-3 uppercase tracking-wider">Email</h4>
              <a href="mailto:info@apnahomz.com" className="text-[var(--landing-muted)] text-sm hover:text-[var(--landing-accent)] transition-colors">
                info@apnahomz.com
              </a>
            </div>
            <div>
              <h4 className="text-[var(--landing-ink)] font-semibold text-sm mb-3 uppercase tracking-wider">Contact</h4>
              <ul className="text-[var(--landing-muted)] text-sm space-y-1.5">
                <li><strong className="text-[var(--landing-ink)] font-medium">Apna Homz</strong>: <a href="tel:7984000631" className="hover:text-[var(--landing-accent)] transition-colors">7984000631</a></li>
                <li><strong className="text-[var(--landing-ink)] font-medium">Raghav Agarwal</strong>: <a href="tel:8487955718" className="hover:text-[var(--landing-accent)] transition-colors">8487955718</a></li>
                <li><strong className="text-[var(--landing-ink)] font-medium">Vivek Raj Sompura</strong>: <a href="tel:9511521922" className="hover:text-[var(--landing-accent)] transition-colors">9511521922</a></li>
              </ul>
            </div>
            <div className="flex flex-col justify-start">
              <h4 className="text-[var(--landing-ink)] font-semibold text-sm mb-3 uppercase tracking-wider">Legal</h4>
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="#" className="text-[var(--landing-muted)] hover:text-[var(--landing-ink)] transition-colors">Privacy</a>
                <a href="#" className="text-[var(--landing-muted)] hover:text-[var(--landing-ink)] transition-colors">Terms</a>
                <a href="#" className="text-[var(--landing-muted)] hover:text-[var(--landing-ink)] transition-colors">Enterprise</a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-[var(--landing-border)] flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-2 text-[var(--landing-ink)] text-xs font-semibold tracking-widest uppercase text-center">
            <span>2026 © <a href="https://apnahomz.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">APNAHOMZ</a></span>
            <span className="hidden sm:inline-block opacity-50">.</span>
            <span>Developed by: <a href="https://starlobe.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">STARLOBE</a></span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Landing
