"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Image from "next/image";

/* ─── Reveal Hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("visible");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}

/* ─── Contact Form ─── */
function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      reason: (form.elements.namedItem("reason") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { setStatus("sent"); form.reset(); } else setStatus("error");
    } catch { setStatus("error"); }
  }

  const inputClass = "w-full bg-[#1a1a1a] border border-[rgba(245,242,237,0.1)] text-[#F5F2ED] px-5 py-4 outline-none transition-all focus:border-[#C8762A] focus:shadow-[0_0_0_2px_rgba(200,118,42,0.1)] font-body text-base placeholder:text-[rgba(245,242,237,0.25)] rounded-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[rgba(245,242,237,0.4)] mb-2">Name</label>
          <input type="text" name="name" required placeholder="Your full name" className={inputClass} />
        </div>
        <div>
          <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[rgba(245,242,237,0.4)] mb-2">Email</label>
          <input type="email" name="email" required placeholder="you@example.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[rgba(245,242,237,0.4)] mb-2">I am reaching out about</label>
        <select name="reason" required defaultValue="" className={`${inputClass} cursor-pointer appearance-none`}>
          <option value="" disabled>Select a reason</option>
          <option value="training">Personal training — in person</option>
          <option value="virtual">Personal training — virtual</option>
          <option value="commission">Art commission</option>
          <option value="general">General question</option>
        </select>
      </div>
      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[rgba(245,242,237,0.4)] mb-2">Message</label>
        <textarea name="message" required rows={5} placeholder="Tell me what you are looking for." className={`${inputClass} resize-y min-h-[140px]`} />
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto disabled:opacity-50 text-base px-12 py-4">
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {status === "sent" && <p className="text-green-400 text-sm font-mono pt-1">Sent. I will get back to you within 24 hours.</p>}
      {status === "error" && <p className="text-red-400 text-sm font-mono pt-1">Something went wrong. Please try again.</p>}
    </form>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(14,14,14,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(245,242,237,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <a href="#home" className="font-display text-2xl" style={{ fontWeight: 900, color: "var(--copper)", letterSpacing: "0.05em" }}>AG</a>
          <nav className="hidden md:flex items-center gap-10">
            {[
              { label: "About", href: "#about" },
              { label: "Training", href: "#training" },
              { label: "Portfolio", href: "#portfolio" },
              { label: "Commissions", href: "#commissions" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </nav>
          <a href="#contact" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.8125rem" }}>Book Now</a>
        </div>
      </header>

      {/* ── 1. HERO ── */}
      <section id="home" className="relative min-h-screen flex items-end overflow-hidden" style={{ background: "var(--bg)" }}>
        {/* Full bleed hero image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-placeholder.jpg"
            alt="Alexio Gessa — Personal Trainer"
            fill
            priority
            className="object-cover object-center img-treatment"
            style={{ opacity: 0.45 }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(14,14,14,0.95) 35%, rgba(14,14,14,0.5) 70%, rgba(14,14,14,0.2) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(14,14,14,1) 0%, transparent 50%)" }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-24 pt-40">
          <div className="max-w-3xl">
            <div className="fade-up fade-up-1 section-label mb-6">New York City</div>
            <h1
              className="font-display fade-up fade-up-2"
              style={{ fontSize: "clamp(4.5rem, 11vw, 9rem)", lineHeight: 0.9, fontWeight: 900, color: "var(--white)", letterSpacing: "-0.02em", marginBottom: "2rem" }}
            >
              TRAIN.<br />
              <span style={{ color: "var(--copper)", WebkitTextStroke: "0px" }}>CREATE.</span><br />
              EVOLVE.
            </h1>
            <p
              className="fade-up fade-up-3 font-body"
              style={{ fontSize: "1.1875rem", lineHeight: 1.75, color: "rgba(245,242,237,0.7)", maxWidth: "520px", marginBottom: "3rem" }}
            >
              Personal trainer and visual artist based in New York City. I help people build their bodies and bring their creative visions to life.
            </p>
            <div className="fade-up fade-up-4 flex flex-wrap gap-4">
              <a href="#training" className="btn-primary" style={{ fontSize: "0.9375rem", padding: "15px 36px" }}>Train With Me</a>
              <a href="#portfolio" className="btn-outline" style={{ fontSize: "0.9375rem", padding: "14px 36px" }}>View Portfolio</a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10" style={{ borderTop: "1px solid rgba(245,242,237,0.08)", background: "rgba(14,14,14,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "15+", label: "Years Training" },
              { number: "Kubert", label: "School of Art" },
              { number: "In-Person", label: "Manhattan" },
              { number: "Virtual", label: "Available Worldwide" },
            ].map((s) => (
              <div key={s.number}>
                <div className="font-display font-black text-2xl" style={{ color: "var(--copper)", fontWeight: 900 }}>{s.number}</div>
                <div className="font-mono text-[0.65rem] tracking-[0.18em] uppercase mt-1" style={{ color: "rgba(245,242,237,0.45)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT ── */}
      <section id="about" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Image column */}
            <Reveal>
              <div className="relative w-full max-w-lg mx-auto lg:mx-0">
                <div className="relative aspect-[4/5] overflow-hidden" style={{ border: "1px solid rgba(245,242,237,0.08)" }}>
                  <Image src="/about-placeholder.jpg" alt="Alexio Gessa" fill className="object-cover img-treatment" />
                </div>
                {/* Corner accents */}
                <div className="absolute -top-3 -left-3 w-16 h-16" style={{ borderTop: "3px solid var(--copper)", borderLeft: "3px solid var(--copper)" }} />
                <div className="absolute -bottom-3 -right-3 w-16 h-16" style={{ borderBottom: "3px solid var(--copper)", borderRight: "3px solid var(--copper)" }} />
                {/* Floating label */}
                <div className="absolute bottom-6 left-6 right-6 p-4" style={{ background: "rgba(14,14,14,0.88)", border: "1px solid rgba(200,118,42,0.3)", backdropFilter: "blur(8px)" }}>
                  <div className="font-display text-xl font-black" style={{ fontWeight: 900, color: "var(--white)" }}>Alexio Gessa</div>
                  <div className="font-mono text-[0.65rem] tracking-widest uppercase mt-1" style={{ color: "var(--copper)" }}>Trainer — Artist — New York City</div>
                </div>
              </div>
            </Reveal>

            {/* Text column */}
            <div>
              <Reveal>
                <span className="section-label">About</span>
                <div className="copper-line mt-3 mb-8" />
                <h2 className="font-display mb-8" style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)", fontWeight: 900, lineHeight: 0.95, color: "var(--white)", letterSpacing: "-0.02em" }}>
                  THE TRAINER<br />WHO DRAWS.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="font-body mb-6" style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "rgba(245,242,237,0.65)" }}>
                  I have been training people and building my own physique for over 15 years. I take the craft seriously — programming, technique, and the long-term consistency that actually produces results.
                </p>
                <p className="font-body mb-6" style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "rgba(245,242,237,0.65)" }}>
                  I am also a trained visual artist, a graduate of the Joe Kubert School of Cartoon and Graphic Art. My work lives in character design, figure drawing, and sequential storytelling.
                </p>
                <p className="font-body mb-10" style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "rgba(245,242,237,0.65)" }}>
                  These are not two separate things. Both require discipline, an eye for detail, and a commitment to showing up consistently. I bring that same approach to every client and every commission.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="flex flex-wrap gap-3">
                  {["Natural Bodybuilding", "Strength Training", "Physique Development", "Stretching & Mobility", "Character Design", "Figure Drawing"].map((tag) => (
                    <span key={tag} className="font-mono text-[0.65rem] tracking-widest uppercase px-4 py-2" style={{ border: "1px solid rgba(200,118,42,0.3)", color: "var(--copper)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TRAINING ── */}
      <section id="training" style={{ background: "var(--bg-card)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-36">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
              <span className="section-label">Personal Training</span>
              <div className="flex justify-center mt-3 mb-8"><div className="copper-line" /></div>
              <h2 className="font-display mb-6" style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)", fontWeight: 900, lineHeight: 0.95, color: "var(--white)", letterSpacing: "-0.02em" }}>
                BUILD SOMETHING<br />THAT LASTS.
              </h2>
              <p className="font-body" style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "rgba(245,242,237,0.6)" }}>
                Results come from consistency, not complexity. I program for your body, your schedule, and your goals. No cookie-cutter plans.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {[
              {
                format: "In-Person",
                location: "MidCity Gym, Manhattan",
                rate: "$150",
                description: "One-on-one sessions in Manhattan. Programming, hands-on technique coaching, and real accountability. You show up. I handle everything else.",
                features: ["Custom programming", "Technique coaching", "Progress tracking", "Nutrition guidance"],
              },
              {
                format: "Virtual",
                location: "Anywhere",
                rate: "$75",
                description: "Live video coaching, same quality and attention as in-person. Works with any schedule, any city, any gym setup.",
                features: ["Live video sessions", "Custom programming", "Form review & feedback", "Flexible scheduling"],
              },
            ].map((s, i) => (
              <Reveal key={s.format} delay={i * 0.1}>
                <div className="commission-card p-10 h-full flex flex-col" style={{ background: "var(--bg-elevated)" }}>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="font-display text-3xl font-black mb-1" style={{ fontWeight: 900, color: "var(--white)" }}>{s.format}</div>
                      <div className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: "var(--copper)" }}>{s.location}</div>
                    </div>
                    <div className="font-display text-5xl font-black" style={{ fontWeight: 900, color: "var(--copper)" }}>{s.rate}</div>
                  </div>
                  <p className="font-body mb-8 flex-1" style={{ color: "rgba(245,242,237,0.6)", lineHeight: 1.75, fontSize: "1.0625rem" }}>{s.description}</p>
                  <ul className="space-y-3 mb-8">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <span style={{ color: "var(--copper)", fontSize: "1.25rem", lineHeight: 1 }}>—</span>
                        <span className="font-mono text-xs tracking-wide" style={{ color: "rgba(245,242,237,0.5)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="btn-primary text-center w-full" style={{ padding: "14px 24px" }}>Book a Session</a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="max-w-4xl mx-auto p-6" style={{ background: "rgba(200,118,42,0.05)", border: "1px solid rgba(200,118,42,0.2)" }}>
              <p className="font-mono text-sm text-center" style={{ color: "rgba(245,242,237,0.5)" }}>
                <span style={{ color: "var(--copper)" }}>Note —</span> I am based at Equinox and MidCity Gym in Manhattan. Independent sessions take place at MidCity. Packages and long-term rates available on request.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 4. PORTFOLIO ── */}
      <section id="portfolio" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-36">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <span className="section-label">Art Portfolio</span>
              <div className="copper-line mt-3 mb-8" />
              <h2 className="font-display mb-6" style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)", fontWeight: 900, lineHeight: 0.95, color: "var(--white)", letterSpacing: "-0.02em" }}>
                CHARACTERS.<br />CONCEPTS.<br />CRAFT.
              </h2>
              <p className="font-body" style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "rgba(245,242,237,0.6)" }}>
                Trained at the Joe Kubert School of Cartoon and Graphic Art. My work lives at the intersection of figure drawing, character design, and sequential storytelling.
              </p>
            </div>
          </Reveal>

          {/* Portfolio grid — asymmetric */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Reveal className="col-span-2 row-span-2">
              <div className="relative w-full aspect-square overflow-hidden img-treatment" style={{ border: "1px solid rgba(245,242,237,0.06)" }}>
                <Image src="/art-sample-1.jpg" alt="Art portfolio piece 1" fill className="object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6" style={{ background: "linear-gradient(to top, rgba(14,14,14,0.85) 0%, transparent 60%)" }}>
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--copper)" }}>Character Design</span>
                </div>
              </div>
            </Reveal>
            {[
              { src: "/art-sample-2.jpg", label: "Illustration" },
              { src: "/art-sample-3.jpg", label: "Figure Study" },
              { src: "/art-sample-4.jpg", label: "Concept Art" },
              { src: "/art-sample-1.jpg", label: "Sequential Art" },
            ].map((item, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div className="relative w-full aspect-square overflow-hidden img-treatment" style={{ border: "1px solid rgba(245,242,237,0.06)" }}>
                  <Image src={item.src} alt={item.label} fill className="object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4" style={{ background: "linear-gradient(to top, rgba(14,14,14,0.85) 0%, transparent 60%)" }}>
                    <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--copper)" }}>{item.label}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="font-mono text-[0.65rem] tracking-wide mb-10" style={{ color: "rgba(245,242,237,0.25)" }}>
              Placeholder images — replacing with Alexio&apos;s actual work shortly.
            </p>
            <a href="#commissions" className="btn-outline" style={{ padding: "14px 36px" }}>View Commission Options</a>
          </Reveal>
        </div>
      </section>

      {/* ── 5. COMMISSIONS ── */}
      <section id="commissions" style={{ background: "var(--bg-card)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-36">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
              <span className="section-label">Art Commissions</span>
              <div className="flex justify-center mt-3 mb-8"><div className="copper-line" /></div>
              <h2 className="font-display mb-6" style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)", fontWeight: 900, lineHeight: 0.95, color: "var(--white)", letterSpacing: "-0.02em" }}>
                COMMISSION<br />YOUR VISION.
              </h2>
              <p className="font-body" style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "rgba(245,242,237,0.6)" }}>
                Custom illustrations, character portraits, and original pieces. Each commission is built from scratch to your specifications.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              {
                tier: "Pencil Portrait",
                description: "A rendered pencil sketch portrait. Black and white, clean and detailed. Great for character studies and personal portraits.",
                price: "$75",
                turnaround: "1-2 weeks",
                includes: ["Pencil on paper or digital", "High-res scan or file", "One revision included"],
              },
              {
                tier: "Inked Illustration",
                description: "A fully inked character illustration. Dynamic poses, expressive linework, comic-style execution.",
                price: "$150",
                turnaround: "2-3 weeks",
                includes: ["Pencils + inks", "High-res file", "Two revisions included"],
                featured: true,
              },
              {
                tier: "Full Color Piece",
                description: "A fully realized color illustration. Characters, scenes, cover concepts, and original artwork.",
                price: "$300+",
                turnaround: "3-5 weeks",
                includes: ["Full color rendering", "Print-ready file", "Multiple revisions"],
              },
            ].map((c, i) => (
              <Reveal key={c.tier} delay={0.1 + i * 0.08}>
                <div
                  className="commission-card p-8 h-full flex flex-col relative"
                  style={c.featured ? { borderColor: "rgba(200,118,42,0.4)", background: "var(--bg-elevated)" } : { background: "var(--bg-elevated)" }}
                >
                  {c.featured && (
                    <div className="absolute -top-px left-0 right-0 h-[3px]" style={{ background: "var(--copper)" }} />
                  )}
                  <div className="font-mono text-[0.65rem] tracking-widest uppercase mb-4" style={{ color: "var(--copper)" }}>{c.turnaround}</div>
                  <div className="font-display text-2xl font-black mb-3" style={{ fontWeight: 900, color: "var(--white)" }}>{c.tier}</div>
                  <p className="font-body text-sm flex-1 mb-6" style={{ color: "rgba(245,242,237,0.55)", lineHeight: 1.75 }}>{c.description}</p>
                  <ul className="space-y-2 mb-8">
                    {c.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span style={{ color: "var(--copper)" }}>—</span>
                        <span className="font-mono text-[0.65rem] tracking-wide" style={{ color: "rgba(245,242,237,0.45)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-5" style={{ borderTop: "1px solid rgba(245,242,237,0.08)" }}>
                    <span className="font-display text-4xl font-black" style={{ fontWeight: 900, color: "var(--copper)" }}>{c.price}</span>
                    <a href="#contact" className={c.featured ? "btn-primary" : "btn-outline"} style={{ padding: "10px 20px", fontSize: "0.8125rem" }}>Request</a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.25}>
            <p className="text-center font-mono text-xs" style={{ color: "rgba(245,242,237,0.3)" }}>
              All commissions for personal use. Commercial licensing available on request. 50% deposit required to begin.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section id="testimonials" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-36">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="section-label">Testimonials</span>
              <div className="flex justify-center mt-3 mb-8"><div className="copper-line" /></div>
              <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 4vw, 3.75rem)", fontWeight: 900, lineHeight: 0.95, color: "var(--white)", letterSpacing: "-0.02em" }}>
                WHAT PEOPLE SAY.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                text: "Alexio is one of the most knowledgeable trainers I have ever worked with. He does not just tell you what to do — he explains the why behind every movement. I made more progress in three months than I did in the previous year training on my own.",
                name: "Training Client",
                detail: "In-person, Manhattan",
              },
              {
                text: "The commission he did for me was incredible. He captured exactly what I had in my head, down to details I barely even articulated. Fast, professional, and genuinely talented.",
                name: "Commission Client",
                detail: "Character illustration",
              },
            ].map((t, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <div className="testimonial-card p-10 h-full flex flex-col">
                  <span className="font-display block mb-3" style={{ fontSize: "4rem", color: "var(--copper)", opacity: 0.35, fontWeight: 900, lineHeight: 1 }}>&ldquo;</span>
                  <p className="font-body flex-1 mb-8 pl-5" style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "rgba(245,242,237,0.65)" }}>{t.text}</p>
                  <div className="pl-5 pt-6" style={{ borderTop: "1px solid rgba(245,242,237,0.08)" }}>
                    <div className="font-display text-xl font-black" style={{ fontWeight: 800, color: "var(--white)" }}>{t.name}</div>
                    <div className="font-mono text-[0.65rem] tracking-widest uppercase mt-1" style={{ color: "var(--copper)" }}>{t.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CONTACT ── */}
      <section id="contact" style={{ background: "var(--bg-card)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">

            {/* Left */}
            <div className="lg:col-span-2">
              <Reveal>
                <span className="section-label">Get In Touch</span>
                <div className="copper-line mt-3 mb-8" />
                <h2 className="font-display mb-8" style={{ fontSize: "clamp(3rem, 5vw, 5rem)", fontWeight: 900, lineHeight: 0.9, color: "var(--white)", letterSpacing: "-0.02em" }}>
                  LET&apos;S<br />WORK.
                </h2>
                <p className="font-body mb-12" style={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "rgba(245,242,237,0.6)" }}>
                  Whether you are looking to train, commission a piece, or just have a question, I will get back to you within 24 hours.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="space-y-0">
                  {[
                    { label: "Location", value: "New York City" },
                    { label: "Training", value: "In-person & virtual" },
                    { label: "Art commissions", value: "Open" },
                    { label: "Response time", value: "Within 24 hours" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-6 py-5" style={{ borderBottom: "1px solid rgba(245,242,237,0.06)" }}>
                      <span className="font-mono text-[0.65rem] tracking-widest uppercase w-36 flex-shrink-0" style={{ color: "var(--copper)" }}>{item.label}</span>
                      <span className="font-body" style={{ color: "rgba(245,242,237,0.55)", fontSize: "1rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <Reveal delay={0.1}>
                <div className="p-10 md:p-12" style={{ background: "var(--bg-elevated)", border: "1px solid rgba(245,242,237,0.08)" }}>
                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--bg)", borderTop: "1px solid rgba(245,242,237,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-display text-2xl" style={{ fontWeight: 900, color: "var(--copper)" }}>AG</span>
          <div className="flex gap-8">
            {[
              { label: "Training", href: "#training" },
              { label: "Portfolio", href: "#portfolio" },
              { label: "Commissions", href: "#commissions" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="nav-link" style={{ fontSize: "0.65rem" }}>{l.label}</a>
            ))}
          </div>
          <span className="font-mono text-xs" style={{ color: "rgba(245,242,237,0.2)" }}>
            &copy; {new Date().getFullYear()} Alexio Gessa
          </span>
        </div>
      </footer>
    </>
  );
}
