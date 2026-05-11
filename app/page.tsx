"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Image from "next/image";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("visible"); return; }
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }); },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useReveal();
  return <div ref={ref} className="reveal" style={{ transitionDelay: delay ? `${delay}s` : undefined, ...style }}>{children}</div>;
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const reason = (form.elements.namedItem("reason") as HTMLSelectElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
    const subject = encodeURIComponent(`Alexio Gessa inquiry — ${reason}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInterest: ${reason}\n\n${message}`);
    try {
      window.location.href = `mailto:alexio@alexiogessa.com?subject=${subject}&body=${body}`;
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field: React.CSSProperties = {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid rgba(245,242,237,0.1)",
    color: "#F5F2ED",
    padding: "14px 18px",
    outline: "none",
    fontFamily: "'Lora', Georgia, serif",
    fontSize: "1rem",
    lineHeight: 1.5,
    borderRadius: 0,
  };
  const label: React.CSSProperties = {
    display: "block",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "0.625rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(245,242,237,0.4)",
    marginBottom: "8px",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="contact-name-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div><label style={label}>Name</label><input type="text" name="name" required placeholder="Your full name" style={field} /></div>
        <div><label style={label}>Email</label><input type="email" name="email" required placeholder="you@example.com" style={field} /></div>
      </div>
      <div>
        <label style={label}>I am reaching out about</label>
        <select name="reason" required defaultValue="" style={{ ...field, cursor: "pointer", appearance: "none" as const }}>
          <option value="" disabled>Select a reason</option>
          <option value="training">Personal training — in person</option>
          <option value="virtual">Personal training — virtual</option>
          <option value="commission">Art commission</option>
          <option value="general">General question</option>
        </select>
      </div>
      <div>
        <label style={label}>Message</label>
        <textarea name="message" required rows={5} placeholder="Tell me what you are looking for." style={{ ...field, resize: "vertical", minHeight: "140px" }} />
      </div>
      <div>
        <button type="submit" className="btn-primary">
          Send Inquiry
        </button>
        {status === "sent" && <p style={{ color: "#4ade80", fontFamily: "monospace", fontSize: "0.875rem", marginTop: "12px" }}>Your email app should open with the inquiry ready to send.</p>}
        {status === "error" && <p style={{ color: "#f87171", fontFamily: "monospace", fontSize: "0.875rem", marginTop: "12px" }}>Something went wrong. Email alexio@alexiogessa.com directly.</p>}
      </div>
    </form>
  );
}

export default function HomePage() {
  return (
    <>
      {/* NAV */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(14,14,14,0.93)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(245,242,237,0.06)" }}>
        <div className="container site-header-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "18px", paddingBottom: "18px" }}>
          <a href="#home" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.75rem", color: "var(--copper)", textDecoration: "none", letterSpacing: "0.04em" }}>AG</a>
          <nav className="site-header-nav" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            {[["About","#about"],["Training","#training"],["Portfolio","#portfolio"],["Commissions","#commissions"],["Contact","#contact"]].map(([l,h]) => (
              <a key={h} href={h} className="nav-link nav-visible">{l}</a>
            ))}
            <style>{`.nav-visible{display:none}@media(min-width:768px){.nav-visible{display:inline}}@media(max-width:767px){.site-header-bar{padding-left:18px!important;padding-right:18px!important}.site-header-nav{display:none!important}.site-header-cta{padding:8px 14px!important;font-size:.75rem!important;letter-spacing:.1em!important}}`}</style>
          </nav>
          <a href="#contact" className="btn-primary site-header-cta" style={{ padding: "10px 22px", fontSize: "0.8125rem" }}>Book Now</a>
        </div>
      </header>

      {/* HERO */}
      <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", background: "var(--bg)" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image src="/alexio-hero.jpg" alt="Alexio Gessa training at a Smith machine" fill priority style={{ objectFit: "cover", objectPosition: "62% 20%", filter: "grayscale(16%) contrast(1.04) brightness(0.64)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(14,14,14,0.92) 34%, rgba(14,14,14,0.52) 72%, rgba(14,14,14,0.18) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,14,14,0.96) 0%, transparent 58%)" }} />
        </div>

        <div className="container hero-copy" style={{ position: "relative", zIndex: 10, paddingTop: "160px", paddingBottom: "96px" }}>
          <div style={{ maxWidth: "760px" }}>
            <div className="section-label fade-up fade-up-1" style={{ marginBottom: "20px" }}>Independent personal training • Manhattan</div>
            <h1 className="fade-up fade-up-2" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(3.85rem,8.2vw,7.75rem)", lineHeight: 0.9, letterSpacing: "-0.02em", color: "var(--white)", marginBottom: "28px", maxWidth: "820px" }}>
              Train with someone who actually pays attention.
            </h1>
            <p className="fade-up fade-up-3" style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "clamp(1.05rem,1.55vw,1.25rem)", lineHeight: 1.75, color: "rgba(245,242,237,0.78)", maxWidth: "620px", marginBottom: "34px" }}>
              One-on-one strength, physique, and mobility coaching at MidCity Gym in Manhattan, plus virtual programming worldwide. Fifteen years of hands-on experience. No template programs.
            </p>
            <div className="fade-up fade-up-4" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px" }}>
              <a href="#contact" className="btn-primary">Book a Session</a>
              <a href="#portfolio" className="quiet-link">Or see his artwork →</a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(245,242,237,0.07)", background: "rgba(14,14,14,0.75)", backdropFilter: "blur(8px)" }}>
          <div id="hero-stats-grid" className="container" style={{ paddingTop: "24px", paddingBottom: "24px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px" }}>
            <style>{`@media(max-width:767px){#hero-stats-grid{grid-template-columns:repeat(2,1fr)!important;gap:18px 16px!important}}`}</style>
            {[["15+","Years Training"],["Kubert","School of Art"],["Manhattan","In-Person"],["Worldwide","Virtual"]].map(([n,l]) => (
              <div key={n}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.625rem", color: "var(--copper)" }}>{n}</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,242,237,0.4)", marginTop: "4px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: "var(--bg)" }}>
        <div className="container section-pad">
          <div id="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "center" }}>
            <style>{`@media(max-width:767px){#about-grid{grid-template-columns:1fr!important}}`}</style>
            <div style={{ display: "contents" }}>
              <Reveal>
                <div style={{ position: "relative", maxWidth: "500px" }}>
                  <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", border: "1px solid rgba(245,242,237,0.07)" }}>
                    <Image src="/alexio-about.jpg" alt="Alexio Gessa smiling in the gym with a shaker bottle" fill style={{ objectFit: "cover", objectPosition: "center top", filter: "grayscale(15%) contrast(1.05)" }} />
                  </div>
                  <div style={{ position: "absolute", top: "-12px", left: "-12px", width: "60px", height: "60px", borderTop: "3px solid var(--copper)", borderLeft: "3px solid var(--copper)" }} />
                  <div style={{ position: "absolute", bottom: "-12px", right: "-12px", width: "60px", height: "60px", borderBottom: "3px solid var(--copper)", borderRight: "3px solid var(--copper)" }} />
                  <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px", padding: "16px 20px", background: "rgba(14,14,14,0.9)", border: "1px solid rgba(200,118,42,0.3)", backdropFilter: "blur(8px)" }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.25rem", color: "var(--white)" }}>Alexio Gessa</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--copper)", marginTop: "4px" }}>Trainer — Artist — NYC</div>
                  </div>
                </div>
              </Reveal>

              <div>
                <Reveal>
                  <span className="section-label">About</span>
                  <div className="copper-rule" />
                  <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(2.75rem,5vw,5rem)", lineHeight: 0.93, letterSpacing: "-0.02em", color: "var(--white)", marginBottom: "32px" }}>
                    THE TRAINER<br />WHO DRAWS.
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "clamp(1rem,1.4vw,1.125rem)", lineHeight: 1.85, color: "rgba(245,242,237,0.62)", marginBottom: "20px" }}>
                    I have spent more than 15 years training people and building my own physique. My coaching is precise, attentive, and practical — built around programming, technique, mobility, and the consistency that actually produces results.
                  </p>
                  <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "clamp(1rem,1.4vw,1.125rem)", lineHeight: 1.85, color: "rgba(245,242,237,0.62)", marginBottom: "20px" }}>
                    I am also a trained visual artist and a graduate of the Joe Kubert School of Cartoon and Graphic Art. My work lives in portraiture, character illustration, figure drawing, and sequential storytelling.
                  </p>
                  <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "clamp(1rem,1.4vw,1.125rem)", lineHeight: 1.85, color: "rgba(245,242,237,0.62)", marginBottom: "40px" }}>
                    Both disciplines require discipline, an eye for detail, and a commitment to showing up. I bring the same approach to every client and every commission.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {["Natural Bodybuilding","Strength Training","Physique Development","Stretching & Mobility","Character Design","Figure Drawing"].map((t) => (
                      <span key={t} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "8px 14px", border: "1px solid rgba(200,118,42,0.3)", color: "var(--copper)" }}>{t}</span>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAINING */}
      <section id="training" style={{ background: "var(--bg-card)" }}>
        <div className="container section-pad">
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 64px" }}>
              <span className="section-label">Personal Training</span>
              <div className="copper-rule" style={{ margin: "16px auto 32px" }} />
              <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(2.75rem,5vw,5rem)", lineHeight: 0.93, letterSpacing: "-0.02em", color: "var(--white)", marginBottom: "24px" }}>
                BUILD SOMETHING<br />THAT LASTS.
              </h2>
              <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "clamp(1rem,1.4vw,1.125rem)", lineHeight: 1.8, color: "rgba(245,242,237,0.6)" }}>
                Results come from consistency, not guesswork. Alexio programs for your body, your schedule, and your goals — then coaches the details most people miss.
              </p>
            </div>
          </Reveal>

          <div id="training-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "960px", margin: "0 auto 40px" }}>
            <style>{`@media(max-width:767px){#training-grid{grid-template-columns:1fr!important}}`}</style>
            <div style={{ display: "contents" }}>
              {[
                { format: "In-Person", location: "MidCity Gym, Manhattan", rate: "$150", desc: "Private coaching for strength, physique, mobility, and better movement. Hands-on corrections, custom programming, and real accountability.", features: ["Custom programming","Technique coaching","Progress tracking","Nutrition guidance"] },
                { format: "Virtual", location: "Anywhere", rate: "$75", desc: "Remote coaching for people who want structure without guessing. Programming, form review, and feedback built around your equipment and schedule.", features: ["Live video sessions","Custom programming","Form review & feedback","Flexible scheduling"] },
              ].map((s, i) => (
                <Reveal key={s.format} delay={i * 0.1}>
                  <div className="card" style={{ padding: "clamp(32px,4vw,48px)", display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                      <div>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "2rem", color: "var(--white)" }}>{s.format}</div>
                        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--copper)", marginTop: "4px" }}>{s.location}</div>
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "3.25rem", color: "var(--copper)", lineHeight: 1 }}>{s.rate}</div>
                    </div>
                    <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "1.0625rem", lineHeight: 1.75, color: "rgba(245,242,237,0.58)", marginBottom: "28px", flex: 1 }}>{s.desc}</p>
                    <ul style={{ listStyle: "none", marginBottom: "32px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {s.features.map((f) => (
                        <li key={f} className="feature-item">
                          <span className="feature-dot" aria-hidden="true" />
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.6875rem", letterSpacing: "0.06em", color: "rgba(245,242,237,0.56)" }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#contact" className="btn-primary" style={{ textAlign: "center" }}>Book a Session</a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2}>
            <div style={{ maxWidth: "960px", margin: "0 auto", padding: "20px 28px", background: "rgba(200,118,42,0.05)", border: "1px solid rgba(200,118,42,0.2)", textAlign: "center" }}>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.75rem", color: "rgba(245,242,237,0.45)" }}>
                <span style={{ color: "var(--copper)" }}>Note —</span> Independent sessions take place at MidCity Gym, Manhattan. Packages and long-term rates available on request.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" style={{ background: "var(--bg)" }}>
        <div className="container section-pad">
          <Reveal>
            <div style={{ maxWidth: "640px", marginBottom: "56px" }}>
              <span className="section-label">Art Portfolio</span>
              <div className="copper-rule" />
              <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(2.75rem,5vw,5rem)", lineHeight: 0.93, letterSpacing: "-0.02em", color: "var(--white)", marginBottom: "24px" }}>
                CHARACTERS.<br />CONCEPTS.<br />CRAFT.
              </h2>
              <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "clamp(1rem,1.4vw,1.125rem)", lineHeight: 1.8, color: "rgba(245,242,237,0.6)" }}>
                Trained at the Joe Kubert School of Cartoon and Graphic Art. My work lives at the intersection of figure drawing, character design, and sequential storytelling.
              </p>
            </div>
          </Reveal>

          {/* Portfolio grid */}
          <Reveal delay={0.1}>
            <div id="portfolio-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "12px" }}>
              <style>{`@media(max-width:767px){#portfolio-grid{grid-template-columns:1fr!important}}`}</style>
                {[
                  { src: "/art-frankenstein.jpg", label: "Frankenstein", alt: "Painting of Frankenstein's monster against a coral background" },
                  { src: "/art-figure-sword.jpg", label: "Warrior Study", alt: "Painting of a woman holding a sword surrounded by green energy" },
                  { src: "/art-pie-portrait.jpg", label: "Still Life Portrait", alt: "Painting of a man in a hat beside a slice of pie on a plate" },
                ].map((item) => (
                  <div key={item.label} style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", border: "1px solid rgba(245,242,237,0.06)" }}>
                    <Image src={item.src} alt={item.alt} fill style={{ objectFit: "cover", filter: "grayscale(10%) contrast(1.05)", transition: "transform 0.6s ease" }} onMouseEnter={e => (e.currentTarget.style.transform="scale(1.04)")} onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(to top,rgba(14,14,14,0.85),transparent)" }}>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--copper)" }}>{item.label}</span>
                    </div>
                  </div>
                ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "40px" }}>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.1em", color: "rgba(245,242,237,0.2)" }}>Selected artwork by Alexio Gessa</p>
              <a href="#commissions" className="btn-outline">Commission a Piece</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMMISSIONS */}
      <section id="commissions" style={{ background: "var(--bg-card)" }}>
        <div className="container section-pad">
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 64px" }}>
              <span className="section-label">Art Commissions</span>
              <div className="copper-rule" style={{ margin: "16px auto 32px" }} />
              <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(2.75rem,5vw,5rem)", lineHeight: 0.93, letterSpacing: "-0.02em", color: "var(--white)", marginBottom: "24px" }}>
                COMMISSION<br />YOUR VISION.
              </h2>
              <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "clamp(1rem,1.4vw,1.125rem)", lineHeight: 1.8, color: "rgba(245,242,237,0.6)" }}>
                Portraits and character illustrations built with strong draftsmanship, expressive linework, and a comic-art foundation.
              </p>
            </div>
          </Reveal>

          <div id="commission-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", maxWidth: "1060px", margin: "0 auto 40px" }}>
            <style>{`@media(max-width:900px){#commission-grid{grid-template-columns:1fr!important}}`}</style>
            <div style={{ display: "contents" }}>
              {[
                { tier: "Pencil Sketch Portrait", desc: "A detailed portrait study with clean structure, likeness, and expressive pencil work. Best for personal portraits and character studies.", price: "$1,325", time: "By request", items: ["Pencil portrait study","High-res file","One revision"], featured: false },
                { tier: "Inked Character Illustration", desc: "A fully inked character piece with strong pose, silhouette, and comic-style linework.", price: "$150", time: "2-3 weeks", items: ["Pencils + inks","High-res file","Two revisions"], featured: true },
                { tier: "Full Color Piece", desc: "A fully realized color illustration for characters, scenes, cover concepts, or original artwork.", price: "$300+", time: "3-5 weeks", items: ["Full color rendering","Print-ready file","Multiple revisions"], featured: false },
              ].map((c, i) => (
                <Reveal key={c.tier} delay={0.08 + i * 0.08}>
                  <div className="card" style={{ padding: "clamp(28px,3vw,40px)", display: "flex", flexDirection: "column", position: "relative", height: "100%", ...(c.featured ? { borderColor: "rgba(200,118,42,0.45)" } : {}) }}>
                    {c.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "var(--copper)" }} />}
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--copper)", marginBottom: "12px" }}>{c.time}</div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.75rem", color: "var(--white)", marginBottom: "16px" }}>{c.tier}</div>
                    <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "rgba(245,242,237,0.55)", marginBottom: "24px", flex: 1 }}>{c.desc}</p>
                    <ul style={{ listStyle: "none", marginBottom: "28px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {c.items.map((item) => (
                        <li key={item} className="feature-item" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.06em", color: "rgba(245,242,237,0.52)" }}>
                          <span className="feature-dot" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="commission-price-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", borderTop: "1px solid rgba(245,242,237,0.07)", paddingTop: "24px" }}>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "3rem", color: "var(--copper)", lineHeight: 1 }}>{c.price}</span>
                      <a href="#contact" className={c.featured ? "btn-primary" : "btn-outline"} style={{ padding: "12px 22px", fontSize: "0.8125rem", textAlign: "center" }}>Request</a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.25}>
            <p style={{ textAlign: "center", fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.12em", color: "rgba(245,242,237,0.25)" }}>
              Commission scope, usage, and timeline confirmed before work begins. Commercial licensing available on request. 50% deposit required to begin.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ background: "var(--bg)" }}>
        <div className="container section-pad">
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: "580px", margin: "0 auto 56px" }}>
              <span className="section-label">Testimonials</span>
              <div className="copper-rule" style={{ margin: "16px auto 32px" }} />
              <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem,4vw,4rem)", lineHeight: 0.93, letterSpacing: "-0.02em", color: "var(--white)" }}>
                WHAT PEOPLE SAY.
              </h2>
            </div>
          </Reveal>
          <div id="testi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "960px", margin: "0 auto" }}>
            <style>{`@media(max-width:767px){#testi-grid{grid-template-columns:1fr!important}}`}</style>
            <div style={{ display: "contents" }}>
              {[
                { text: "Alexio is one of the most knowledgeable trainers I have worked with. He explains the why behind every movement. I made more progress in three months than I did in the previous year training on my own.", name: "Training Client", detail: "In-person, Manhattan" },
                { text: "The commission he did for me was incredible. He captured exactly what I had in my head, down to details I barely articulated. Fast, professional, and genuinely talented.", name: "Commission Client", detail: "Character illustration" },
              ].map((t, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <div className="testimonial-card" style={{ padding: "clamp(32px,4vw,48px)", display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "4rem", color: "var(--copper)", opacity: 0.3, lineHeight: 1, display: "block", marginBottom: "8px" }}>&ldquo;</span>
                    <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "1.0625rem", lineHeight: 1.8, color: "rgba(245,242,237,0.62)", marginBottom: "32px", flex: 1, paddingLeft: "20px" }}>{t.text}</p>
                    <div style={{ paddingLeft: "20px", paddingTop: "24px", borderTop: "1px solid rgba(245,242,237,0.07)" }}>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "var(--white)" }}>{t.name}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--copper)", marginTop: "4px" }}>{t.detail}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: "var(--bg-card)" }}>
        <div className="container section-pad">
          <div id="contact-grid" style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: "clamp(40px,6vw,100px)" }}>
            <style>{`@media(max-width:767px){#contact-grid{grid-template-columns:1fr!important}}`}</style>
            <div style={{ display: "contents" }}>
              <div>
                <Reveal>
                  <span className="section-label">Get In Touch</span>
                  <div className="copper-rule" />
                  <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(3.5rem,6vw,6rem)", lineHeight: 0.88, letterSpacing: "-0.02em", color: "var(--white)", marginBottom: "32px" }}>
                    LET&apos;S<br />WORK.
                  </h2>
                  <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "1.0625rem", lineHeight: 1.8, color: "rgba(245,242,237,0.58)", marginBottom: "48px" }}>
                    Training inquiry or art commission, send a few details and Alexio will follow up directly.
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  {[["Location","New York City"],["Training","In-person & virtual"],["Commissions","Open"],["Response","Within 24 hours"]].map(([k,v]) => (
                    <div key={k} style={{ display: "flex", gap: "24px", alignItems: "center", padding: "18px 0", borderBottom: "1px solid rgba(245,242,237,0.06)" }}>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--copper)", width: "100px", flexShrink: 0 }}>{k}</span>
                      <span style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "1rem", color: "rgba(245,242,237,0.52)" }}>{v}</span>
                    </div>
                  ))}
                </Reveal>
              </div>

              <Reveal delay={0.1}>
                <div style={{ background: "var(--bg-elevated)", border: "1px solid rgba(245,242,237,0.07)", padding: "clamp(32px,4vw,52px)" }}>
                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--bg)", borderTop: "1px solid rgba(245,242,237,0.06)" }}>
        <div className="container" style={{ paddingTop: "32px", paddingBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.75rem", color: "var(--copper)" }}>AG</span>
          <div style={{ display: "flex", gap: "32px" }}>
            {[["Training","#training"],["Portfolio","#portfolio"],["Commissions","#commissions"],["Contact","#contact"]].map(([l,h]) => (
              <a key={h} href={h} className="nav-link">{l}</a>
            ))}
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.625rem", color: "rgba(245,242,237,0.2)", letterSpacing: "0.1em" }}>
            &copy; {new Date().getFullYear()} Alexio Gessa
          </span>
        </div>
      </footer>
    </>
  );
}
