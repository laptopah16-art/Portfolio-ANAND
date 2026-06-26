import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  // Languages
  "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3",

  // Frontend
  "React.js", "Next.js 14", "React Hooks", "Context API",
  "Tailwind CSS", "Framer Motion", "GSAP", "Axios",

  // Backend
  "Node.js", "Express.js", "REST API Design", "JWT Authentication",
  "bcrypt", "MVC Architecture", "Middleware",

  // Database
  "MongoDB", "Mongoose ODM", "MongoDB Atlas", "MySQL",

  // Tools & Platforms
  "Git", "GitHub", "Vercel", "Render", "Postman",
  "Figma", "VS Code", "ESLint", "npm",

  
];

const PROJECTS = [
  {
    title: "Aurum Perfume",
    type: "MERN E-Commerce",
    desc: "Full-stack fragrance marketplace with product catalog, cart, JWT-secured auth, and admin dashboard. Razorpay payment integration and order tracking.",
    tech: ["React", "Node.js", "MongoDB", "Express.js", "JWT"],
    url: "https://aurum-perfume.vercel.app",
    year: "2024",
    index: "01"
  },
  {
    title: "Noir Travel",
    type: "Next.js 14 Trip Planner",
    desc: "Destination discovery and itinerary builder powered by Next.js App Router and React Server Components. Smooth transitions, curated guides.",
    tech: ["Next.js 14", "TypeScript", "Tailwind CSS"],
    url: "https://noir-let-s-travel-ivory.vercel.app",
    year: "2024",
    index: "02"
  },
  {
    title: "MH13 Café",
    type: "React + Vite",
    desc: "Animated café website with interactive menu, table reservation system, and mobile-first layout. GSAP-powered page transitions.",
    tech: ["React", "Vite", "Tailwind CSS", "GSAP"],
    url: "https://mh-13-caf.vercel.app",
    year: "2024",
    index: "03"
  }
];

const STATS = [
  { value: 3, label: "Projects Shipped", suffix: "+" },
  { value: 12, label: "Technologies", suffix: "" },
  { value: 1, label: "Internship", suffix: "" },
];

function useCounter(target: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [trigger, target]);
  return count;
}

