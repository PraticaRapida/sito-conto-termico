import { useState, useEffect, useRef } from "react";

const COLORS = {
  darkGreen: "#1a3a1a",
  mediumGreen: "#2d5a27",
  brandGreen: "#3d8b37",
  accentGreen: "#5cb85c",
  paleGreen: "#e8f5e4",
  offWhite: "#f7faf6",
  white: "#ffffff",
  darkText: "#1a2e1a",
  lightText: "#c5dcc2",
  mutedText: "#6b8a68",
  border: "rgba(61,139,55,0.18)",
};

const pages = { HOME: "home", CONTO_TERMICO: "conto_termico", SPESE: "spese", PRODOTTI: "prodotti", FATTURE: "fatture", MANDATO: "mandato", CARICA: "carica", PREVENTIVO: "preventivo", COSTRUZIONE: "costruzione" };

function LogoImg({ height = 36, style: extra = {} }) {
  return <img src="PRATICARAPIDA.png" alt="PraticaRapida" style={{ height, width: "auto", display: "block", ...extra }} />;
}

function NavBar({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  const navItems = [
    { label: "Home", page: pages.HOME },
    { label: "Conto Termico 3.0", page: pages.CONTO_TERMICO },
    { label: "Spese", page: pages.SPESE },
    { label: "Prodotti", page: pages.PRODOTTI },
    { label: "Fatture e Bonifici", page: pages.FATTURE },
    { label: "Mandato all'Incasso", page: pages.MANDATO },
  ];

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${scrolled ? COLORS.border : "rgba(61,139,55,0.08)"}`, transition: "all 0.4s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? 60 : 70, transition: "height 0.3s ease" }}>
        <div onClick={() => setPage(pages.HOME)} style={{ cursor: "pointer", flexShrink: 0 }}>
          <LogoImg height={scrolled ? 24 : 30} />
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
          {navItems.map((item) => (
            <button key={item.page} onClick={() => setPage(item.page)}
              style={{ background: currentPage === item.page ? COLORS.paleGreen : "transparent", border: "none", color: currentPage === item.page ? COLORS.brandGreen : COLORS.mutedText, padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: currentPage === item.page ? 700 : 500, transition: "all 0.2s ease", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { if (currentPage !== item.page) { e.target.style.color = COLORS.brandGreen; e.target.style.background = "rgba(61,139,55,0.06)"; } }}
              onMouseLeave={(e) => { if (currentPage !== item.page) { e.target.style.color = COLORS.mutedText; e.target.style.background = "transparent"; } }}
            >{item.label}</button>
          ))}
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "none", background: "none", border: "none", color: COLORS.brandGreen, fontSize: 28, cursor: "pointer", padding: 4 }}>{mobileOpen ? "✕" : "☰"}</button>
      </div>
      {mobileOpen && (
        <div className="mobile-dropdown" style={{ background: "rgba(255,255,255,0.98)", padding: "8px 24px 20px", display: "flex", flexDirection: "column", gap: 4, borderTop: `1px solid ${COLORS.border}` }}>
          {navItems.map((item) => (
            <button key={item.page} onClick={() => { setPage(item.page); setMobileOpen(false); }}
              style={{ background: currentPage === item.page ? COLORS.paleGreen : "transparent", border: "none", color: currentPage === item.page ? COLORS.brandGreen : COLORS.darkText, padding: "12px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: currentPage === item.page ? 700 : 500 }}>{item.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: COLORS.darkGreen, padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, justifyContent: "space-between", marginBottom: 40 }}>
          <div style={{ minWidth: 200 }}>
            <LogoImg height={24} style={{ filter: "brightness(1.5)" }} />
            <p style={{ color: COLORS.mutedText, fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>Gestione pratiche Conto Termico 3.0<br />Chiavi in mano</p>
          </div>
          <div style={{ minWidth: 160 }}>
            <h4 style={{ color: COLORS.lightText, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Sezioni</h4>
            {[{ label: "Conto Termico 3.0", p: pages.CONTO_TERMICO }, { label: "Spese Ammissibili", p: pages.SPESE }, { label: "Prodotti Ammessi", p: pages.PRODOTTI }, { label: "Fatture e Bonifici", p: pages.FATTURE }, { label: "Mandato all'Incasso", p: pages.MANDATO }].map((l) => (
              <div key={l.p} onClick={() => setPage(l.p)} style={{ color: COLORS.mutedText, fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer", padding: "4px 0", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.target.style.color = COLORS.accentGreen} onMouseLeave={(e) => e.target.style.color = COLORS.mutedText}>{l.label}</div>
            ))}
          </div>
          <div style={{ minWidth: 200 }}>
            <h4 style={{ color: COLORS.lightText, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Contatti</h4>
            <p style={{ color: COLORS.mutedText, fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 2 }}>praticarapida.it<br />+39 039 868 2691</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, textAlign: "center" }}>
          <p style={{ color: COLORS.mutedText, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>© 2025 PraticaRapida — D.M. 7 agosto 2025 e Regole Applicative GSE</p>
        </div>
      </div>
    </footer>
  );
}

function PageContainer({ children }) { return <div style={{ paddingTop: 70 }}>{children}</div>; }

function InfoCard({ icon, title, children, accent = false }) {
  return (
    <div style={{ background: accent ? `linear-gradient(135deg, ${COLORS.mediumGreen}, ${COLORS.brandGreen})` : COLORS.white, borderRadius: 16, padding: "32px 28px", border: accent ? "none" : `1px solid ${COLORS.border}`, boxShadow: accent ? "0 8px 32px rgba(45,90,39,0.25)" : "0 2px 12px rgba(0,0,0,0.04)", transition: "transform 0.3s ease", cursor: "default", height: "100%" }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 19, fontWeight: 700, color: accent ? COLORS.white : COLORS.darkText, marginBottom: 12 }}>{title}</h3>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: accent ? "rgba(255,255,255,0.88)" : COLORS.mutedText }}>{children}</div>
    </div>
  );
}

function AlertBox({ type = "warning", children }) {
  const s = { warning: { bg: "#fff8e1", border: "#f9a825", icon: "⚠️", color: "#5d4037" }, info: { bg: COLORS.paleGreen, border: COLORS.brandGreen, icon: "ℹ️", color: COLORS.darkText }, danger: { bg: "#fde8e8", border: "#c62828", icon: "🚫", color: "#b71c1c" } }[type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderLeft: `4px solid ${s.border}`, borderRadius: 12, padding: "20px 24px", margin: "32px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: s.color, display: "flex", gap: 14, alignItems: "flex-start" }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{s.icon}</span><div>{children}</div>
    </div>
  );
}

function GreenButton({ children, onClick, large = false }) {
  return (
    <button onClick={onClick} style={{ background: `linear-gradient(135deg, ${COLORS.brandGreen}, ${COLORS.mediumGreen})`, color: COLORS.white, border: "none", borderRadius: large ? 14 : 10, padding: large ? "18px 48px" : "12px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: large ? 18 : 15, fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(45,90,39,0.25)" }}
    onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(45,90,39,0.35)"; }}
    onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(45,90,39,0.25)"; }}>{children}</button>
  );
}

function PageHero({ tag, title, subtitle }) {
  return (
    <section style={{ background: `linear-gradient(160deg, ${COLORS.darkGreen}, ${COLORS.mediumGreen})`, padding: "96px 24px 64px", textAlign: "center" }}>
      {tag && <span style={{ display: "inline-block", background: "rgba(92,184,92,0.15)", color: COLORS.accentGreen, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 20, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>{tag}</span>}
      <h1 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: COLORS.white, lineHeight: 1.1, maxWidth: 700, margin: "0 auto" }}>{title}</h1>
      {subtitle && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: COLORS.lightText, maxWidth: 550, margin: "20px auto 0", lineHeight: 1.6 }}>{subtitle}</p>}
    </section>
  );
}

function SectionTitle({ tag, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 56 }}>
      {tag && <span style={{ display: "inline-block", background: COLORS.paleGreen, color: COLORS.brandGreen, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 20, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{tag}</span>}
      <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: COLORS.darkText, lineHeight: 1.15, margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: COLORS.mutedText, maxWidth: 600, margin: "16px auto 0", lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

// ─── PAGES ───

function HomePage({ setPage }) {
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 100); }, []);
  return (
    <PageContainer>
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: COLORS.white, position: "relative", overflow: "hidden", padding: "0 24px" }}>
        <div style={{ position: "absolute", top: "-15%", right: "-8%", width: "45vw", height: "45vw", background: "radial-gradient(circle, rgba(61,139,55,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(92,184,92,0.05) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(155deg, transparent 42%, rgba(61,139,55,0.03) 42%, rgba(61,139,55,0.03) 58%, transparent 58%)", pointerEvents: "none" }} />
        <div style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 40, display: "flex", justifyContent: "center" }}><LogoImg height={52} /></div>
          <h1 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, color: COLORS.darkText, lineHeight: 1.08, maxWidth: 800, margin: "0 auto 24px", letterSpacing: "-0.02em" }}>
            Il tuo partner per le<br /><span style={{ color: COLORS.brandGreen }}>detrazioni fiscali</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2vw, 20px)", color: COLORS.mutedText, maxWidth: 540, margin: "0 auto 48px", lineHeight: 1.6 }}>Gestione pratiche Conto Termico 3.0 chiavi in mano per installatori e impiantisti</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            <GreenButton large onClick={() => setPage(pages.CARICA)}>Carica ora la tua pratica →</GreenButton>
            <button onClick={() => setPage(pages.PREVENTIVO)} style={{ background: COLORS.white, color: COLORS.brandGreen, border: `2px solid ${COLORS.brandGreen}`, borderRadius: 14, padding: "16px 40px", fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(45,90,39,0.1)" }}
              onMouseEnter={(e) => { e.target.style.background = COLORS.paleGreen; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(45,90,39,0.18)"; }}
              onMouseLeave={(e) => { e.target.style.background = COLORS.white; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(45,90,39,0.1)"; }}>
              Calcola ora il tuo preventivo →
            </button>
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1, marginTop: 80, display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
          {[{ value: "65%", label: "Rimborso max privati" }, { value: "90 gg", label: "Erogazione rapida" }, { value: "900 Mln", label: "Plafond annuale" }].map((s, i) => (
            <div key={i} style={{ background: COLORS.paleGreen, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "24px 40px", textAlign: "center", minWidth: 170 }}>
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 36, fontWeight: 900, color: COLORS.brandGreen }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.mutedText, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ background: COLORS.offWhite, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle tag="Guida completa" title="Tutto quello che devi sapere" subtitle="Naviga le sezioni per scoprire come funziona il Conto Termico 3.0" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[{ icon: "📋", title: "Cos'è il Conto Termico 3.0", desc: "Incentivazione statale, rimborso diretto dal GSE fino al 65%", page: pages.CONTO_TERMICO }, { icon: "💰", title: "Spese Ammissibili", desc: "Cosa puoi inserire in fattura e limiti di spesa", page: pages.SPESE }, { icon: "🔧", title: "Prodotti Ammessi", desc: "Pompe di calore, biomassa, solare termico, ibridi e altro", page: pages.PRODOTTI }, { icon: "📄", title: "Fatture e Bonifici", desc: "Come emettere fattura e la causale corretta del bonifico", page: pages.FATTURE }, { icon: "🤝", title: "Mandato all'Incasso", desc: "Sconto in fattura: ricevi l'incentivo direttamente dal GSE", page: pages.MANDATO }].map((item, i) => (
              <div key={i} onClick={() => setPage(item.page)} style={{ background: COLORS.white, borderRadius: 16, padding: "32px 28px", border: `1px solid ${COLORS.border}`, cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = COLORS.brandGreen; e.currentTarget.style.boxShadow = "0 8px 24px rgba(45,90,39,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)"; }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 19, fontWeight: 700, color: COLORS.darkText, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.mutedText, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                <div style={{ marginTop: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: COLORS.brandGreen }}>Scopri di più →</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: `linear-gradient(135deg, ${COLORS.mediumGreen}, ${COLORS.brandGreen})`, padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 800, color: COLORS.white, marginBottom: 16 }}>Pronto a caricare la tua pratica?</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.8)", marginBottom: 36 }}>Seleziona il prodotto installato e carica la documentazione in pochi clic</p>
        <button onClick={() => setPage(pages.CARICA)} style={{ background: COLORS.white, color: COLORS.brandGreen, border: "none", borderRadius: 14, padding: "18px 48px", fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}>
          Carica ora la tua pratica →
        </button>
      </section>
      <Footer setPage={setPage} />
    </PageContainer>
  );
}

function ContoTermicoPage({ setPage }) {
  return (
    <PageContainer>
      <PageHero tag="Sezione 1" title="Cos'è il Conto Termico 3.0" />
      <section style={{ background: COLORS.white, padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.8, color: COLORS.darkText, marginBottom: 32 }}>Il Conto Termico 3.0 è un meccanismo di incentivazione statale, disciplinato dal <strong>D.M. 7 agosto 2025</strong>, che premia gli interventi di efficientamento energetico e la produzione di energia termica da fonti rinnovabili. L'incentivo viene erogato tramite <strong>bonifico diretto dal GSE</strong>.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
            <InfoCard icon="💶" title="Rimborso Diretto">Fino al <strong>65%</strong> per i privati, fino al <strong>100%</strong> per la PA. Denaro reale, non credito fiscale.</InfoCard>
            <InfoCard icon="⚡" title="Erogazione Rapida">Accredito entro <strong>90 giorni</strong>. Se ≤ 15.000 €, unica soluzione.</InfoCard>
            <InfoCard icon="🔄" title="Sconto in Fattura">Sconto immediato tramite <strong>Mandato all'Incasso</strong>.</InfoCard>
          </div>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.darkText, marginBottom: 24 }}>Le due categorie di intervento</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
            <InfoCard icon="🏠" title="Titolo II — Art. 5" accent><strong>Efficienza energetica</strong><br /><br />Isolamento termico, infissi, nZEB, building automation, fotovoltaico.</InfoCard>
            <InfoCard icon="☀️" title="Titolo III — Art. 8"><strong>Energia termica rinnovabile</strong><br /><br />Pompe di calore, ibridi, biomassa, solare termico, scaldacqua, teleriscaldamento.</InfoCard>
          </div>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.darkText, marginBottom: 24 }}>Chi può accedere</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, marginBottom: 32 }}>
              <thead><tr style={{ background: COLORS.mediumGreen }}>{["Beneficiario", "Cat. Catastale", "Titolo II", "Titolo III"].map(h => <th key={h} style={{ padding: "14px 18px", color: COLORS.white, textAlign: "left", fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>{[["Pubblica Amministrazione", "Tutte", "✅", "✅"],["Enti Terzo Settore", "Tutte", "✅", "✅"],["Privati — Terziario", "A/10, B, C, D, E", "✅", "✅"],["Privati — Residenziale", "Cat. A (escl. A/8, A/9)", "❌", "✅"]].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? COLORS.white : COLORS.paleGreen }}>{row.map((cell, j) => <td key={j} style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.border}` }}>{cell}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.darkText, marginBottom: 24 }}>Budget disponibile</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
            {[{ label: "Privati", value: "500 Mln" }, { label: "P.A.", value: "400 Mln" }, { label: "Totale annuo", value: "900 Mln" }].map((b, i) => (
              <div key={i} style={{ flex: "1 1 140px", textAlign: "center", background: COLORS.paleGreen, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "24px 16px" }}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 28, fontWeight: 900, color: COLORS.brandGreen }}>{b.value}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.mutedText, marginTop: 4 }}>{b.label}</div>
              </div>
            ))}
          </div>
          <AlertBox type="info"><strong>Non cumulabilità:</strong> NON cumulabile con Ecobonus, Bonus Casa, Superbonus o Certificati Bianchi.</AlertBox>
        </div>
      </section>
      <Footer setPage={setPage} />
    </PageContainer>
  );
}

