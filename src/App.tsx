import { useEffect, useRef, useState } from "react";
import { C, NAV, waHref } from "./data";

const IC: Record<string, string> = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevL: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  chevR: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
  arrowR: '<path d="M4 12h15M13.5 6l6 6-6 6"/>',
  ext: '<path d="M14 4h6v6"/><path d="M20 4L10.5 13.5"/><path d="M19 13.5V19a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 014 19V7a1.5 1.5 0 011.5-1.5H10"/>',
  shield: '<path d="M12 3l7 2.8v5.4c0 4.5-3 7.9-7 9.8-4-1.9-7-5.3-7-9.8V5.8L12 3z"/><path d="M9 12l2 2 4-4.2"/>',
  phone: '<path d="M5.5 4h3.6L10.5 8 8.6 9.7a12.5 12.5 0 005.7 5.7L16 13.5l4 1.4v3.6a2 2 0 01-2 2A16.5 16.5 0 013.5 6a2 2 0 012-2z"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7.5l8.5 6 8.5-6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
  check: '<path d="M4.5 12.5l5 5L19.5 7"/>',
  alert: '<path d="M12 3.5L2.5 20h19L12 3.5z"/><path d="M12 10v4.5"/><path d="M12 17.2v.01"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/><circle cx="12" cy="15.5" r="1.4"/>',
  whatsapp: '<path d="M12 3.5a8.5 8.5 0 00-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1012 3.5z"/><path d="M9.2 8.6l1 2.2-.8 1a9 9 0 004 4l1-.8 2.1 1c-.2 1.4-1 2-2.2 1.8-3.2-.6-5.9-3.3-6.5-6.5-.2-1.2.4-2 1.4-1.7z"/>',
  facebook: '<path d="M13.8 8.6V7.2c0-.8.3-1.2 1.4-1.2h1.6V3h-2.6A3.9 3.9 0 0010.2 7v1.6H7.8V12h2.4v8.5h3.6V12h2.6l.5-3.4h-3.1z" fill="currentColor" stroke="none"/>',
  youtube: '<rect x="2.5" y="6" width="19" height="12.5" rx="3.2"/><path d="M10.2 9.4l4.9 2.85-4.9 2.85V9.4z" fill="currentColor" stroke="none"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
  moon: '<path d="M20 13.5A8 8 0 1110.5 4a6.5 6.5 0 009.5 9.5z"/>',
};

function I({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={"flex-none " + className} dangerouslySetInnerHTML={{ __html: IC[name] || "" }} />
  );
}

function Rv({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = delay + "ms";
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (el.classList.add("rv-in"), io.disconnect())),
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref} className={"rv " + className}>{children}</div>;
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now(), dur = 1700;
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          el.textContent = Math.floor(value * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }),
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>0</span>;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const bnDigit = ["১", "২", "৩", "৪"];