function StatCounter({ value, label, suffix, trigger }: { value: number; label: string; suffix: string; trigger: boolean }) {
  const count = useCounter(value, trigger);
  return (
    <div className="flex flex-col gap-1">
      <span className="font-['Cormorant_Garamond'] font-black text-5xl text-white leading-none">
        {count}{suffix}
      </span>
      <span className="font-['JetBrains_Mono'] text-[11px] text-[#b0afa9] tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}

export default function App() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainInnerRef = useRef<HTMLDivElement>(null);
  const heroFirstRef = useRef<HTMLDivElement>(null);
  const heroLastRef = useRef<HTMLDivElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Curtain reveal
      const tl = gsap.timeline();

      tl.set(curtainRef.current, { scaleY: 1 })
        .to(curtainRef.current, {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.1,
          ease: "expo.inOut",
          delay: 0.2,
        })
        .then(() => {
          // Hero name stagger after curtain
          const firstChars = heroFirstRef.current?.querySelectorAll(".ch");
          const lastChars = heroLastRef.current?.querySelectorAll(".ch");
          if (firstChars && lastChars) {
            gsap.fromTo(
              [...firstChars, ...lastChars],
              { y: 110, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.045, duration: 0.75, ease: "expo.out" }
            );
          }
          gsap.fromTo(heroBadgeRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.35, ease: "expo.out" });
          gsap.fromTo(heroSubRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: "expo.out" });
          gsap.fromTo(underlineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.7, delay: 0.75, ease: "expo.out", transformOrigin: "left center" });
        });

      // ScrollTrigger sections
      gsap.utils.toArray<Element>(".reveal-on-scroll").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 55, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.85, ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" }
          }
        );
      });

      // Skill tags stagger
      gsap.fromTo(".skill-tag", { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.055, duration: 0.55, ease: "expo.out",
        scrollTrigger: { trigger: ".skills-grid", start: "top 78%", toggleActions: "play none none none" }
      });

      // Project cards
      gsap.fromTo(".project-card", { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: ".projects-grid", start: "top 80%", toggleActions: "play none none none" }
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Stats counter trigger via IntersectionObserver
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStatsVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const splitWord = (word: string, ref: React.RefObject<HTMLDivElement>) => (
    <div ref={ref} className="flex" aria-label={word}>
      {[...word].map((char, i) => (
        <span key={i} className="block overflow-hidden leading-none">
          <span className="ch block" style={{ opacity: 0, transform: "translateY(110px)" }}>
            {char}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <>
      {/* Curtain overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-50 bg-[#e8433a] pointer-events-none"
        style={{ transformOrigin: "top center" }}
      />

      <div className="bg-[#2f2f2f] text-white min-h-screen overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-5 flex items-center justify-between bg-[#2f2f2f]/90 backdrop-blur-sm border-b border-white/5">
          <span style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-lg tracking-[0.2em] text-white">
            Anand Helave
          </span>
          <div className="hidden md:flex items-center gap-8 text-[13px] text-[#b0afa9] tracking-widest uppercase">
            {["Skills", "Projects", "Experience", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link === "Projects" ? "projects" : link.toLowerCase()}`}
                className="hover:text-white transition-colors duration-200 relative group"
              >
                {link}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#e8433a] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          <a
            href="mailto:work.anand.helave@gmail.com"
            className="hidden md:block font-['JetBrains_Mono'] text-xs px-4 py-2 border border-[#e8433a] text-[#e8433a] hover:bg-[#e8433a] hover:text-white transition-all duration-200"
          >
            Hire Me
          </a>
        </nav>

        {/* HERO */}
        <section className="min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-16 pt-28">
          <div className="max-w-7xl w-full">
            {/* Badge */}
            <div ref={heroBadgeRef} className="mb-6 flex items-center gap-3" style={{ opacity: 0 }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8433a] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8433a]" />
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] text-[#e8433a] tracking-[0.3em] uppercase">
                Available for Work
              </span>
            </div>

            {/* Hero name */}
            <div
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 900 }}
              className="text-[clamp(4.5rem,14vw,11rem)] leading-[0.88] tracking-tight text-white select-none mb-6"
            >
              {splitWord("ANAND", heroFirstRef as React.RefObject<HTMLDivElement>)}
              <div className="flex items-end gap-4 md:gap-8 flex-wrap">
                {splitWord("HELAVE", heroLastRef as React.RefObject<HTMLDivElement>)}
                <span
                  className="text-[clamp(1rem,2.5vw,2rem)] font-normal mb-2 md:mb-4 text-[#b0afa9] self-end"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}
                >
                  .Dev
                </span>
              </div>
            </div>

            {/* Role subtitle with underline */}
            <div className="mb-10">
              <p
                ref={heroSubRef}
                className="text-[clamp(1.1rem,2vw,1.4rem)] text-[#b0afa9] font-light mb-2"
                style={{ opacity: 0 }}
              >
                Frontend &amp; MERN Stack Developer
              </p>
              <span
                ref={underlineRef}
                className="block h-[2px] bg-[#e8433a] w-72 md:w-96"
                style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
              />
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex flex-wrap gap-10 md:gap-16 mt-2"
            >
              {STATS.map((s) => (
                <StatCounter key={s.label} {...s} trigger={statsVisible} />
              ))}
            </div>
          </div>

          {/* Asymmetric decorative line */}
          <div className="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 opacity-20">
            <span className="w-[1px] h-32 bg-white" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[9px] tracking-widest text-white -rotate-90 whitespace-nowrap">
              SCROLL DOWN
            </span>
            <span className="w-[1px] h-32 bg-white" />
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="px-6 md:px-12 lg:px-20 py-24 border-t border-white/5">
          <div className="max-w-7xl">
            <div className="flex items-start justify-between mb-14 flex-wrap gap-4 reveal-on-scroll">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-[clamp(3rem,7vw,5rem)] tracking-widest text-[#e8433a]">
                SKILLS
              </h2>
              <p className="text-[#b0afa9] text-sm max-w-xs leading-relaxed mt-2">
                Technologies I work with to build full-stack web applications from zero to production.
              </p>
            </div>
            <div className="skills-grid flex flex-wrap gap-3">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    padding: "8px 18px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#b0afa9",
                    cursor: "default",
                    transition: "border-color 0.25s, color 0.25s, background 0.25s",
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#e8433a";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                    (e.currentTarget as HTMLElement).style.background = "rgba(232,67,58,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "#b0afa9";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="px-6 md:px-12 lg:px-20 py-24 border-t border-white/5">
          <div className="max-w-7xl">
            <div className="flex items-end justify-between mb-14 flex-wrap gap-4 reveal-on-scroll">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-[clamp(3rem,7vw,5rem)] tracking-widest text-[#e8433a]">
                PROJECTS
              </h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] text-[#b0afa9] tracking-wider mb-2">
                2026 — Present
              </span>
            </div>

            <div className="projects-grid grid grid-cols-1 md:grid-cols-3 gap-5">
              {PROJECTS.map((project) => (
                <a
                  key={project.index}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card group flex flex-col p-7 bg-[#252525] border border-white/[0.06] hover:border-l-4 hover:border-l-[#e8433a] hover:-translate-y-1.5 transition-all duration-300 relative"
                  style={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="text-[10px] text-[#e8433a] tracking-widest"
                    >
                      {project.index}
                    </span>
                    <span className="text-[#b0afa9] group-hover:text-[#e8433a] transition-colors text-lg">↗</span>
                  </div>

                  <h3
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    className="text-[1.6rem] tracking-wide text-white mb-1 group-hover:text-[#e8433a] transition-colors duration-300"
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="text-[11px] text-[#b0afa9] mb-5 tracking-wider"
                  >
                    {project.type}
                  </p>
                  <p className="text-[#b0afa9] text-sm leading-relaxed mb-6 flex-1">
                    {project.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        className="text-[10px] px-2 py-1 bg-white/[0.04] text-[#b0afa9] border border-white/[0.06]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE + EDUCATION — asymmetric two-col */}
        <section className="px-6 md:px-12 lg:px-20 py-24 border-t border-white/5">
          <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 lg:gap-16">

            {/* Experience */}
            <div id="experience" className="reveal-on-scroll">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-[clamp(3rem,7vw,5rem)] tracking-widest text-[#e8433a] mb-12">
                Experience
              </h2>
              <div className="border-l-2 border-[#e8433a] pl-8">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h3
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    className="text-xl tracking-wide text-white"
                  >
                    PHP Developer Intern
                  </h3>
                  <span
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="text-[11px] text-[#b0afa9] mt-0.5"
                  >
                    2025
                  </span>
                </div>
                <p
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className="text-sm text-[#e8433a] mb-4 tracking-wide"
                >
                  Code World Pvt. Ltd.
                </p>
                <p className="text-[#b0afa9] text-sm leading-relaxed">
                  Developed and maintained PHP-based web applications in a professional team environment. Worked on backend logic, MySQL queries, and front-end integration. Gained hands-on experience with MVC architecture, version control, and client deployment pipelines.
                </p>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="hidden lg:block w-[1px] bg-white/5 self-stretch" />

            {/* Education */}
            <div className="mt-16 lg:mt-0 reveal-on-scroll">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-[clamp(3rem,7vw,5rem)] tracking-widest text-[#e8433a] mb-12">
                Education
              </h2>
              <div className="border-l-2 border-white/10 pl-8">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h3
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    className="text-xl tracking-wide text-white leading-tight"
                  >
                    Bachelor of Computer<br />Applications
                  </h3>
                  <span
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="text-[11px] text-[#b0afa9] mt-0.5 whitespace-nowrap"
                  >
                    2023 – 2026
                  </span>
                </div>
                <p
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className="text-sm text-[#b0afa9] tracking-wide"
                >
                  Sangameshwar College, Solapur
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-6 md:px-12 lg:px-20 py-28 border-t border-white/5">
          <div className="max-w-7xl">
            <div className="reveal-on-scroll mb-14">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-[clamp(3rem,7vw,5rem)] tracking-widest text-[#e8433a] mb-4">
                Get In Touch
              </h2>
              <p className="text-[#b0afa9] text-sm max-w-md leading-relaxed">
                Open to freelance projects, full-time roles, and interesting collaborations. If you have something in mind — reach out.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
              {/* Email CTA */}
              <div className="reveal-on-scroll">
                <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] text-[#b0afa9] tracking-widest uppercase mb-4">
                  Email
                </p>
                <a
                  href="mailto:work.anand.helave@gmail.com"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 900 }}
                  className="block text-[clamp(1.5rem,3.5vw,2.5rem)] text-white hover:text-[#e8433a] transition-colors duration-300 leading-tight break-all"
                >
                  work.anand.helave@gmail.com

                </a>
              
                <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] text-[#b0afa9] tracking-widest uppercase mb-4">
                  CALL ME
                </p>

                <a href="tel:7841996463" className="block text-[clamp(1.5rem,3.5vw,2.5rem)] text-white hover:text-[#e8433a] transition-colors duration-300 leading-tight">
                  7841996463
                </a>
              </div>

              {/* Social links */}
              <div className="flex flex-col gap-3 reveal-on-scroll">
                <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] text-[#b0afa9] tracking-widest uppercase mb-1">
                  Elsewhere
                </p>
                {[
                  { label: "GitHub", handle: "github.com/laptopah16-art", url: "https://github.com/laptopah16-art" },
                  { label: "LinkedIn", handle: "linkedin.com/in/anand-dev-2a0948401", url: "https://linkedin.com/in/anand-dev-2a0948401" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 border border-white/[0.08] hover:border-[#e8433a] hover:bg-[#e8433a]/5 transition-all duration-250"
                  >
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="tracking-widest text-white text-lg">
                      {link.label}
                    </span>
                    <span
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="text-[11px] text-[#b0afa9] group-hover:text-[#e8433a] transition-colors"
                    >
                      {link.handle} ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 md:px-12 lg:px-20 py-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] text-[#b0afa9]">
            © 2024 Anand Mallinath Helave
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] text-[#b0afa9]">
            Frontend & MERN Stack Developer — Solapur, India
          </span>
        </footer>
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #2f2f2f; }
        ::-webkit-scrollbar-thumb { background: #e8433a; }
        * { scrollbar-width: thin; scrollbar-color: #e8433a #2f2f2f; }
      `}</style>
    </>
  );
}
