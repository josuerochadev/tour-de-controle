// Pages.jsx — V2 cockpit (Inter + JetBrains Mono)

const FONT_DISPLAY = "var(--font-display, 'JetBrains Mono', ui-monospace, monospace)";
const FONT_MONO = "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)";
const numStyle = { fontFamily: FONT_DISPLAY, fontVariantNumeric: "tabular-nums" };

const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 18 L52 8 L52 28 Z" fill="#f59e0b" opacity="0.55"/>
    <path d="M32 18 L12 8 L12 28 Z" fill="#f59e0b" opacity="0.55"/>
    <path d="M24 22 L40 22 L42 56 L22 56 Z" fill="currentColor"/>
    <rect x="26" y="14" width="12" height="10" rx="1.5" fill="currentColor"/>
    <circle cx="32" cy="19" r="3" fill="#dc2626"/>
    <path d="M28 14 L36 14 L34 10 L30 10 Z" fill="currentColor"/>
    <circle cx="32" cy="9" r="1.5" fill="currentColor"/>
    <rect x="24" y="36" width="18" height="4" fill="#dc2626"/>
    <rect x="20" y="56" width="24" height="3" rx="1" fill="currentColor"/>
  </svg>
);

const Wordmark = ({ size = 18 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 12, color: "#1c1917" }}>
    <Logo size={size + 14} />
    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1, whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, letterSpacing: 0.5 }}>TOUR DE CONTRÔLE</span>
      <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#9a928a", marginTop: 5 }}>Restaurant ops · v2</span>
    </span>
  </span>
);

// Helper for numbers — uppercase mono with tabular alignment
const Num = ({ children, size = 56, color, weight = 500 }) => (
  <span style={{ ...numStyle, fontSize: size, fontWeight: weight, lineHeight: 1, letterSpacing: -1, color }}>{children}</span>
);

// ---------------- Login ----------------
function LoginPage({ onLogin }) {
  const [email, setEmail] = React.useState("camille@restaurant.fr");
  const [password, setPassword] = React.useState("Password1");
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1.1fr", background: "var(--paper)" }}>
      <div style={{ padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 48 }}>
        <Wordmark />
        <div style={{ maxWidth: 420 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9a928a", marginBottom: 20 }}>// Accès opérateur</div>
          <h1 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 44, lineHeight: 1.05, letterSpacing: -1.5, fontWeight: 600, textTransform: "uppercase" }}>
            Bonsoir.<br/>Service ouvre dans <span style={{ color: "#dc2626" }}>12&nbsp;min</span>.
          </h1>
          <form onSubmit={(e) => { e.preventDefault(); onLogin?.({ first_name: "Camille", last_name: "Durand", email }); }} style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Identifiant"><input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} /></Field>
            <Field label="Mot de passe"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} /></Field>
            <button type="submit" style={{ ...btnPrimary, marginTop: 8 }}>PRENDRE LE QUART →</button>
            <a href="#" style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#6b645e", textDecoration: "underline", textUnderlineOffset: 4, letterSpacing: 0.5 }}>Mot de passe oublié ?</a>
          </form>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#9a928a", letterSpacing: 1 }}>v2.0 · phare opérationnel · {new Date().toLocaleDateString("fr-FR")}</div>
      </div>
      <div style={{ position: "relative", background: "#1c1917", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BeaconArt />
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "14px 16px", border: "1px solid #efe0c4", borderRadius: 14,
  background: "#fef9ee", fontFamily: "inherit", fontSize: 16, color: "#1c1917", outline: "none",
  fontVariantNumeric: "tabular-nums",
};
const btnPrimary = {
  padding: "16px 22px", borderRadius: 14, background: "#1c1917", color: "#fef3e2",
  border: "none", fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 600, letterSpacing: 1, cursor: "pointer",
};

function Field({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#6b645e", marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

function BeaconArt() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1000, height: 1000, position: "relative", animation: "tdc-rotate 24s linear infinite" }}>
          {[0, 120, 240].map((deg) => (
            <div key={deg} style={{
              position: "absolute", left: "50%", top: "50%", width: 800, height: 220,
              transform: `translate(-50%, -50%) rotate(${deg}deg)`,
              background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.18) 40%, rgba(220,38,38,0.35) 50%, rgba(245,158,11,0.18) 60%, transparent 100%)",
              filter: "blur(20px)",
            }} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(28,25,23,0.7) 70%)" }} />
      <div style={{ position: "relative", textAlign: "center", color: "#fef3e2", padding: 32 }}>
        <Logo size={120} />
        <div style={{ marginTop: 28, fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>« Garde le cap »</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginTop: 14, color: "#9a928a" }}>Phare opérationnel · est. 2024</div>
      </div>
    </div>
  );
}

