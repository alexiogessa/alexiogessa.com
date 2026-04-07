"use client";

import { useEffect, useRef, useState, FormEvent } from "react";

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
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setStatus("sent"); form.reset(); }
      else setStatus("error");
    } catch { setStatus("error"); }
  }

  const inputClass =
    "w-full bg-transparent border border-[rgba(245,242,237,0.12)] text-[#F5F2ED] rounded-none px-4 py-3.5 outline-none transition-all focus:border-[#C8762A] focus:shadow-[0_0_0_2px_rgba(200,118,42,0.12)] font-body text-base placeholder:text-[rgba(245,242,237,0.3)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-mono text-xs tracking-widest uppercase text-[rgba(245,242,237,0.5)] mb-2">Name</label>
        <input type="text" name="name" required placeholder="Your full name" className={inputClass} />
      </div>
      <div>
        <label className="block font-mono text-xs tracking-widest uppercase text-[rgba(245,242,237,0.5)] mb-2">Email</label>
        <input type="email" name="email" required placeholder="you@example.com" className={inputClass} />
      </div>
      <div>
        <label className="block font-mono text-xs tracking-widest uppercase text-[rgba(245,242,237,0.5)] mb-2">I am reaching out about</label>
        <select name="reason" required defaultValue="" className={`${inputClass} cursor-pointer appearance-none`}>
          <option value="" disabled>Select a reason</option>
          <option value="training">Personal training inquiry</option>
          <option value="commission">Art commission</option>
          <option value="virtual">Virtual training inquiry</option>
          <option value="general">General question</option>
        </select>
      </div>
      <div>
        <label className="block font-mono text-xs tracking-widest uppercase text-[rgba(245,242,237,0.5)] mb-2">Message</label>
        <textarea name="message" required rows={5} placeholder="Tell me what you're looking for." className={`${inputClass} resize-y min-h-[120px]`} />
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full md:w-auto disabled:opacity-50">
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {status === "sent" && <p className="text-green-400 text-sm font-mono">Sent. I will get back to you shortly.</p>}
      {status === "error" && <p className="text-red-400 text-sm font-mono">Something went wrong. Try again.</p>}
    </form>
  );
}