function SpesePage({ setPage }) {
  return (
    <PageContainer>
      <PageHero tag="Sezione 2" title="Spese Ammissibili" />
      <section style={{ background: COLORS.white, padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.8, color: COLORS.darkText, marginBottom: 40 }}>Ecco cosa puoi inserire in fattura come spesa ammissibile.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 48 }}>
            {[{ icon: "🔩", title: "Fornitura e posa", desc: "Acquisto e installazione nuovi impianti" }, { icon: "🗑️", title: "Smontaggio", desc: "Rimozione e smaltimento impianti esistenti" }, { icon: "📐", title: "Prestazioni professionali", desc: "Diagnosi energetica, APE, asseverazioni" }, { icon: "🧱", title: "Opere edili", desc: "Lavori edili necessari all'intervento" }, { icon: "⚙️", title: "Adeguamento impianti", desc: "Modifiche impianti preesistenti" }].map((item, i) => <InfoCard key={i} icon={item.icon} title={item.title}>{item.desc}</InfoCard>)}
          </div>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.darkText, marginBottom: 24 }}>Percentuali di incentivo</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 40 }}>
            <div style={{ background: COLORS.offWhite, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "28px 24px" }}>
              <h4 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 700, color: COLORS.darkText, marginBottom: 16 }}>Privati e PA — Titolo III</h4>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.mutedText, lineHeight: 1.7 }}>Tetto: <strong>65%</strong>. ≤ 15.000 €: unica soluzione. &gt; 15.000 €: rate annuali. PA/ETS: fino al <strong>100%</strong>.</p>
            </div>
            <div style={{ background: COLORS.offWhite, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "28px 24px" }}>
              <h4 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 700, color: COLORS.darkText, marginBottom: 16 }}>Imprese — Titolo III</h4>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.mutedText, lineHeight: 1.7 }}>Base: <strong>45%</strong>. +20% piccole, +10% medie. Plafond: 150 Mln/anno.</p>
            </div>
          </div>
          <AlertBox type="warning"><strong>Sempre richiesti:</strong> Certificazione produttore, Conformità D.M. 37/2008, Certificato smaltimento.</AlertBox>
        </div>
      </section>
      <Footer setPage={setPage} />
    </PageContainer>
  );
}