export default function App() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [menu, setMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [solid, setSolid] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [copied, setCopied] = useState("");
  const [agentPaused, setAgentPaused] = useState(false);
  const [form, setForm] = useState({ name: "", agent: "", msg: "" });
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("nw-theme") === "light" ? "light" : "dark"));
  const agentRow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nw-theme", theme);
  }, [theme]);

  useEffect(() => {
    const t = setInterval(() => { if (!paused) setActive((a) => (a + 1) % C.slides.length); }, 6000);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    const t = setInterval(() => {
      const el = agentRow.current;
      if (!el || agentPaused) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: 276, behavior: "smooth" });
    }, 3200);
    return () => clearInterval(t);
  }, [agentPaused]);

  useEffect(() => {
    const on = () => { setSolid(window.scrollY > 30); setShowTop(window.scrollY > 600); };
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, []);

  const anchor = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
    setMenu(false);
  };

  const copyNum = (n: string) => {
    navigator.clipboard?.writeText("+" + n).catch(() => {});
    setCopied(n);
    setTimeout(() => setCopied(""), 1800);
  };

  const sendComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const body = "অভিযোগ — 9Wickets\n\nনাম/আইডি: " + form.name + "\nএজেন্ট: " + (form.agent || "-") + "\n\n" + form.msg;
    window.open(waHref(C.complaint.wa, body), "_blank");
  };

  const slide = C.slides[active];
  const socialIcons: Record<string, string> = { facebook: "facebook", youtube: "youtube", whatsapp: "whatsapp" };

  return (
    <div className="bg-ink-950 text-slate-200 font-body overflow-x-hidden">
      {/* preview ribbon */}
      <div className="bg-gold-500 text-ink-950 text-center font-mono text-[10px] tracking-[0.22em] py-1.5 uppercase font-bold">
        Static HTML build — production file: <span className="underline">ninewickets/index.html</span>
      </div>

      {/* ticker */}
      <div className="ticker mask-x bg-ink-900/80 border-b border-ink-700/60 text-[11px] sm:text-xs h-9 flex items-center overflow-hidden relative">
        <div className="ticker-track items-center">
          {[0, 1].map((dup) => (
            <span key={dup} className="inline-flex items-center font-mono tracking-wide text-slate-400" aria-hidden={dup === 1}>
              {C.ticker.map((it, i) => (
                <span key={i} className="inline-flex items-center">
                  <span className="px-5">{it}</span>
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold-500/70" />
                </span>
              ))}
            </span>
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full flex items-center gap-2 px-4 bg-ink-950/90 border-l border-ink-700/60 font-mono text-gold-400">
          <span className="dot-live w-1.5 h-1.5 rounded-full bg-pitch-400 text-pitch-400" /> 24/7
        </div>
      </div>

      {/* header */}
      <header className={"sticky top-0 z-50 transition-all duration-300 border-b " + (solid ? "hdr-solid bg-ink-950/88 backdrop-blur-[14px] border-gold-500/15 shadow-[0_12px_40px_-18px_rgba(0,0,0,.8)]" : "border-transparent")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[72px]">
          <a href="#top" onClick={(e) => anchor(e, "top")} className="flex items-center gap-3 group">
            <span className="w-11 h-11 rounded-full bg-white p-[3px] shadow-gold group-hover:scale-105 transition-transform">
              <img src={C.logo} alt="9 Wickets logo" className="w-full h-full rounded-full object-cover" />
            </span>
            <span className="leading-none">
              <span className="font-display text-2xl tracking-wide text-white uppercase block"><span className="text-gold-500">9</span> Wickets</span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-slate-500 uppercase">Official Agent List BD</span>
            </span>
          </a>
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-300 font-bn">
            {NAV.map((n) => (
              <a key={n.id} href={"#" + n.id} onClick={(e) => anchor(e, n.id)} className="hover:text-gold-400 transition-colors">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a href={"tel:" + C.contact.phoneRaw} className="hidden md:flex items-center gap-2 font-mono text-sm text-slate-300 hover:text-gold-400 transition-colors">
              <I name="phone" size={16} /> {C.contact.phone}
            </a>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-10 h-10 grid place-items-center rounded-full border border-ink-600 text-gold-400 hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950 transition-all active:scale-90" aria-label="Toggle theme">
              <I name={theme === "dark" ? "sun" : "moon"} size={17} />
            </button>
            <button onClick={() => setMenu(!menu)} className="lg:hidden w-10 h-10 grid place-items-center rounded-lg border border-ink-600 text-slate-200" aria-label="Menu">
              <I name={menu ? "close" : "menu"} size={20} />
            </button>
          </div>
        </div>
        {menu && (
          <div className="lg:hidden bg-ink-900/95 backdrop-blur border-t border-ink-700 px-6 py-4 space-y-1 font-bn">
            {NAV.map((n) => (
              <a key={n.id} href={"#" + n.id} onClick={(e) => anchor(e, n.id)} className="flex items-center justify-between py-2.5 border-b border-ink-700/60 text-slate-200 font-semibold hover:text-gold-400">
                {n.label} <I name="chevR" size={16} className="text-slate-500" />
              </a>
            ))}
            <a href={waHref(C.contact.wa, "আসসালামু আলাইকুম, আমার একটা সাহায্য লাগবে।")} target="_blank" rel="noopener" className="mt-3 flex justify-center items-center gap-2 bg-gold-500 text-ink-950 font-extrabold py-3 rounded-full">
              <I name="whatsapp" size={17} /> WhatsApp-এ মেসেজ করুন
            </a>
          </div>
        )}
      </header>

      <main id="top">
        {/* hero */}
        <section className="relative min-h-[82vh] flex items-center overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {C.slides.map((s, i) => (
            <div key={i} className={"absolute inset-0 transition-opacity duration-1000 " + (active === i ? "opacity-100" : "opacity-0 pointer-events-none")}>
              <img src={s.image} alt={s.title} className={"absolute inset-0 w-full h-full object-cover " + (active === i ? "kenburns" : "")} />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/75 to-ink-950/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />
            </div>
          ))}
          <div className="absolute inset-0 grain opacity-40 pointer-events-none" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2.5 bg-ink-900/70 backdrop-blur border border-gold-500/30 rounded-full px-3.5 sm:px-4 py-1.5 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-gold-400 uppercase">
                <span className="dot-live w-2 h-2 rounded-full bg-pitch-400 text-pitch-400" />
                {slide.kicker}
              </span>
              <h1 className="mt-5 font-bn font-bold text-white leading-[1.1] text-[1.9rem] sm:text-5xl xl:text-6xl">
                {slide.title}
                <span className="block h-1.5 sm:h-2 w-20 sm:w-32 bg-gold-500 rounded-full mt-4 sm:mt-5" />
              </h1>
              <p className="mt-5 text-slate-300/90 text-sm sm:text-lg leading-relaxed max-w-xl font-bn">{slide.text}</p>
              <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a href={slide.link} onClick={(e) => anchor(e, slide.link.slice(1))} className="inline-flex justify-center items-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-ink-950 font-extrabold px-8 py-4 rounded-full text-base font-bn transition-all hover:shadow-gold active:scale-95">
                  {slide.cta} <I name="arrowR" size={18} />
                </a>
                <a href={waHref(C.contact.wa, "আসসালামু আলাইকুম, আমার একটা সাহায্য লাগবে।")} target="_blank" rel="noopener" className="inline-flex justify-center items-center gap-2.5 border-2 border-slate-500/60 hover:border-gold-500 text-white hover:text-gold-400 font-bold px-7 py-[15px] rounded-full font-bn transition-all active:scale-95">
                  <I name="whatsapp" size={19} /> সরাসরি মেসেজ করুন
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                {["বিকাশ", "নগদ", "রকেট", "উপায়", "২৪/৭ সাপোর্ট"].map((p) => (
                  <span key={p} className="font-bn text-[11px] tracking-wide text-slate-400 border border-ink-600 bg-ink-900/60 rounded-full px-3.5 py-1.5">{p}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {C.slides.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} aria-label={"Slide " + (i + 1)} className={"h-1.5 rounded-full transition-all duration-500 " + (active === i ? "w-10 bg-gold-500" : "w-5 bg-slate-500/50 hover:bg-slate-400")} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-500 tracking-widest">{pad2(active + 1)} / {pad2(C.slides.length)}</span>
                <button onClick={() => setActive((active - 1 + C.slides.length) % C.slides.length)} className="w-10 h-10 grid place-items-center rounded-full border border-slate-600/60 text-slate-300 hover:border-gold-500 hover:text-gold-400 transition-colors" aria-label="Previous"><I name="chevL" size={18} /></button>
                <button onClick={() => setActive((active + 1) % C.slides.length)} className="w-10 h-10 grid place-items-center rounded-full border border-slate-600/60 text-slate-300 hover:border-gold-500 hover:text-gold-400 transition-colors" aria-label="Next"><I name="chevR" size={18} /></button>
              </div>
            </div>
          </div>
        </section>

        {/* stats */}
        <section className="lx border-y border-ink-700/70 bg-ink-900/50">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink-700/50">
            {C.stats.map((st, i) => (
              <Rv key={i} delay={i * 90} className="bg-ink-950 py-8 sm:py-10 px-3 sm:px-8 text-center">
                <div className="font-mono text-2xl sm:text-4xl font-bold text-gold-400"><Counter value={st.value} />{st.suffix}</div>
                <div className="mt-2 font-bn text-[11px] sm:text-xs font-semibold text-slate-500">{st.label}</div>
              </Rv>
            ))}
          </div>
        </section>

        {/* why — verification ledger */}
        <section id="why" className="lx py-20 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 right-0 w-[34rem] h-[34rem] bg-gold-500/8 rounded-full blur-3xl" />
            <div className="absolute inset-0 why-grid" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative grid lg:grid-cols-[400px_1fr] gap-12 lg:gap-16">
            <Rv className="lg:sticky lg:top-28 self-start">
              <span className="font-mono text-[11px] tracking-[0.35em] text-gold-500 uppercase">{C.why.kicker}</span>
              <h2 className="mt-3 font-bn font-bold text-white text-3xl sm:text-5xl leading-[1.15]">{C.why.title}</h2>
              <span className="block h-1.5 w-24 bg-gold-500 rounded-full mt-5" />
              <p className="mt-5 text-slate-400 leading-relaxed font-bn">{C.why.intro}</p>
              <div className="mt-9 flex items-center gap-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-none">
                  <svg viewBox="0 0 120 120" className="w-full h-full seal-spin">
                    <defs><path id="sealPath" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" /></defs>
                    <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold-500/30" />
                    <text className="fill-gold-500" style={{ fontSize: "10px", letterSpacing: "3px", fontFamily: "'JetBrains Mono',monospace" }}>
                      <textPath href="#sealPath">OFFICIAL • VERIFIED • 9WICKETS •</textPath>
                    </text>
                  </svg>
                  <span className="absolute inset-0 grid place-items-center text-gold-400"><I name="shield" size={34} /></span>
                </div>
                <div>
                  <p className="font-mono text-3xl sm:text-4xl font-bold text-gold-400">১০০%</p>
                  <p className="mt-1 font-bn text-sm text-slate-400 leading-snug">যাচাইকৃত এজেন্ট<br />কোম্পানির গ্যারান্টি</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["ঢাকা", "চট্টগ্রাম", "সিলেট", "+ ৬১ জেলা"].map((z) => (
                      <span key={z} className="font-bn text-[10px] text-slate-400 border border-ink-600 rounded-full px-2.5 py-1">{z}</span>
                    ))}
                  </div>
                </div>
              </div>
              <a href="#agents" onClick={(e) => anchor(e, "agents")} className="mt-8 inline-flex items-center gap-2 text-gold-400 font-bold text-sm font-bn hover:gap-3.5 transition-all">
                এজেন্ট লিস্ট দেখুন <I name="arrowR" size={16} />
              </a>
            </Rv>

            <div>
              {C.why.items.filter((x) => x.icon !== "alert").map((f, i) => (
                <Rv key={i} delay={i * 90}>
                  <div className="group relative flex gap-5 sm:gap-7 py-7 sm:py-8 border-b border-dashed border-ink-600/70">
                    <span className="font-display text-4xl sm:text-6xl leading-none pt-1 text-ink-500/60 group-hover:text-gold-500 transition-colors duration-300">০{["১", "২", "৩", "৪"][i]}</span>
                    <span className="flex-none w-12 h-12 sm:w-14 sm:h-14 grid place-items-center rounded-full border-2 border-dashed border-gold-500/40 text-gold-400 transition-all duration-300 group-hover:border-solid group-hover:bg-gold-500 group-hover:text-ink-950 group-hover:rotate-6">
                      <I name={f.icon} size={22} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bn font-bold text-white text-lg sm:text-2xl leading-snug">{f.title}</h3>
                      <p className="mt-2 text-slate-400 text-sm sm:text-[15px] leading-relaxed font-bn">{f.text}</p>
                    </div>
                  </div>
                </Rv>
              ))}
              <Rv delay={380}>
                <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row gap-5">
                  <span className="flex-none w-12 h-12 grid place-items-center rounded-full bg-red-500/15 border border-red-500/40 text-red-400">
                    <I name="alert" size={24} />
                  </span>
                  <div>
                    <h3 className="font-bn font-bold text-white text-lg sm:text-xl">ভুয়া এজেন্ট থেকে সাবধান</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed font-bn">
                      {C.why.items.find((x) => x.icon === "alert")?.text} এমন কেউ মেসেজ দিলে স্ক্রিনশট নিয়ে সাথে সাথে অভিযোগ কেন্দ্রে পাঠান — আপনার একটু সাবধানতা অন্যকেও বাঁচাবে।
                    </p>
                    <a href="#complaint" onClick={(e) => anchor(e, "complaint")} className="mt-4 inline-flex items-center gap-2 text-red-400 font-bold text-sm font-bn hover:gap-3.5 transition-all">
                      অভিযোগ জানাবেন এখানে <I name="arrowR" size={15} />
                    </a>
                  </div>
                </div>
              </Rv>
            </div>
          </div>
        </section>

        {/* agents */}
        <section id="agents" className="lx py-20 sm:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <Rv className="max-w-2xl">
                <span className="font-mono text-[11px] tracking-[0.35em] text-gold-500 uppercase">{C.agents.kicker}</span>
                <h2 className="mt-3 font-bn font-bold text-white text-3xl sm:text-5xl leading-tight">{C.agents.title}</h2>
                <p className="mt-4 text-slate-400 leading-relaxed font-bn">{C.agents.intro}</p>
              </Rv>
              <Rv delay={120}>
                <span className="font-mono text-xs text-pitch-400 border border-pitch-500/40 bg-pitch-500/10 rounded-full px-4 py-2 w-fit flex items-center gap-2">
                  <I name="shield" size={15} /> {C.agents.verifiedOn}
                </span>
              </Rv>
            </div>

            <Rv className="mt-10">
              <div className="relative rounded-3xl overflow-hidden border border-gold-500/30 shadow-card group">
                <img src={C.agents.banner} alt="9Wickets official master agent network" className="w-full h-52 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-gold-400 uppercase">Official Agent Portal</span>
                  <p className="mt-2 font-bn font-bold text-white text-xl sm:text-3xl leading-snug max-w-md">লিস্টে থাকা এজেন্টের সাথে লেনদেন করলে পুরো দায়ভার কোম্পানির</p>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md font-bn">বাইরের কারো সাথে লেনদেন করলে আমরা কোনো দায়ভার নিতে পারবো না — তাই আগে নাম্বার মিলিয়ে নিন।</p>
                </div>
              </div>
            </Rv>

            <div className="mt-8 grid lg:grid-cols-[1.15fr_1fr] gap-5 items-stretch">
              <Rv className="h-full">
                <div className="relative bg-ink-900 border border-gold-500/30 rounded-3xl overflow-hidden shadow-card h-full flex flex-col">
                  <div className="grid sm:grid-cols-[240px_1fr] flex-1">
                    <div className="relative h-56 sm:h-auto">
                      <img src={C.agents.master.image} alt={C.agents.master.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-ink-900/90 via-ink-900/20 to-transparent" />
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-[10px] tracking-[0.25em] uppercase bg-gold-500 text-ink-950 font-bold rounded-full px-3.5 py-1.5">{C.agents.master.role}</span>
                        <span className="font-mono text-[10px] tracking-wider uppercase text-pitch-400 border border-pitch-500/40 bg-pitch-500/10 rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
                          <I name="check" size={12} /> {C.agents.master.badge}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display uppercase text-3xl text-white tracking-wide">{C.agents.master.name}</h3>
                      <p className="mt-2 text-sm text-slate-400 font-bn">একাউন্ট, লেনদেন বা এজেন্ট যাচাই — বড় যেকোনো বিষয়ে সরাসরি এডমিনের সাথে কথা বলুন। এই নাম্বারে করা লেনদেনের দায়ভার পুরোপুরি কোম্পানির।</p>
                      <div className="mt-5 space-y-2.5">
                        <a href={waHref(C.agents.master.wa)} target="_blank" rel="noopener" className="flex items-center gap-3 bg-pitch-500 hover:brightness-110 text-ink-950 font-bold text-sm rounded-xl px-5 py-3.5 transition-all active:scale-[.98] w-fit font-bn">
                          <I name="whatsapp" size={18} /> WhatsApp {C.agents.master.phone}
                        </a>
                        <div className="flex flex-wrap gap-2.5">
                          <a href={"tel:" + C.agents.master.phoneRaw} className="flex items-center gap-2 border border-ink-600 hover:border-gold-500 hover:text-gold-400 text-slate-300 font-semibold text-sm rounded-xl px-4 py-3 transition-colors font-bn">
                            <I name="phone" size={16} /> কল করুন
                          </a>
                          <a href={"mailto:" + C.agents.master.email} className="flex items-center gap-2 border border-ink-600 hover:border-gold-500 hover:text-gold-400 text-slate-300 font-semibold text-sm rounded-xl px-4 py-3 transition-colors">
                            <I name="mail" size={16} /> Email
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 sm:px-8 py-4 bg-ink-950/60 border-t border-ink-700/70 flex items-center gap-3">
                    <I name="shield" size={18} className="text-gold-400" />
                    <p className="text-xs text-slate-400 font-bn">এই নাম্বার ছাড়া অন্য কেউ "এডমিন" দাবি করলে বিশ্বাস করবেন না।</p>
                  </div>
                </div>
              </Rv>

              <Rv delay={120} className="h-full">
                <div className="grid gap-4 auto-rows-fr h-full">
                  {C.agents.subs.map((s) => (
                    <div key={s.id} className="group flex items-center gap-4 bg-ink-900 border border-ink-700/80 rounded-2xl p-4 pr-5 transition-all duration-300 hover:border-gold-500/50 hover:-translate-y-0.5">
                      <img src={s.image} alt={s.name} className="w-16 h-16 rounded-xl object-cover border border-ink-600" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-gold-500/15 text-gold-400 border border-gold-500/30 rounded px-1.5 py-0.5 flex-none">{s.id}</span>
                          <h4 className="font-bold text-white truncate text-sm sm:text-base font-bn">{s.name}</h4>
                          <span className="w-1.5 h-1.5 rounded-full bg-pitch-400 dot-live text-pitch-400 flex-none" />
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-bn truncate mt-0.5">{s.role} • {s.zone}</p>
                      </div>
                      <div className="flex-none flex items-center gap-1.5">
                        <button onClick={() => copyNum(s.wa)} className={"w-9 h-9 grid place-items-center rounded-full border transition-all active:scale-90 " + (copied === s.wa ? "border-pitch-500 text-pitch-400" : "border-ink-600 text-slate-400 hover:border-gold-500 hover:text-gold-400")} title={copied === s.wa ? "Copy হয়েছে!" : "নাম্বার কপি"}>
                          <I name={copied === s.wa ? "check" : "phone"} size={15} />
                        </button>
                        <a href={waHref(s.wa)} target="_blank" rel="noopener" className="w-10 h-10 grid place-items-center rounded-full bg-pitch-500/15 border border-pitch-500/40 text-pitch-400 hover:bg-pitch-500 hover:text-ink-950 transition-all active:scale-90" aria-label="WhatsApp">
                          <I name="whatsapp" size={17} />
                        </a>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-2xl border border-dashed border-ink-600 p-5 flex items-center gap-4">
                    <I name="alert" size={22} className="text-gold-500" />
                    <p className="text-xs text-slate-400 leading-relaxed font-bn">যাদের নাম এই লিস্টে নেই, তাদের সাথে কোনো লেনদেন করবেন না — টাকা হারালে কোম্পানি দায়ী নয়।</p>
                  </div>
                </div>
              </Rv>
            </div>

            {/* agent carousel */}
            <div className="mt-12 sm:mt-14">
              <Rv>
                <div className="flex items-end justify-between gap-4">
                  <h3 className="font-bn font-bold text-xl sm:text-2xl text-white flex items-center gap-3">
                    <span className="w-8 h-[3px] bg-gold-500 rounded-full inline-block" /> ভেরিফাইড মাস্টার এজেন্ট
                  </h3>
                  <div className="flex items-center gap-2.5">
                    <span className="hidden sm:flex font-mono text-[10px] tracking-widest text-slate-500 items-center gap-2"><span className="dot-live w-1.5 h-1.5 rounded-full bg-pitch-400 text-pitch-400" /> {C.agents.list.length} জন সক্রিয়</span>
                    <button onClick={() => agentRow.current?.scrollBy({ left: -560, behavior: "smooth" })} className="w-9 h-9 grid place-items-center rounded-full border border-slate-600/60 text-slate-300 hover:border-gold-500 hover:text-gold-400 transition-colors" aria-label="Previous agents"><I name="chevL" size={16} /></button>
                    <button onClick={() => agentRow.current?.scrollBy({ left: 560, behavior: "smooth" })} className="w-9 h-9 grid place-items-center rounded-full border border-slate-600/60 text-slate-300 hover:border-gold-500 hover:text-gold-400 transition-colors" aria-label="Next agents"><I name="chevR" size={16} /></button>
                  </div>
                </div>
              </Rv>
              <div ref={agentRow} onMouseEnter={() => setAgentPaused(true)} onMouseLeave={() => setAgentPaused(false)} className="mt-6 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
                {C.agents.list.map((a) => (
                  <div key={a.id} className="snap-start flex-none w-[236px] sm:w-[260px] bg-ink-900 border border-ink-700/80 rounded-2xl p-5 hover:border-gold-500/50 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 grid place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 font-display text-lg">{a.name.charAt(0)}</span>
                      <span className="font-mono text-[10px] tracking-wider text-slate-500 bg-ink-800 border border-ink-600 rounded-full px-2.5 py-1">ID {a.id}</span>
                    </div>
                    <h4 className="mt-3.5 font-bold text-white text-base truncate font-bn">{a.name}</h4>
                    <p className="font-bn text-[11px] text-gold-500/80 mt-0.5">মাস্টার এজেন্ট</p>
                    <div className="mt-4 flex items-center gap-2">
                      <a href={waHref(a.wa)} target="_blank" rel="noopener" className="flex-1 flex items-center justify-center gap-2 bg-pitch-500 hover:brightness-110 text-ink-950 font-extrabold text-xs rounded-lg py-2.5 transition-all active:scale-95 font-bn">
                        <I name="whatsapp" size={14} /> মেসেজ করুন
                      </a>
                      <button onClick={() => copyNum(a.wa)} className={"w-9 h-9 grid place-items-center rounded-lg border transition-all active:scale-90 " + (copied === a.wa ? "border-pitch-500 text-pitch-400" : "border-ink-600 text-slate-400 hover:border-gold-500 hover:text-gold-400")} title={copied === a.wa ? "Copy হয়েছে!" : "নাম্বার কপি"}>
                        <I name={copied === a.wa ? "check" : "phone"} size={14} />
                      </button>
                    </div>
                    {copied === a.wa && <p className="mt-2 text-center font-bn text-[11px] text-pitch-400">নাম্বার কপি হয়েছে ✓</p>}
                  </div>
                ))}
              </div>
              <p className="font-bn text-[11px] text-slate-500">শুধু উপরের নাম্বারগুলোই অফিসিয়াল। সর্বশেষ যাচাই: {C.agents.verifiedOn}, এডমিন {C.agents.master.name}-এর সাথে মিলিয়ে।</p>
            </div>

            {/* guide table */}
            <Rv className="mt-10 sm:mt-12">
              <h3 className="font-bn font-bold text-xl sm:text-2xl text-white flex items-center gap-3">
                <span className="w-8 h-[3px] bg-gold-500 rounded-full inline-block" /> কাকে কখন মেসেজ করবেন
              </h3>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-700/80">
                <table className="w-full text-sm min-w-[520px] sm:min-w-0">
                  <thead>
                    <tr className="bg-ink-900 text-left font-bn text-xs font-bold text-slate-500">
                      <th className="px-4 sm:px-5 py-3.5">আপনার দরকার</th>
                      <th className="px-4 sm:px-5 py-3.5">কার সাথে কথা বলবেন</th>
                      <th className="px-4 sm:px-5 py-3.5">গাইড</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-700/60">
                    {C.agents.guide.map((g, i) => (
                      <tr key={i} className="bg-ink-900/40 hover:bg-ink-800/60 transition-colors">
                        <td className="px-4 sm:px-5 py-4 font-bold text-white font-bn">{g.task}</td>
                        <td className="px-4 sm:px-5 py-4 text-slate-300 font-bn">{g.who}</td>
                        <td className="px-4 sm:px-5 py-4">
                          <a href={g.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-gold-400 font-semibold hover:text-gold-300 transition-colors whitespace-nowrap font-bn">
                            {g.label} <I name="ext" size={12} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 font-bn text-xs text-slate-500">এজেন্ট ১ ঘণ্টার মধ্যে রিপ্লাই না দিলে তার মাস্টার এজেন্টকে, আর বড় সমস্যায় সরাসরি এডমিনকে জানান।</p>
            </Rv>

            {/* safe account */}
            <Rv className="mt-12 sm:mt-14">
              <div className="grid md:grid-cols-[240px_1fr] gap-7 items-center bg-ink-900 border border-ink-700/80 rounded-3xl p-6 sm:p-9">
                <div className="relative mx-auto w-44 md:w-full">
                  <div className="absolute -inset-3 bg-gold-500/10 rounded-3xl blur-xl" />
                  <img src={C.agents.peopleImg} alt="9Wickets verified agents" className="relative w-full rounded-2xl" />
                </div>
                <div>
                  <span className="font-mono text-[11px] tracking-[0.3em] text-gold-500 uppercase">নতুন ইউজার?</span>
                  <h3 className="mt-2 font-bn font-bold text-xl sm:text-3xl text-white leading-snug">নিরাপদে একাউন্ট খুলুন — যাচাই করা এজেন্টের মাধ্যমে</h3>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xl font-bn">উপরের লিস্ট থেকে যেকোনো একজন এজেন্টকে WhatsApp-এ মেসেজ দিন। উনি আপনার নাম্বার দিয়ে একাউন্ট খুলে দেবেন — মাত্র ৪ মিনিটের কাজ। তারপর বিকাশ/নগদ দিয়ে টাকা ঢুকিয়ে ব্যবহার শুরু করতে পারবেন।</p>
                  <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-3">
                    <a href={C.agents.guide[0].url} target="_blank" rel="noopener" className="inline-flex justify-center items-center gap-2 bg-gold-500 hover:bg-gold-400 text-ink-950 font-extrabold text-sm px-6 py-3 rounded-full transition-all hover:shadow-gold active:scale-95 font-bn">
                      একাউন্ট খোলার নিয়ম <I name="ext" size={14} />
                    </a>
                    <a href={waHref(C.agents.cs[0].wa)} target="_blank" rel="noopener" className="inline-flex justify-center items-center gap-2 border-2 border-slate-600 hover:border-pitch-500 hover:text-pitch-400 text-slate-200 font-bold text-sm px-6 py-[10px] rounded-full transition-all active:scale-95 font-bn">
                      <I name="whatsapp" size={16} /> CS1-কে জিজ্ঞেস করুন
                    </a>
                  </div>
                </div>
              </div>
            </Rv>

            {/* steps */}
            <Rv className="mt-12 sm:mt-14">
              <h3 className="font-bn font-bold text-xl sm:text-2xl text-white flex items-center gap-3">
                <span className="w-8 h-[3px] bg-gold-500 rounded-full inline-block" /> নিরাপদে লেনদেনের ৪ ধাপ
              </h3>
              <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {C.agents.steps.map((st, i) => (
                  <div key={i} className="relative bg-ink-900/60 border border-ink-700/70 rounded-2xl p-6 hover:border-gold-500/40 transition-colors">
                    <span className="font-mono text-4xl font-bold text-gold-500/25 absolute top-4 right-5">0{i + 1}</span>
                    <span className="font-mono text-xs text-gold-400 tracking-widest">ধাপ ০{bnDigit[i]}</span>
                    <h4 className="mt-2 font-bold text-white font-bn">{st.title}</h4>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed font-bn">{st.text}</p>
                  </div>
                ))}
              </div>
            </Rv>
          </div>
        </section>

        {/* support */}
        <section id="support" className="lx py-20 sm:py-24 bg-ink-900/40 border-y border-ink-700/60 relative overflow-hidden">
          <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-gold-500/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-14 items-center relative">
            <Rv className="relative max-w-md mx-auto lg:mx-0 w-full">
              <div className="absolute -inset-3 border-2 border-gold-500/30 rounded-3xl translate-x-4 translate-y-4" />
              <img src={C.support.image} alt="9Wickets customer service" className="relative rounded-3xl w-full object-cover aspect-[4/3] shadow-card" />
              <span className="absolute -top-4 -right-3 sm:-right-6 bg-gold-500 text-ink-950 font-display text-lg px-5 py-2.5 rounded-xl rotate-3 shadow-gold flex items-center gap-2">
                <I name="clock" size={18} /> 24 / 7
              </span>
            </Rv>
            <Rv delay={120}>
              <span className="font-mono text-[11px] tracking-[0.35em] text-gold-500 uppercase">{C.support.kicker}</span>
              <h2 className="mt-3 font-bn font-bold text-white text-3xl sm:text-5xl leading-tight">{C.support.title}</h2>
              <p className="mt-5 text-slate-400 leading-relaxed font-bn">{C.support.text}</p>
              <ul className="mt-7 space-y-3">
                {C.support.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-none w-6 h-6 grid place-items-center rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 mt-0.5"><I name="check" size={13} /></span>
                    <span className="text-sm text-slate-300 font-medium font-bn">{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 grid sm:grid-cols-2 gap-3 max-w-lg">
                {C.agents.cs.map((cs) => (
                  <div key={cs.tag} className="bg-ink-900 border border-ink-700/80 rounded-xl p-4 hover:border-gold-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-widest bg-gold-500 text-ink-950 font-bold rounded px-2 py-0.5">{cs.tag}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] text-pitch-400"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 dot-live text-pitch-400" /> ONLINE</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-white font-bn">{cs.name}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <a href={waHref(cs.wa)} target="_blank" rel="noopener" className="flex-1 flex items-center justify-center gap-2 bg-pitch-500 hover:brightness-110 text-ink-950 font-extrabold text-xs rounded-lg py-2.5 transition-all active:scale-95 font-bn">
                        <I name="whatsapp" size={14} /> মেসেজ
                      </a>
                      <button onClick={() => copyNum(cs.wa)} className={"w-9 h-9 grid place-items-center rounded-lg border transition-all active:scale-90 " + (copied === cs.wa ? "border-pitch-500 text-pitch-400" : "border-ink-600 text-slate-400 hover:border-gold-500 hover:text-gold-400")}>
                        <I name={copied === cs.wa ? "check" : "phone"} size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className="font-bn text-[11px] text-slate-400 border border-ink-600 rounded-full px-3.5 py-1.5">{C.support.hours}</span>
                <span className="font-bn text-[11px] text-pitch-400 border border-pitch-500/40 bg-pitch-500/10 rounded-full px-3.5 py-1.5">{C.support.avgReply}</span>
              </div>
            </Rv>
          </div>
        </section>

        {/* complaint */}
        <section id="complaint" className="lx py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Rv>
              <div className="relative overflow-hidden bg-ink-900 border border-red-500/30 rounded-3xl shadow-card">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-gold-500 to-red-500" />
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-red-500/10 blur-3xl" />
                <div className="p-6 sm:p-12 grid lg:grid-cols-2 gap-8 lg:gap-10 relative">
                  <div>
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-red-400 uppercase">
                      <I name="alert" size={14} /> {C.complaint.kicker}
                    </span>
                    <h2 className="mt-3 font-bn font-bold text-white text-3xl sm:text-5xl leading-tight">{C.complaint.title}</h2>
                    <p className="mt-4 text-slate-400 leading-relaxed font-bn">{C.complaint.text}</p>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      <span className="font-bn text-xs bg-gold-500 text-ink-950 font-bold rounded-full px-4 py-2 flex items-center gap-1.5"><I name="clock" size={13} /> {C.complaint.sla}</span>
                    </div>
                    <div className="mt-7 grid sm:grid-cols-3 gap-3">
                      <a href={waHref(C.complaint.wa)} target="_blank" rel="noopener" className="flex flex-col items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-600 hover:border-gold-500/60 rounded-xl py-4 text-sm font-bold text-slate-200 transition-all font-bn">
                        <I name="whatsapp" size={20} className="text-pitch-400" /> WhatsApp
                      </a>
                      <a href={"mailto:" + C.complaint.email} className="flex flex-col items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-600 hover:border-gold-500/60 rounded-xl py-4 text-sm font-bold text-slate-200 transition-all">
                        <I name="mail" size={20} className="text-gold-400" /> Email
                      </a>
                      <a href={"tel:" + C.complaint.phoneRaw} className="flex flex-col items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-600 hover:border-gold-500/60 rounded-xl py-4 text-sm font-bold text-slate-200 transition-all font-bn">
                        <I name="phone" size={20} className="text-gold-400" /> কল
                      </a>
                    </div>
                  </div>
                  <form onSubmit={sendComplaint} className="bg-ink-950/70 border border-ink-700 rounded-2xl p-5 sm:p-7 space-y-4">
                    <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-slate-500">দ্রুত অভিযোগ — সরাসরি WhatsApp-এ যাবে</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="text" required placeholder="আপনার নাম / ইউজার আইডি" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-ink-900 border border-ink-600 focus:border-gold-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-bn" />
                      <input type="text" placeholder="এজেন্টের নাম (যদি থাকে)" value={form.agent} onChange={(e) => setForm({ ...form, agent: e.target.value })} className="w-full bg-ink-900 border border-ink-600 focus:border-gold-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-bn" />
                    </div>
                    <textarea rows={4} required placeholder="কী হয়েছে খুলে লিখুন — কত টাকা, কখন, কোন নাম্বারে…" value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} className="w-full bg-ink-900 border border-ink-600 focus:border-gold-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors resize-none font-bn" />
                    <button type="submit" className="w-full flex items-center justify-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-ink-950 font-extrabold py-4 rounded-xl transition-all hover:shadow-gold active:scale-[.99] font-bn">
                      <I name="whatsapp" size={18} /> অভিযোগ পাঠিয়ে দিন
                    </button>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-bn">{C.complaint.note}</p>
                  </form>
                </div>
              </div>
            </Rv>
          </div>
        </section>

        {/* faq */}
        <section id="faq" className="lx py-20 sm:py-24 bg-ink-900/40 border-t border-ink-700/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[360px_1fr] gap-10 lg:gap-12">
            <Rv className="lg:sticky lg:top-28 self-start h-fit">
              <span className="font-mono text-[11px] tracking-[0.35em] text-gold-500 uppercase">FAQ</span>
              <h2 className="mt-3 font-bn font-bold text-white text-3xl sm:text-5xl leading-tight">যা সবাই জিজ্ঞেস করে</h2>
              <p className="mt-4 text-slate-400 leading-relaxed font-bn">একাউন্ট, টাকা, এজেন্ট নিয়ে সবচেয়ে বেশি যে প্রশ্নগুলো আসে — সহজ ভাষায় উত্তর দিলাম।</p>
              <div className="mt-8 bg-ink-900 border border-ink-700 rounded-2xl p-6">
                <p className="text-sm text-slate-300 font-semibold font-bn">আপনার প্রশ্নের উত্তর পেলেন না?</p>
                <p className="mt-1 text-xs text-slate-500 font-bn">মানুষই রিপ্লাই দেয়, গড়ে ৩ মিনিটে — রাত-দিন।</p>
                <a href={waHref(C.contact.wa)} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 bg-pitch-500 hover:brightness-110 text-ink-950 font-extrabold text-sm px-5 py-3 rounded-full transition-all active:scale-95 font-bn">
                  <I name="whatsapp" size={16} /> WhatsApp-এ জিজ্ঞেস করুন
                </a>
              </div>
            </Rv>
            <Rv delay={100} className="space-y-3">
              {C.faq.map((f, i) => (
                <div key={i} className={"bg-ink-900 border rounded-2xl transition-colors " + (faqOpen === i ? "border-gold-500/50" : "border-ink-700/80 hover:border-ink-500")}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5">
                    <span className="flex items-center gap-3 sm:gap-4">
                      <span className="font-mono text-xs text-gold-500/70 flex-none">Q{pad2(i + 1)}</span>
                      <span className="font-bold text-white text-sm sm:text-base font-bn">{f.q}</span>
                    </span>
                    <span className={"flex-none w-8 h-8 grid place-items-center rounded-full border transition-all duration-300 " + (faqOpen === i ? "border-gold-500 bg-gold-500 text-ink-950 rotate-45" : "border-ink-500 text-slate-400")}>
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </button>
                  <div className={"acc-body " + (faqOpen === i ? "open" : "")}>
                    <div className="acc-inner"><p className="px-5 sm:px-6 pb-6 sm:pl-[4.25rem] text-sm text-slate-400 leading-relaxed font-bn">{f.a}</p></div>
                  </div>
                </div>
              ))}
            </Rv>
          </div>
        </section>

        {/* footer */}
        <footer className="bg-ink-950 border-t border-ink-700 pt-14 sm:pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                <a href="#top" onClick={(e) => anchor(e, "top")} className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-white p-[3px]"><img src={C.logo} alt="9 Wickets" className="w-full h-full rounded-full object-cover" /></span>
                  <span className="font-display text-2xl tracking-wide text-white uppercase"><span className="text-gold-500">9</span> Wickets</span>
                </a>
                <p className="mt-5 text-sm text-slate-400 leading-relaxed max-w-sm font-bn">{C.footer.about}</p>
                <div className="mt-6 flex items-center gap-2.5">
                  {Object.entries(C.social).map(([net, url]) => (
                    <a key={net} href={url} target="_blank" rel="noopener" className="w-10 h-10 grid place-items-center rounded-full border border-ink-600 text-slate-300 hover:bg-gold-500 hover:text-ink-950 hover:border-gold-500 transition-all active:scale-90" aria-label={net}>
                      <I name={socialIcons[net]} size={17} />
                    </a>
                  ))}
                </div>
                <div className="mt-6 space-y-1.5 font-mono text-xs text-slate-500">
                  <a href={"tel:" + C.contact.phoneRaw} className="flex items-center gap-2.5 hover:text-gold-400 transition-colors"><I name="phone" size={13} /> {C.contact.phone}</a>
                  <a href={"mailto:" + C.contact.email} className="flex items-center gap-2.5 hover:text-gold-400 transition-colors"><I name="mail" size={13} /> {C.contact.email}</a>
                  <p className="flex items-center gap-2.5 font-bn"><I name="clock" size={13} /> {C.contact.hours}</p>
                </div>
              </div>
              <div className="lg:col-span-2">
                <h4 className="font-mono text-[11px] tracking-[0.3em] uppercase text-slate-500">Quick Links</h4>
                <ul className="mt-5 space-y-2.5 text-sm font-bn">
                  {NAV.map((n) => (
                    <li key={n.id}><a href={"#" + n.id} onClick={(e) => anchor(e, n.id)} className="text-slate-300 hover:text-gold-400 transition-colors">{n.label}</a></li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-3">
                <h4 className="font-mono text-[11px] tracking-[0.3em] uppercase text-slate-500">দরকারি গাইড</h4>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {C.agents.guide.map((g, i) => (
                    <li key={i}>
                      <a href={g.url} target="_blank" rel="noopener" className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors font-bn">
                        <I name="ext" size={12} className="text-slate-500" /> {g.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="https://9wicketsagentlist.com/9wicket-secure-transaction/" target="_blank" rel="noopener" className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors font-bn">
                      <I name="ext" size={12} className="text-slate-500" /> নিরাপদ লেনদেন গাইড
                    </a>
                  </li>
                </ul>
                <p className="mt-4 text-[11px] text-slate-500 leading-relaxed font-bn">যেকোনো লিংকে ঢোকার আগে এজেন্টের নাম-নাম্বার এই পেজে মিলিয়ে নিন।</p>
              </div>
              <div className="lg:col-span-3">
                <h4 className="font-mono text-[11px] tracking-[0.3em] uppercase text-slate-500">9Wickets Network</h4>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {C.network.map((l, i) => (
                    <li key={i}>
                      <a href={l.url} target="_blank" rel="noopener" className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors">
                        <I name="ext" size={12} className="text-slate-500" /> {l.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <h4 className="mt-7 font-mono text-[11px] tracking-[0.3em] uppercase text-slate-500">Complaint Center</h4>
                <a href={waHref(C.complaint.wa)} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-red-300 border border-red-500/40 bg-red-500/10 rounded-full px-4 py-2 hover:bg-red-500/20 transition-colors font-bn">
                  <I name="alert" size={13} /> সমস্যা জানান ২৪/৭
                </a>
              </div>
            </div>
            <div className="mt-12 pt-7 border-t border-ink-700 flex flex-col lg:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">© 2026 {C.name} ({C.nameBn}) — All rights reserved.</p>
              <p className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                <span className="bg-ink-800 border border-ink-600 text-slate-300 rounded px-2 py-0.5 font-bold">18+</span>
                <span className="hidden sm:inline font-bn">দায়িত্বের সাথে ব্যবহার করুন</span>
              </p>
              <p className="font-mono text-[11px] text-slate-600">9wicketsagentlist.com — official source</p>
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-slate-600 font-bn">{C.footer.disclaimer}</p>
          </div>
        </footer>

        {/* floaters */}
        <a href={waHref(C.contact.wa)} target="_blank" rel="noopener" className="fixed bottom-6 left-6 z-40 grid place-items-center rounded-full bg-pitch-500 text-ink-950 shadow-card hover:brightness-110 active:scale-90 transition-all" style={{ width: "3.25rem", height: "3.25rem" }} aria-label="WhatsApp">
          <I name="whatsapp" size={24} />
        </a>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={"fixed bottom-6 right-6 z-40 w-12 h-12 grid place-items-center rounded-full bg-gold-500 text-ink-950 shadow-gold hover:bg-gold-400 active:scale-90 transition-all " + (showTop ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")} aria-label="Back to top">
          <I name="chevL" size={20} className="rotate-90" />
        </button>
      </main>
    </div>
  );
}