/* ═══════════════════════════════
   MAIN PAGE
═══════════════════════════════ */
export default function HomePage() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full img-treatment"
            style={{
              background: "linear-gradient(105deg, #0e0e0e 45%, #1a1a1a 100%)",
            }}
          />
          {/* Placeholder for hero image — replace with Alexio's photo */}
          <div
            className="absolute right-0 top-0 w-full md:w-[55%] h-full opacity-30 md:opacity-50"
            style={{
              background:
                "linear-gradient(to left, rgba(200,118,42,0.08) 0%, transparent 60%), url('/hero-placeholder.jpg') center top / cover no-repeat",
            }}
          />
          {/* Left fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/90 to-transparent" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
        </div>

        {/* Nav */}
        <nav className="relative z-20 flex items-center justify-between max-w-6xl mx-auto w-full px-6 py-7">
          <a href="#home" className="font-display font-900 text-2xl tracking-tight" style={{ color: "var(--copper)", fontWeight: 900 }}>
            AG
          </a>
          <ul className="hidden md:flex items-center gap-10 list-none">
            {[
              { label: "About", href: "#about" },
              { label: "Training", href: "#training" },
              { label: "Art", href: "#art" },
              { label: "Testimonials", href: "#testimonials" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="nav-link">{l.label}</a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn-primary hidden md:inline-block" style={{ padding: "10px 22px", fontSize: "0.8125rem" }}>
            Book Now
          </a>
        </nav>

        {/* Hero Content */}
        <main className="relative z-10 flex-1 flex items-center px-6 py-16 md:py-24 max-w-6xl mx-auto w-full">
          <div className="max-w-[680px]">
            <span className="section-label fade-up fade-up-1">New York City</span>
            <h1
              className="font-display fade-up fade-up-2"
              style={{
                fontSize: "clamp(4rem, 9vw, 7.5rem)",
                lineHeight: 0.95,
                fontWeight: 900,
                color: "var(--white)",
                letterSpacing: "-0.01em",
                marginBottom: "1.5rem",
              }}
            >
              TRAIN.<br />
              <span style={{ color: "var(--copper)" }}>CREATE.</span><br />
              EVOLVE.
            </h1>
            <p
              className="fade-up fade-up-3 font-body"
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.7,
                color: "var(--white-dim)",
                maxWidth: "520px",
                marginBottom: "2.5rem",
              }}
            >
              Personal trainer and visual artist based in New York City. I help people build their physique and their confidence. I also draw things that don&rsquo;t exist yet.
            </p>
            <div className="fade-up fade-up-4 flex flex-wrap gap-4">
              <a href="#training" className="btn-primary">Train With Me</a>
              <a href="#art" className="btn-outline">Commission Art</a>
            </div>
          </div>
        </main>

        {/* Stats bar */}
        <div className="relative z-10 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "15+", label: "Years Training" },
              { number: "NYC", label: "Based In" },
              { number: "Kubert", label: "School of Art" },
              { number: "In-Person & Virtual", label: "Session Formats" },
            ].map((stat) => (
              <div key={stat.number} className="text-center md:text-left">
                <div className="font-display font-900 text-2xl" style={{ color: "var(--copper)", fontWeight: 900 }}>
                  {stat.number}
                </div>
                <div className="font-mono text-xs tracking-wider uppercase mt-1" style={{ color: "var(--white-dim)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT ── */}
      <section id="about" style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

            {/* Image */}
            <Reveal className="flex-shrink-0 w-full lg:w-[420px]">
              <div className="relative">
                <div
                  className="w-full aspect-[3/4] img-treatment"
                  style={{
                    background: "url('/about-placeholder.jpg') center / cover no-repeat, #1c1c1c",
                    border: "1px solid var(--border)",
                  }}
                />
                {/* Copper corner accent */}
                <div
                  className="absolute top-0 left-0 w-16 h-16"
                  style={{
                    borderTop: "3px solid var(--copper)",
                    borderLeft: "3px solid var(--copper)",
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-16 h-16"
                  style={{
                    borderBottom: "3px solid var(--copper)",
                    borderRight: "3px solid var(--copper)",
                  }}
                />
              </div>
            </Reveal>

            {/* Text */}
            <div className="flex-1">
              <Reveal>
                <span className="section-label">About</span>
                <span className="copper-line mb-6" />
                <h2
                  className="font-display mt-6"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.0, color: "var(--white)", letterSpacing: "-0.01em", marginBottom: "1.5rem" }}
                >
                  THE TRAINER<br />WHO DRAWS.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="font-body" style={{ fontSize: "1.125rem", lineHeight: 1.75, color: "var(--white-dim)", marginBottom: "1.25rem" }}>
                  I have been training people and building my own physique for over 15 years. I am also a trained visual artist, a graduate of the Joe Kubert School of Cartoon and Graphic Art, and a lifelong student of comics, illustration, and character design.
                </p>
                <p className="font-body" style={{ fontSize: "1.125rem", lineHeight: 1.75, color: "var(--white-dim)", marginBottom: "1.25rem" }}>
                  Those two things are not as different as they sound. Both require discipline, patience, an eye for detail, and a willingness to study what works and build on it. I bring that same approach to everyone I train.
                </p>
                <p className="font-body" style={{ fontSize: "1.125rem", lineHeight: 1.75, color: "var(--white-dim)" }}>
                  I work with people in Manhattan at MidCity Gym and virtually. My clients tend to be smart, curious people who are serious about results but not interested in the typical gym bro experience. If that sounds like you, let&rsquo;s talk.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {["Natural Bodybuilding", "Strength Training", "Physique Development", "Stretching & Mobility", "Virtual Coaching"].map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs tracking-wider uppercase px-3 py-2"
                      style={{ border: "1px solid var(--border-copper)", color: "var(--copper)" }}
                    >
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
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <Reveal>
            <span className="section-label">Personal Training</span>
            <span className="copper-line mb-6" />
            <h2
              className="font-display mt-6 mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.0, color: "var(--white)", letterSpacing: "-0.01em" }}
            >
              BUILD SOMETHING<br />THAT LASTS.
            </h2>
            <p
              className="font-body mb-12"
              style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "var(--white-dim)", maxWidth: "580px" }}
            >
              Results come from consistency, not chaos. I program for your body, your schedule, and your goals. No cookie-cutter plans. No unnecessary complexity.
            </p>
          </Reveal>

          {/* Service cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                format: "In-Person",
                location: "MidCity Gym, Manhattan",
                rate: "$150",
                per: "/ session",
                description: "One-on-one sessions in Manhattan. Programming, technique coaching, and real accountability. You show up. I handle the rest.",
                ideal: "Best for: people who want hands-on coaching and accountability in person.",
              },
              {
                format: "Virtual",
                location: "Anywhere",
                rate: "$75",
                per: "/ session",
                description: "Live virtual coaching via video call. Same programming quality, same attention to detail. Works for any schedule, any city.",
                ideal: "Best for: people with a home gym or access to equipment who want expert eyes on their training.",
              },
            ].map((s) => (
              <Reveal key={s.format} delay={0.1}>
                <div
                  className="commission-card p-8 h-full flex flex-col"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="font-display text-3xl font-900 mb-1" style={{ fontWeight: 900, color: "var(--white)" }}>
                        {s.format}
                      </div>
                      <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--copper)" }}>
                        {s.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-4xl font-900" style={{ fontWeight: 900, color: "var(--copper)" }}>{s.rate}</span>
                      <span className="font-mono text-xs" style={{ color: "var(--white-dim)" }}>{s.per}</span>
                    </div>
                  </div>
                  <p className="font-body mb-4 flex-1" style={{ color: "var(--white-dim)", lineHeight: 1.7 }}>{s.description}</p>
                  <p className="font-mono text-xs tracking-wide" style={{ color: "var(--white-faint)" }}>{s.ideal}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div
              className="p-6 mb-10"
              style={{ background: "rgba(200,118,42,0.06)", border: "1px solid var(--border-copper)" }}
            >
              <p className="font-mono text-sm" style={{ color: "var(--white-dim)" }}>
                <span style={{ color: "var(--copper)" }}>Note —</span> I am based at Equinox and MidCity Gym in Manhattan. Independent sessions take place at MidCity. Packages and long-term pricing available on request.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <a href="#contact" className="btn-primary">Book a Consultation</a>
          </Reveal>
        </div>
      </section>

      {/* ── 4. ART ── */}
      <section id="art" style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <Reveal>
            <span className="section-label">Art & Commissions</span>
            <span className="copper-line mb-6" />
            <h2
              className="font-display mt-6 mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.0, color: "var(--white)", letterSpacing: "-0.01em" }}
            >
              CHARACTERS.<br />CONCEPTS. CRAFT.
            </h2>
            <p
              className="font-body mb-12"
              style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "var(--white-dim)", maxWidth: "580px" }}
            >
              Trained at the Joe Kubert School of Cartoon and Graphic Art. My work lives at the intersection of figure drawing, character design, and sequential storytelling. Available for commissions.
            </p>
          </Reveal>

          {/* Art gallery placeholder */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square img-treatment"
                  style={{
                    background: `url('/art-sample-${i}.jpg') center / cover no-repeat, var(--bg-elevated)`,
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
            </div>
          </Reveal>

          {/* Commission menu */}
          <Reveal delay={0.15}>
            <h3
              className="font-display mb-6"
              style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--white)", letterSpacing: "-0.01em" }}
            >
              Commission Menu
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              {
                tier: "Pencil Portrait",
                description: "A rendered pencil sketch portrait. Black and white. Clean, detailed figure work.",
                price: "$75",
                turnaround: "1-2 weeks",
              },
              {
                tier: "Inked Illustration",
                description: "A fully inked character illustration. Dynamic poses, comic-style linework.",
                price: "$150",
                turnaround: "2-3 weeks",
              },
              {
                tier: "Full Color Piece",
                description: "Fully realized color illustration. Characters, scenes, cover concepts.",
                price: "$300+",
                turnaround: "3-5 weeks",
              },
            ].map((c, i) => (
              <Reveal key={c.tier} delay={0.1 + i * 0.08}>
                <div className="commission-card p-7 h-full flex flex-col">
                  <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--copper)" }}>
                    {c.turnaround}
                  </div>
                  <div className="font-display text-2xl font-800 mb-3" style={{ fontWeight: 800, color: "var(--white)" }}>
                    {c.tier}
                  </div>
                  <p className="font-body text-sm flex-1 mb-5" style={{ color: "var(--white-dim)", lineHeight: 1.7 }}>
                    {c.description}
                  </p>
                  <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
                    <span className="font-display text-3xl font-900" style={{ fontWeight: 900, color: "var(--copper)" }}>
                      {c.price}
                    </span>
                    <a href="#contact" className="btn-outline" style={{ padding: "8px 18px", fontSize: "0.8125rem" }}>
                      Request
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="font-mono text-xs tracking-wide" style={{ color: "var(--white-faint)" }}>
              All commissions are for personal use. Commercial licensing available on request. 50% deposit required to begin.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ── */}
      <section id="testimonials" style={{ background: "var(--bg-card)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <Reveal>
            <span className="section-label">Testimonials</span>
            <span className="copper-line mb-6" />
            <h2
              className="font-display mt-6 mb-12"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.05, color: "var(--white)", letterSpacing: "-0.01em" }}
            >
              WHAT PEOPLE SAY.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                text: "Alexio is one of the most knowledgeable trainers I have ever worked with. He does not just tell you what to do — he explains the why behind every movement. I have made more progress in 3 months than I did in the previous year on my own.",
                name: "Placeholder Client",
                detail: "Training client, Manhattan",
              },
              {
                text: "The commission he did for me was incredible. He captured exactly the character I described, down to the details I barely even articulated. Fast, professional, and genuinely talented.",
                name: "Placeholder Client",
                detail: "Art commission",
              },
            ].map((t, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <div className="testimonial-card p-8 md:p-10 h-full">
                  <span
                    className="font-display block mb-4 leading-none"
                    style={{ fontSize: "3.5rem", color: "var(--copper)", opacity: 0.4, fontWeight: 900 }}
                  >
                    &ldquo;
                  </span>
                  <p className="font-body mb-8 pl-4" style={{ fontSize: "1.125rem", lineHeight: 1.75, color: "var(--white-dim)" }}>
                    {t.text}
                  </p>
                  <div className="pl-4 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="font-display text-xl font-800" style={{ fontWeight: 800, color: "var(--white)" }}>{t.name}</div>
                    <div className="font-mono text-xs tracking-widest uppercase mt-1" style={{ color: "var(--copper)" }}>{t.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="font-mono text-xs mt-8" style={{ color: "var(--white-faint)" }}>
              Placeholder testimonials — replacing with real ones as they are collected.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 6. CONTACT ── */}
      <section id="contact" style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

            {/* Left */}
            <div className="lg:w-[420px] flex-shrink-0">
              <Reveal>
                <span className="section-label">Get In Touch</span>
                <span className="copper-line mb-6" />
                <h2
                  className="font-display mt-6 mb-6"
                  style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 900, lineHeight: 1.0, color: "var(--white)", letterSpacing: "-0.01em" }}
                >
                  LET&rsquo;S<br />WORK.
                </h2>
                <p className="font-body mb-8" style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--white-dim)" }}>
                  Whether you are looking to train, commission a piece, or just have a question, reach out and I will get back to you within 24 hours.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="space-y-5">
                  {[
                    { label: "Location", value: "New York City" },
                    { label: "Training", value: "In-person & virtual" },
                    { label: "Response time", value: "Within 24 hours" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                      <span className="font-mono text-xs tracking-widest uppercase w-32 flex-shrink-0" style={{ color: "var(--copper)" }}>
                        {item.label}
                      </span>
                      <span className="font-body" style={{ color: "var(--white-dim)" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="flex-1">
              <Reveal delay={0.15}>
                <div
                  className="p-8 md:p-10"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display font-900 text-xl" style={{ fontWeight: 900, color: "var(--copper)" }}>AG</span>
          <div className="flex gap-8">
            {[
              { label: "Training", href: "#training" },
              { label: "Art", href: "#art" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="nav-link" style={{ fontSize: "0.6875rem" }}>{l.label}</a>
            ))}
          </div>
          <span className="font-mono text-xs" style={{ color: "var(--white-faint)" }}>
            &copy; {new Date().getFullYear()} Alexio Gessa
          </span>
        </div>
      </footer>
    </>
  );
}