function ProdottiPage({ setPage }) {
  const products = [
    { code: "III.A", icon: "❄️", title: "Pompe di Calore", desc: "PdC elettriche o a gas per riscaldamento e ACS.", news: "Parametri SCOP/SPER. Piscine e processi industriali." },
    { code: "III.B", icon: "🔄", title: "Sistemi Ibridi e Bivalenti", desc: "Factory Made o bivalenti (caldaia + PdC).", news: "PdC 'Add on' su caldaie esistenti (max 5 anni)." },
    { code: "III.C", icon: "🪵", title: "Generatori a Biomassa", desc: "Caldaie, stufe, termocamini a legna o pellet.", news: "Ibridi biomassa + PdC ammessi." },
    { code: "III.D", icon: "☀️", title: "Solare Termico", desc: "Impianti solari termici per ACS e riscaldamento.", news: "Certificazione Solar Keymark richiesta." },
    { code: "III.E", icon: "🚿", title: "Scaldacqua a PdC", desc: "Scaldacqua a pompa di calore classe A+.", news: "Sostituzione da gas ammessa. Incentivi maggiorati." },
    { code: "III.F", icon: "🏭", title: "Teleriscaldamento", desc: "Allaccio a teleriscaldamento ARERA.", news: "Categoria nuova nel CT 3.0." },
    { code: "III.G", icon: "⚡", title: "Microcogenerazione", desc: "Impianti < 50 kW da fonti rinnovabili.", news: "Categoria nuova. Incentivo max 65%." },
  ];
  return (
    <PageContainer>
      <PageHero tag="Sezione 3" title="Prodotti Ammessi" subtitle="Titolo III — Art. 8" />
      <section style={{ background: COLORS.white, padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {products.map((p, i) => (
              <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: "28px 24px", border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(45,90,39,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{p.icon}</span>
                  <div><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: COLORS.brandGreen, letterSpacing: "0.08em" }}>{p.code}</span>
                  <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.darkText, margin: 0 }}>{p.title}</h3></div>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.mutedText, lineHeight: 1.65, flex: 1 }}>{p.desc}</p>
                <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: COLORS.paleGreen, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.mediumGreen, lineHeight: 1.5 }}><strong>Novità CT 3.0:</strong> {p.news}</div>
              </div>
            ))}
          </div>
          <AlertBox type="info"><strong>Requisiti comuni:</strong> Valvole termostatiche se T ≥ 45°C. Contabilizzazione calore se &gt; 200 kWt. Foto: 5-7 scatti ante/durante/post.</AlertBox>
        </div>
      </section>
      <Footer setPage={setPage} />
    </PageContainer>
  );
}