// ---------------- Shell ----------------
function Shell({ user, route, setRoute, onLogout, children }) {
  const items = [
    { id: "dashboard", label: "Vigie" },
    { id: "cash-register", label: "Caisse" },
    { id: "transactions", label: "Flux" },
    { id: "users", label: "Équipage" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid #efe0c4" }}>
        <Wordmark />
        <nav style={{ display: "flex", gap: 4, padding: 4, background: "#f7e9d3", borderRadius: 999 }}>
          {items.map((it) => (
            <button key={it.id} onClick={() => setRoute(it.id)} style={{
              padding: "10px 20px", borderRadius: 999, border: "none", cursor: "pointer",
              fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
              background: route === it.id ? "#1c1917" : "transparent",
              color: route === it.id ? "#fef3e2" : "#3f3a36",
            }}>{it.label}</button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right", lineHeight: 1.2 }}>
            <div style={{ fontSize: 14, color: "#1c1917", fontWeight: 500 }}>{user.first_name} {user.last_name}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#9a928a", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>Gérant · de garde</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#1c1917", color: "#fef3e2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 600 }}>{user.first_name[0]}{user.last_name[0]}</div>
          <button onClick={onLogout} aria-label="Quitter le quart" style={{ background: "none", border: "none", cursor: "pointer", color: "#9a928a", fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Quitter ↗</button>
        </div>
      </header>
      <main style={{ padding: "32px 32px 80px" }}>{children}</main>
    </div>
  );
}

const labelMono = { fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9a928a" };
const pageTitle = { margin: "8px 0 0", fontFamily: FONT_DISPLAY, fontSize: 56, fontWeight: 600, lineHeight: 1, letterSpacing: -2, textTransform: "uppercase" };

// ---------------- Vigie ----------------
function VigiePage() {
  const [hovered, setHovered] = React.useState(null);
  const total = 1247.5;
  const target = 1800;
  const pct = (total / target) * 100;
  const txs = SAMPLE_TX;
  const totals = totalsByMethod(txs);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, maxWidth: 1400, margin: "0 auto" }}>
      <div>
        <div style={labelMono}>// Service · {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</div>
        <h1 style={pageTitle}>La vigie</h1>
        <p style={{ marginTop: 16, color: "#3f3a36", fontSize: 16, maxWidth: 560, lineHeight: 1.55 }}>
          Le service est ouvert depuis <b style={{ ...numStyle, color: "#1c1917" }}>4h&nbsp;12min</b>. Vous avez encaissé <b style={{ ...numStyle, color: "#dc2626" }}>{total.toFixed(2)}&nbsp;€</b>, soit <b style={numStyle}>{pct.toFixed(0)}%</b> de l'objectif.
        </p>

        {/* Big number tower */}
        <div style={{ marginTop: 36, padding: "32px 32px 28px", background: "#1c1917", color: "#fef3e2", borderRadius: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ ...labelMono, color: "#9a928a" }}>// Encaissé · service en cours</div>
              <div style={{ marginTop: 12 }}>
                <Num size={88} weight={600}>{Math.floor(total)}<span style={{ color: "#6b645e" }}>,{(total % 1).toFixed(2).slice(2)}</span></Num>
                <Num size={36} weight={500} color="#dc2626">&nbsp;€</Num>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...labelMono, color: "#9a928a" }}>Objectif</div>
              <div style={{ ...numStyle, fontSize: 22, fontWeight: 500, marginTop: 6 }}>{target}&nbsp;€</div>
              <div style={{ ...numStyle, fontSize: 11, color: "#f59e0b", marginTop: 6, letterSpacing: 0.5 }}>+ {(target - total).toFixed(0)}&nbsp;€ à viser</div>
            </div>
          </div>
          {/* Horizon progress */}
          <div style={{ position: "relative", height: 72, marginTop: 24 }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, height: 1, background: "#3f3a36" }} />
            <div style={{ position: "absolute", left: 0, bottom: 24, height: 1, width: `${pct}%`, background: "#dc2626", boxShadow: "0 0 12px #dc2626" }} />
            {[0, 25, 50, 75, 100].map((p) => (
              <div key={p} style={{ position: "absolute", left: `${p}%`, bottom: 12, transform: "translateX(-50%)", color: p <= pct ? "#dc2626" : "#3f3a36", fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1 }}>
                <div style={{ width: 1, height: 12, background: p <= pct ? "#dc2626" : "#3f3a36", margin: "0 auto 4px" }} />
                {p}%
              </div>
            ))}
            <div style={{ position: "absolute", left: `${pct}%`, bottom: 28, transform: "translateX(-50%)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#dc2626"><path d="M12 2L8 10h8l-4-8zM4 14l8 4 8-4-8-2-8 2zm0 4l8 4 8-4"/></svg>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24, fontFamily: FONT_MONO, fontSize: 11, color: "#9a928a", letterSpacing: 0.5 }}>
            <span>● 47 TRANSACTIONS</span>
            <span style={{ color: "#3f3a36" }}>·</span>
            <span>26,54 € PANIER MOYEN</span>
            <span style={{ color: "#3f3a36" }}>·</span>
            <span>11 COUVERTS/H</span>
          </div>
        </div>

        {/* Payment split */}
        <div style={{ marginTop: 24, padding: 28, background: "#fef9ee", border: "1px solid #efe0c4", borderRadius: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 600, letterSpacing: -0.5, textTransform: "uppercase" }}>Répartition</h2>
            <span style={labelMono}>par moyen de paiement</span>
          </div>
          {Object.entries(totals).map(([m, a]) => {
            const p = (a / total) * 100;
            return (
              <div key={m} onMouseEnter={() => setHovered(m)} onMouseLeave={() => setHovered(null)} style={{ padding: "14px 0", borderTop: "1px solid #efe0c4", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
                  <span style={{ fontSize: 16, color: "#1c1917" }}>{m}</span>
                  <span style={{ ...numStyle, fontSize: 22, fontWeight: 500, whiteSpace: "nowrap" }}>{a.toFixed(2)} <span style={{ color: "#9a928a", fontSize: 14 }}>€</span></span>
                </div>
                <div style={{ marginTop: 8, height: 4, background: "#efe0c4", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${p}%`, height: "100%", background: hovered === m ? "#dc2626" : "#1c1917", transition: "background 200ms, width 400ms" }} />
                </div>
                <div style={{ marginTop: 6, fontFamily: FONT_MONO, fontSize: 11, color: "#9a928a" }}>{p.toFixed(0)}% du total</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ padding: 28, background: "#fef9ee", border: "1px solid #efe0c4", borderRadius: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={labelMono}>Pouls du service</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: FONT_MONO, fontSize: 11, color: "#059669", letterSpacing: 1, textTransform: "uppercase" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#059669", animation: "tdc-pulse 1.5s ease-in-out infinite" }} />
              en direct
            </span>
          </div>
          <Sparkline />
          <div style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 11, color: "#9a928a", display: "flex", justifyContent: "space-between" }}>
            <span>11h</span><span>13h</span><span>15h</span><span>17h</span><span>NOW</span>
          </div>
        </div>

        <div style={{ padding: 28, background: "#1c1917", color: "#fef3e2", borderRadius: 28 }}>
          <div style={{ ...labelMono, color: "#9a928a" }}>// Alerte du phare</div>
          <div style={{ marginTop: 16, fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 500, lineHeight: 1.4, textTransform: "uppercase", letterSpacing: -0.3 }}>
            Coup de feu détecté à <span style={numStyle}>12:45</span>. <span style={{ color: "#f59e0b" }}>3 serveurs</span> en service, <span style={{ color: "#dc2626" }}>2 caisses</span> ouvertes.
          </div>
          <button style={{ marginTop: 22, padding: "12px 18px", borderRadius: 999, background: "#fef3e2", color: "#1c1917", border: "none", fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Ouvrir le rapport →</button>
        </div>

        <div style={{ padding: 28, background: "#fef9ee", border: "1px solid #efe0c4", borderRadius: 28 }}>
          <div style={{ ...labelMono, marginBottom: 16 }}>Dernières transactions</div>
          {txs.slice(0, 5).map((t) => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #efe0c4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#9a928a" }}>{t.time}</span>
                <span style={{ fontSize: 14, color: "#3f3a36" }}>{t.method}</span>
              </div>
              <span style={{ ...numStyle, fontSize: 16, fontWeight: 500 }}>{t.amount.toFixed(2)} €</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sparkline() {
  const points = [12, 18, 14, 28, 35, 32, 48, 42, 55, 68, 72, 65, 78, 88, 76];
  const max = 100;
  const w = 360, h = 80;
  const path = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - (p / max) * h}`).join(" L ");
  const area = `M 0,${h} L ${path} L ${w},${h} Z`;
  return (
    <svg width="100%" height={h + 20} viewBox={`0 -10 ${w} ${h + 20}`} style={{ marginTop: 16, display: "block" }}>
      <path d={area} fill="rgba(220,38,38,0.1)" />
      <path d={`M ${path}`} stroke="#dc2626" strokeWidth="2" fill="none" />
      <circle cx={w} cy={h - (points[points.length - 1] / max) * h} r="4" fill="#dc2626" />
      <circle cx={w} cy={h - (points[points.length - 1] / max) * h} r="8" fill="#dc2626" opacity="0.3"><animate attributeName="r" values="4;14;4" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite"/></circle>
    </svg>
  );
}

// ---------------- Caisse ----------------
function CaissePage() {
  const [open, setOpen] = React.useState(true);
  const fond = 150;
  const txs = SAMPLE_TX;
  const total = txs.reduce((s, t) => s + t.amount, 0);
  const totals = totalsByMethod(txs);
  const theoretical = fond + total;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={labelMono}>// Tableau de bord · caisse principale</div>
          <h1 style={pageTitle}>La caisse</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", background: open ? "#d1fae5" : "#efe0c4", borderRadius: 999 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: open ? "#059669" : "#9a928a", animation: open ? "tdc-pulse 1.5s ease-in-out infinite" : "none" }} />
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: open ? "#065f46" : "#3f3a36" }}>{open ? "Caisse ouverte · 4h 12min" : "Caisse fermée"}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
        <div style={{ padding: 36, background: "#1c1917", color: "#fef3e2", borderRadius: 28 }}>
          <div style={{ ...labelMono, color: "#9a928a" }}>// Théorique en caisse</div>
          <div style={{ marginTop: 16 }}>
            <Num size={104} weight={600}>{Math.floor(theoretical)}<span style={{ color: "#6b645e" }}>,{(theoretical % 1).toFixed(2).slice(2)}</span></Num>
            <Num size={44} weight={500} color="#dc2626">&nbsp;€</Num>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 32, paddingTop: 24, borderTop: "1px solid #3f3a36" }}>
            <div>
              <div style={{ ...labelMono, color: "#9a928a" }}>Fond ouverture</div>
              <div style={{ ...numStyle, fontSize: 22, marginTop: 6 }}>{fond.toFixed(2)} €</div>
            </div>
            <div style={{ width: 1, background: "#3f3a36" }} />
            <div>
              <div style={{ ...labelMono, color: "#9a928a" }}>Encaissé</div>
              <div style={{ ...numStyle, fontSize: 22, marginTop: 6, color: "#f59e0b" }}>+ {total.toFixed(2)} €</div>
            </div>
            <div style={{ width: 1, background: "#3f3a36" }} />
            <div>
              <div style={{ ...labelMono, color: "#9a928a" }}>Transactions</div>
              <div style={{ ...numStyle, fontSize: 22, marginTop: 6 }}>{txs.length}</div>
            </div>
          </div>
          <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
            {open ? (
              <button onClick={() => setOpen(false)} style={{ flex: 1, padding: "16px 20px", borderRadius: 16, background: "#dc2626", color: "#fef3e2", border: "none", fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Clôturer la caisse</button>
            ) : (
              <button onClick={() => setOpen(true)} style={{ flex: 1, padding: "16px 20px", borderRadius: 16, background: "#fef3e2", color: "#1c1917", border: "none", fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Ouvrir la caisse →</button>
            )}
            <button style={{ padding: "16px 20px", borderRadius: 16, background: "transparent", color: "#fef3e2", border: "1px solid #3f3a36", fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Imprimer Z</button>
          </div>
        </div>

        <div style={{ padding: 32, background: "#fef9ee", border: "1px solid #efe0c4", borderRadius: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, letterSpacing: -0.4, textTransform: "uppercase" }}>Récapitulatif</h2>
            <span style={labelMono}>par moyen</span>
          </div>
          {Object.entries(totals).map(([m, a]) => (
            <div key={m} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "16px 0", borderTop: "1px solid #efe0c4" }}>
              <div>
                <div style={{ fontSize: 15, color: "#3f3a36" }}>{m}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#9a928a", marginTop: 4 }}>{((a / total) * 100).toFixed(0)}% DU TOTAL</div>
              </div>
              <div style={{ ...numStyle, fontSize: 22, fontWeight: 500, whiteSpace: "nowrap" }}>{a.toFixed(2)} <span style={{ color: "#9a928a", fontSize: 14 }}>€</span></div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "20px 0 0", borderTop: "2px solid #1c1917", marginTop: 8 }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: "#1c1917", fontWeight: 600 }}>Total</span>
            <div style={{ ...numStyle, fontSize: 32, fontWeight: 600, letterSpacing: -1, color: "#dc2626" }}>{total.toFixed(2)} €</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Flux ----------------
function FluxPage() {
  const txs = SAMPLE_TX;
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
        <div style={{ minWidth: 0 }}>
          <div style={labelMono}>// Journal · {new Date().toLocaleDateString("fr-FR")}</div>
          <h1 style={{ ...pageTitle, whiteSpace: "nowrap" }}>Le flux</h1>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={pillBtn(true)}>Aujourd'hui</button>
          <button style={pillBtn(false)}>7 jours</button>
          <button style={pillBtn(false)}>Ce mois</button>
          <button style={pillBtn(false)}>Personnalisé</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total encaissé", value: "1 247,50", suffix: "€", delta: "+12% vs hier", deltaColor: "#059669" },
          { label: "Transactions", value: "47", suffix: "", delta: "+3 vs hier", deltaColor: "#059669" },
          { label: "Panier moyen", value: "26,54", suffix: "€", delta: "−1,20 € vs hier", deltaColor: "#dc2626" },
        ].map((k) => (
          <div key={k.label} style={{ padding: 24, background: "#fef9ee", border: "1px solid #efe0c4", borderRadius: 24 }}>
            <div style={labelMono}>{k.label}</div>
            <div style={{ marginTop: 12 }}>
              <Num size={48} weight={600}>{k.value}</Num>
              {k.suffix && <Num size={24} color="#9a928a">&nbsp;{k.suffix}</Num>}
            </div>
            <div style={{ marginTop: 10, fontFamily: FONT_MONO, fontSize: 11, color: k.deltaColor, letterSpacing: 0.5, textTransform: "uppercase" }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fef9ee", border: "1px solid #efe0c4", borderRadius: 28, overflow: "hidden" }}>
        <div style={{ display: "flex", padding: "16px 28px", borderBottom: "1px solid #efe0c4", fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9a928a" }}>
          <div style={{ width: 80 }}>Heure</div>
          <div style={{ flex: 1 }}>Moyen</div>
          <div style={{ width: 100, textAlign: "right" }}>Référence</div>
          <div style={{ width: 140, textAlign: "right" }}>Montant</div>
        </div>
        {txs.map((t, i) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", padding: "18px 28px", borderTop: i === 0 ? "none" : "1px solid #efe0c4", transition: "background 150ms" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f7e9d3"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 80, fontFamily: FONT_MONO, fontSize: 13, color: "#6b645e" }}>{t.time}</div>
            <div style={{ flex: 1, fontSize: 15 }}>{t.method}</div>
            <div style={{ width: 100, textAlign: "right", fontFamily: FONT_MONO, fontSize: 12, color: "#9a928a" }}>#{String(1000 + t.id).padStart(5, "0")}</div>
            <div style={{ width: 140, textAlign: "right", ...numStyle, fontSize: 18, fontWeight: 500 }}>{t.amount.toFixed(2)} €</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function pillBtn(active) {
  return {
    padding: "10px 18px", borderRadius: 999, fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
    background: active ? "#1c1917" : "transparent",
    color: active ? "#fef3e2" : "#3f3a36",
    border: active ? "none" : "1px solid #efe0c4",
    cursor: "pointer",
  };
}

// ---------------- Équipage ----------------
function EquipagePage() {
  const users = SAMPLE_USERS;
  const onDuty = users.filter((u) => u.on_duty);
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={labelMono}>// Personnel · {users.length} membres</div>
        <h1 style={pageTitle}>L'équipage</h1>
        <p style={{ marginTop: 16, color: "#3f3a36", fontSize: 16, maxWidth: 560, lineHeight: 1.55 }}>
          <b style={numStyle}>{onDuty.length}</b> en service maintenant. Le prochain quart démarre à <b style={numStyle}>18:00</b>.
        </p>
      </div>

      <div style={{ marginBottom: 24, padding: 24, background: "#1c1917", color: "#fef3e2", borderRadius: 28 }}>
        <div style={{ ...labelMono, color: "#9a928a", marginBottom: 16 }}>// De quart maintenant</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {onDuty.map((u) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px 10px 10px", background: "#3f3a36", borderRadius: 999 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fef3e2", color: "#1c1917", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 600 }}>{u.first_name[0]}{u.last_name[0]}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{u.first_name} {u.last_name}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#9a928a", letterSpacing: 1.2, textTransform: "uppercase" }}>{u.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <input placeholder="Rechercher un membre…" style={{ ...inputStyle, width: 360 }} />
        <button style={{ padding: "14px 22px", borderRadius: 14, background: "#1c1917", color: "#fef3e2", border: "none", fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>+ Embaucher</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {users.map((u) => (
          <div key={u.id} style={{ padding: 24, background: "#fef9ee", border: "1px solid #efe0c4", borderRadius: 24, position: "relative" }}>
            {u.on_duty && <span style={{ position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: "50%", background: "#059669" }} />}
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1c1917", color: "#fef3e2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600 }}>{u.first_name[0]}{u.last_name[0]}</div>
            <div style={{ marginTop: 16, fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, lineHeight: 1.15, textTransform: "uppercase", letterSpacing: -0.3 }}>{u.first_name}<br/>{u.last_name}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#9a928a", marginTop: 10 }}>{u.role}</div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #efe0c4", fontSize: 12, color: "#6b645e" }}>{u.email}</div>
            <div style={{ marginTop: 6, fontFamily: FONT_MONO, fontSize: 10, color: "#9a928a", letterSpacing: 0.5 }}>EMBAUCHÉ LE {new Date(u.hire_date).toLocaleDateString("fr-FR")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Sample data ----------------
const SAMPLE_TX = [
  { id: 1, time: "11:42", method: "Carte bancaire", amount: 18.50 },
  { id: 2, time: "12:15", method: "Espèces", amount: 12.00 },
  { id: 3, time: "12:33", method: "Carte bancaire", amount: 32.40 },
  { id: 4, time: "12:48", method: "Tickets restaurant", amount: 9.80 },
  { id: 5, time: "13:02", method: "Carte bancaire", amount: 45.00 },
  { id: 6, time: "13:25", method: "Espèces", amount: 23.50 },
  { id: 7, time: "13:51", method: "Carte bancaire", amount: 56.20 },
  { id: 8, time: "14:14", method: "Tickets restaurant", amount: 14.50 },
];
function totalsByMethod(txs) {
  return txs.reduce((acc, t) => { acc[t.method] = (acc[t.method] || 0) + t.amount; return acc; }, {});
}
const SAMPLE_USERS = [
  { id: 1, last_name: "Durand", first_name: "Camille", email: "camille@restaurant.fr", hire_date: "2023-04-12", role: "Gérant", on_duty: true },
  { id: 2, last_name: "Martin", first_name: "Élodie", email: "elodie@restaurant.fr", hire_date: "2024-01-08", role: "Responsable", on_duty: true },
  { id: 3, last_name: "Bernard", first_name: "Théo", email: "theo@restaurant.fr", hire_date: "2024-06-20", role: "Serveur", on_duty: true },
  { id: 4, last_name: "Dubois", first_name: "Inès", email: "ines@restaurant.fr", hire_date: "2025-02-03", role: "Serveur", on_duty: false },
  { id: 5, last_name: "Petit", first_name: "Hugo", email: "hugo@restaurant.fr", hire_date: "2025-08-19", role: "Serveur", on_duty: false },
  { id: 6, last_name: "Roux", first_name: "Léa", email: "lea@restaurant.fr", hire_date: "2024-11-02", role: "Responsable", on_duty: false },
];

Object.assign(window, { Logo, Wordmark, LoginPage, Shell, VigiePage, CaissePage, FluxPage, EquipagePage });