function FatturePage({ setPage }) {
  return (
    <PageContainer>
      <PageHero tag="Sezione 4" title="Fatture e Bonifici" />
      <section style={{ background: COLORS.white, padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.darkText, marginBottom: 24 }}>La fattura — cosa deve contenere</h3>
          <div style={{ background: COLORS.offWhite, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "28px 24px", marginBottom: 32 }}>
            <ul style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.darkText, lineHeight: 2.2, paddingLeft: 20, margin: 0 }}>
              <li>Descrizione <strong>prodotto sostituito</strong> (marca, modello, matricola)</li>
              <li>Descrizione <strong>nuovo prodotto</strong> (marca, modello, matricola)</li>
              <li><strong>Indirizzo completo</strong> dell'immobile</li>
              <li>Riferimento: <strong>D.M. 7 agosto 2025</strong></li>
              <li>Dettaglio <strong>singole voci di spesa</strong></li>
            </ul>
          </div>
          <div style={{ background: COLORS.paleGreen, border: `1px solid ${COLORS.brandGreen}`, borderRadius: 16, padding: "24px", marginBottom: 40 }}>
            <h4 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.mediumGreen, marginBottom: 12 }}>Con Mandato all'Incasso:</h4>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: COLORS.darkText, background: COLORS.white, borderRadius: 10, padding: "16px 20px", lineHeight: 1.8 }}>QUOTA PARTE PAGATA DA S.R. EUR [importo]<br />QUOTA PER CESSIONE DEL CREDITO EUR [importo] - DM 7.AGOSTO.2025</div>
          </div>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.darkText, marginBottom: 24 }}>Il bonifico — causale corretta</h3>
          <AlertBox type="danger"><strong>ERRORE CRITICO:</strong> NON usare il "bonifico parlante" per detrazioni fiscali. Causa <strong>decadenza automatica</strong>! Usare sempre bonifico <strong>ORDINARIO</strong>.</AlertBox>
          <div style={{ background: COLORS.offWhite, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "28px 24px", marginBottom: 32 }}>
            <h4 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.darkText, marginBottom: 16 }}>La causale deve contenere:</h4>
            <ul style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.darkText, lineHeight: 2.2, paddingLeft: 20, margin: 0 }}>
              <li><strong>D.M. 7 Agosto 2025</strong></li><li>Numero e data fattura</li><li>CF del Soggetto Responsabile</li><li>CF o P.IVA del beneficiario</li>
            </ul>
          </div>
          <div style={{ background: COLORS.paleGreen, border: `1px solid ${COLORS.brandGreen}`, borderRadius: 16, padding: "24px", marginBottom: 32 }}>
            <h4 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.mediumGreen, marginBottom: 12 }}>Esempio:</h4>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13.5, color: COLORS.darkText, background: COLORS.white, borderRadius: 10, padding: "16px 20px", lineHeight: 1.6, wordBreak: "break-word" }}>DM 7 Agosto 2025, Fattura xxxx del gg/mm/aa, S.R. CODICE_FISCALE, Beneficiario PIVA xxxx</div>
          </div>
          <AlertBox type="info"><strong>Nota:</strong> l'intestatario del conto deve coincidere con l'intestatario della fattura.</AlertBox>
        </div>
      </section>
      <Footer setPage={setPage} />
    </PageContainer>
  );
}

function MandatoPage({ setPage }) {
  return (
    <PageContainer>
      <PageHero tag="Sezione 5" title="Mandato Irrevocabile all'Incasso" subtitle="Lo sconto in fattura nel Conto Termico 3.0" />
      <section style={{ background: COLORS.white, padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.8, color: COLORS.darkText, marginBottom: 40 }}>Ti permette di applicare uno <strong>sconto immediato in fattura</strong> e ricevere l'incentivo direttamente dal GSE.</p>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.darkText, marginBottom: 24 }}>Come funziona</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
            {["Il cliente ti conferisce il mandato irrevocabile", "Emetti fattura con quota cliente e quota cessione", "Il cliente paga solo la quota non coperta", "La richiesta viene presentata a nome del cliente", "Il GSE liquida te entro 90 giorni"].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: COLORS.offWhite, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ minWidth: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${COLORS.brandGreen}, ${COLORS.mediumGreen})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Archivo', sans-serif", fontSize: 18, fontWeight: 900, color: COLORS.white, flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.darkText, lineHeight: 1.6, margin: 0, paddingTop: 8 }}>{step}</p>
              </div>
            ))}
          </div>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.darkText, marginBottom: 24 }}>Le 5 regole</h3>
          <div style={{ background: COLORS.offWhite, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "28px 24px", marginBottom: 40 }}>
            <ul style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.darkText, lineHeight: 2.2, paddingLeft: 20, margin: 0 }}>
              <li><strong>SOLO accesso diretto</strong></li><li>Solo al <strong>fornitore che ha emesso fattura</strong></li><li><strong>Diritto esclusivo</strong> di riscuotere</li><li>Cliente paga solo <strong>quota residua</strong></li><li><strong>GSE paga il Mandatario</strong></li>
            </ul>
          </div>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.darkText, marginBottom: 24 }}>Esempio pratico</h3>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.mediumGreen}, ${COLORS.brandGreen})`, borderRadius: 16, padding: "32px 28px", color: COLORS.white }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}><span>Costo (IVA esclusa):</span><strong>4.508 €</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}><span>IVA 22%:</span><strong>991 €</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 8 }}><span>Totale:</span><strong>5.500 €</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginTop: 8 }}><span>Incentivo netto:</span><strong style={{ color: "#a5d6a7" }}>3.531 €</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}><span>Quota cliente:</span><strong>1.969 €</strong></div>
              <div style={{ marginTop: 16, padding: "16px 20px", background: "rgba(255,255,255,0.1)", borderRadius: 10, textAlign: "center", fontSize: 16 }}>Cliente paga <strong>1.969 €</strong> invece di 5.500 €<br />Tu ricevi 1.969 + 3.531 = <strong>5.500 € totali</strong></div>
            </div>
          </div>
        </div>
      </section>
      <Footer setPage={setPage} />
    </PageContainer>
  );
}

function CaricaPage({ setPage }) {
  const products = [
    { code: "III.A", icon: "❄️", title: "Pompe di Calore", desc: "PdC elettriche o a gas per riscaldamento e ACS" },
    { code: "III.B", icon: "🔄", title: "Sistemi Ibridi", desc: "Factory Made o bivalenti (caldaia + PdC)" },
    { code: "III.C", icon: "🪵", title: "Generatori Biomassa", desc: "Caldaie, stufe, termocamini" },
    { code: "III.D", icon: "☀️", title: "Solare Termico", desc: "Impianti solari termici per ACS" },
    { code: "III.E", icon: "🚿", title: "Scaldacqua a PdC", desc: "Scaldacqua a pompa di calore A+" },
    { code: "III.F", icon: "🏭", title: "Teleriscaldamento", desc: "Allaccio teleriscaldamento" },
    { code: "III.G", icon: "⚡", title: "Microcogenerazione", desc: "Impianti < 50 kW rinnovabili" },
  ];
  return (
    <PageContainer>
      <PageHero title="Carica la tua pratica" subtitle="Seleziona il prodotto installato" />
      <section style={{ background: COLORS.white, padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {products.map((p, i) => (
              <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: "28px 24px", border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(45,90,39,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 36 }}>{p.icon}</span>
                  <div><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: COLORS.brandGreen, letterSpacing: "0.08em" }}>{p.code}</span>
                  <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.darkText, margin: 0 }}>{p.title}</h3></div>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.mutedText, lineHeight: 1.6, flex: 1 }}>{p.desc}</p>
                <button onClick={() => setPage(pages.COSTRUZIONE)}
                  style={{ marginTop: 20, width: "100%", background: `linear-gradient(135deg, ${COLORS.brandGreen}, ${COLORS.mediumGreen})`, color: COLORS.white, border: "none", borderRadius: 10, padding: "14px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 2px 12px rgba(45,90,39,0.2)" }}
                  onMouseEnter={(e) => e.target.style.boxShadow = "0 4px 20px rgba(45,90,39,0.35)"}
                  onMouseLeave={(e) => e.target.style.boxShadow = "0 2px 12px rgba(45,90,39,0.2)"}>
                  Carica la tua pratica →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer setPage={setPage} />
    </PageContainer>
  );
}

function PreventivoPage({ setPage }) {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(2400);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'ct3-resize') {
        setIframeHeight(e.data.height + 40);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <PageContainer>
      <PageHero title="Calcola il tuo preventivo" subtitle="Stima l'incentivo Conto Termico 3.0 per il tuo intervento" />
      <section style={{ background: "#f0f4f8", padding: "0 0 64px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 0" }}>
          <div style={{ background: "#fff8e1", border: "1px solid #f9a825", borderLeft: "4px solid #f9a825", borderRadius: 12, padding: "16px 20px", marginBottom: 24, fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, color: "#7c5c00", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
            <div><strong>Attenzione:</strong> questo calcolatore è ancora in fase di test. I risultati sono indicativi e calcolati sulla base delle formule del D.M. 7 agosto 2025. L'incentivo effettivo è soggetto a verifica da parte del GSE.</div>
          </div>
          <iframe
            ref={iframeRef}
            src="calcolatore.html"
            style={{
              width: "100%",
              height: iframeHeight,
              border: "none",
              borderRadius: 12,
              overflow: "hidden",
            }}
            title="Calcolatore Conto Termico 3.0"
          />
        </div>
      </section>
      <Footer setPage={setPage} />
    </PageContainer>
  );
}

function CostruzionePage({ setPage }) {
  return (
    <PageContainer>
      <section style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: COLORS.white, padding: "0 24px" }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🚧</div>
        <h1 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: COLORS.darkText, marginBottom: 16 }}>Sito in costruzione</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: COLORS.mutedText, maxWidth: 480, lineHeight: 1.6, marginBottom: 40 }}>Questa funzionalità sarà disponibile a breve.</p>
        <GreenButton large onClick={() => setPage(pages.HOME)}>← Torna alla home</GreenButton>
        <div style={{ marginTop: 48, fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.mutedText }}><span style={{ color: COLORS.brandGreen }}>praticarapida.it</span> | <span style={{ color: COLORS.brandGreen }}>+39 039 868 2691</span></div>
      </section>
    </PageContainer>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(pages.HOME);
  const setPage = (p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const render = () => {
    switch (currentPage) {
      case pages.HOME: return <HomePage setPage={setPage} />;
      case pages.CONTO_TERMICO: return <ContoTermicoPage setPage={setPage} />;
      case pages.SPESE: return <SpesePage setPage={setPage} />;
      case pages.PRODOTTI: return <ProdottiPage setPage={setPage} />;
      case pages.FATTURE: return <FatturePage setPage={setPage} />;
      case pages.MANDATO: return <MandatoPage setPage={setPage} />;
      case pages.CARICA: return <CaricaPage setPage={setPage} />;
      case pages.PREVENTIVO: return <PreventivoPage setPage={setPage} />;
      case pages.COSTRUZIONE: return <CostruzionePage setPage={setPage} />;
      default: return <HomePage setPage={setPage} />;
    }
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}body{background:${COLORS.white};overflow-x:hidden}html{scroll-behavior:smooth}::selection{background:${COLORS.brandGreen};color:white}
        @media(max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:block!important}}
        @media(min-width:769px){.mobile-dropdown{display:none!important}}
      `}</style>
      <NavBar currentPage={currentPage} setPage={setPage} />
      {render()}
    </>
  );
}
