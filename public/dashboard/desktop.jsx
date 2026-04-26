// Desktop two-pane layout — sidebar list + main detail pane
// Reuses tokens (T) and atoms (StatusBadge, DocIcon, DocStrip, Card, Btn, Chip,
// Input, Toggle, Check, RadioGroup, Section, fmtDate) from shared.jsx + buyer-detail.jsx.

function DesktopApp() {
  // Top-level view: 'home' (overview) | 'buyers' (list + detail).
  // Step 1 of the rebuild — both currently render the buyer layout;
  // a dedicated Home component arrives in step 2.
  const [view, setView] = React.useState('buyers');
  const [route, setRoute] = React.useState({ name: 'detail', id: 'eddy-chang' });
  const [filter, setFilter] = React.useState('All');
  const [q, setQ] = React.useState('');

  const filters = [
    { key: 'All',           test: () => true },
    { key: 'Active',        test: (b) => ['BRA Signed', 'Offer Out', 'Accepted'].includes(b.status) },
    { key: 'Showing-only',  test: (b) => b.status === 'Showings Only' },
    { key: 'Pending Deals', test: (b) => ['Offer Out', 'Accepted', 'Pending Possession'].includes(b.status) },
    { key: 'Closed',        test: (b) => b.status === 'Closed' },
  ];
  const visible = BUYERS
    .filter(filters.find((f) => f.key === filter).test)
    .filter((b) => !q || `${b.preferred} ${b.last} ${b.email}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.text,
      fontFamily: T.font, fontSize: 14, lineHeight: 1.45,
      WebkitFontSmoothing: 'antialiased',
      display: 'grid',
      gridTemplateColumns: view === 'home' ? '64px 1fr' : '64px 360px 1fr',
      overflow: 'hidden',
    }}>
      {/* Rail — global nav */}
      <Rail view={view} onSelect={setView}/>

      {/* Sidebar — buyer list (hidden in 'home' view) */}
      {view === 'buyers' ? (
      <aside style={{
        background: '#0F1216',
        borderRight: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column',
        minHeight: 0,
        minWidth: 0,
        overflowX: 'hidden',
      }}>
        <div style={{ padding: '20px 18px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 650, letterSpacing: -0.3 }}>Buyer Files</h1>
            <span style={{ fontSize: 12, color: T.textMute }}>{BUYERS.length}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: T.surface3, border: `1px solid ${T.border}`, borderRadius: 9, padding: '0 10px', height: 36 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={T.textMute} strokeWidth="1.5" style={{ marginRight: 8 }}><circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5l3 3" strokeLinecap="round"/></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search buyers, addresses…"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontFamily: T.font, fontSize: 13 }}/>
            <span style={{ fontSize: 11, color: T.textMute, fontFamily: T.mono, padding: '2px 6px', border: `1px solid ${T.border2}`, borderRadius: 4 }}>⌘K</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 18px 12px' }}>
          {filters.map((f) => (
            <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>{f.key}</Chip>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 10px 16px', minWidth: 0 }}>
          {visible.map((b) => {
            const active = route.name === 'detail' && route.id === b.id;
            return (
              <button key={b.id} onClick={() => setRoute({ name: 'detail', id: b.id })} style={{
                all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
                padding: '9px 10px', borderRadius: 10, marginBottom: 2,
                background: active ? 'rgba(55,217,168,0.08)' : 'transparent',
                border: `1px solid ${active ? 'rgba(55,217,168,0.25)' : 'transparent'}`,
                transition: 'background .12s',
              }}
                onMouseEnter={(e) => !active && (e.currentTarget.style.background = T.surface)}
                onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>
                    {b.preferred} {b.last}
                  </span>
                  <StatusBadge status={b.status} size="sm"/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3, gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 11.5, color: T.textDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>
                    {b.activeAddress || b.activity}
                  </span>
                  <span style={{ fontSize: 10, color: T.textMute, fontFamily: T.mono, whiteSpace: 'nowrap' }}>{b.agreementNumber}</span>
                </div>
                <div style={{ marginTop: 6 }}>
                  <DocStrip docs={b.docs} compact/>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ padding: '12px 18px 18px', borderTop: `1px solid ${T.border}` }}>
          <Btn full size="md" onClick={() => setRoute({ name: 'wizard' })} leading={
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10 M2 7h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          }>
            Start New Paperwork
          </Btn>
        </div>
      </aside>
      ) : null}

      {/* Main pane */}
      <main style={{ overflowY: 'auto', minHeight: 0 }}>
        {view === 'home' ? (
          <Home
            onSelectBuyer={(id) => { setView('buyers'); setRoute({ name: 'detail', id }); }}
            onStartNew={() => { setView('buyers'); setRoute({ name: 'wizard' }); }}
            onNewBuyer={() => { setView('buyers'); setRoute({ name: 'newbuyer' }); }}
          />
        ) : route.name === 'newbuyer' ? (
          <NewBuyer
            onCancel={() => setRoute({ name: 'detail', id: BUYERS[0]?.id || '' })}
            onSaved={() => { window.location.hash = ''; window.location.reload(); }}
          />
        ) : route.name === 'wizard' ? (
          <WizardPane
            onClose={() => setRoute({ name: 'detail', id: BUYERS[0]?.id || '' })}
            onNewBuyer={() => setRoute({ name: 'newbuyer' })}
          />
        ) : (
          <DetailPane buyer={BUYERS.find((b) => b.id === route.id) || BUYERS[0]} onWizard={() => setRoute({ name: 'wizard' })}/>
        )}
      </main>
    </div>
  );
}

// ─── Rail ─────────────────────────────────────────────────────
// Two functional icons (Home + Buyers) — others removed until they have
// real screens. Active item gets the accent treatment; clicking switches
// the top-level view in the parent.
function Rail({ view, onSelect }) {
  const items = [
    { key: 'home',   label: 'Home',   icon: <path d="M3 8l6-5l6 5v8H3V8z M7 16v-5h4v5"/> },
    { key: 'buyers', label: 'Buyers', icon: <path d="M9 9a3 3 0 100-6 3 3 0 000 6zM3 16c0-3 3-5 6-5s6 2 6 5"/> },
  ];
  return (
    <nav style={{
      background: '#0A0C0F', borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0',
      gap: 6,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, marginBottom: 10,
        background: T.accent, color: T.accentInk,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 800, fontFamily: T.mono, letterSpacing: -0.5,
      }}>BF</div>
      {items.map((it) => {
        const active = view === it.key;
        return (
          <button key={it.key} title={it.label} onClick={() => onSelect && onSelect(it.key)} style={{
            width: 40, height: 40, borderRadius: 9, border: 'none', cursor: 'pointer',
            background: active ? 'rgba(55,217,168,0.1)' : 'transparent',
            color: active ? T.accent : T.textDim,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .12s',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {it.icon}
            </svg>
          </button>
        );
      })}
      <div style={{ flex: 1 }}/>
      <div style={{
        width: 32, height: 32, borderRadius: 16,
        background: 'oklch(0.4 0.06 230)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: '#fff',
      }}>RA</div>
    </nav>
  );
}

// ─── New Buyer form ───────────────────────────────────────────
// Single-screen intake. Writes to /api/buyers and on success navigates
// to the buyer detail page where the agent can generate paperwork.
function NewBuyer({ onCancel, onSaved }) {
  const [s, setS] = React.useState({
    preferred_name: "", last_name: "", legal_name: "",
    email: "", dob: "", occupation: "",
    street_num: "", street: "", city: "", state: "AB", zipcode: "",
    id_document_type: "Driver's Licence",
    id_number: "", id_issuing_jurisdiction: "AB", id_expiry_date: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const set = (k, v) => setS((o) => ({ ...o, [k]: v }));

  // Auto-generated agreement number — buyer initials + MMYY (e.g. EC-0426).
  // Both first and last initial fall back to legal_name's words when the
  // dedicated fields are blank.
  const agreementNumber = React.useMemo(() => {
    const legalParts = (s.legal_name || "").trim().split(/\s+/).filter(Boolean);
    const firstSource = (s.preferred_name || legalParts[0] || "").trim();
    const lastSource  = (s.last_name || legalParts[legalParts.length - 1] || "").trim();
    const fi = firstSource[0] || "";
    const li = lastSource[0]  || "";
    if (!fi && !li) return "";
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear() % 100).padStart(2, "0");
    return `${(fi + li).toUpperCase()}-${mm}${yy}`;
  }, [s.preferred_name, s.legal_name, s.last_name]);

  const canSubmit = s.legal_name.trim() && s.email.trim() && !submitting;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, agreement_number: agreementNumber }),
      });
      const json = await res.json();
      if (json.success) {
        onSaved && onSaved(json.buyer_id);
      } else {
        setError(json.error || "Failed to save");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "32px 40px 60px", maxWidth: 760, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: "uppercase" }}>New Buyer</div>
          <h1 style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>Add a buyer file</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: T.textDim }}>
            Saved to the Buyers tab. Generate paperwork from the detail page.
          </p>
        </div>
        <Btn variant="ghost" size="sm" onClick={onCancel}>Cancel</Btn>
      </div>

      {/* Identity */}
      <Card pad={20} style={{ marginBottom: 18 }}>
        <SectionLabel>Identity</SectionLabel>
        <FieldGrid>
          <Field label="Preferred name" hint="Optional — falls back to legal name">
            <input type="text" value={s.preferred_name} onChange={(e) => set("preferred_name", e.target.value)} placeholder="Eddy" style={inputStyle}/>
          </Field>
          <Field label="Last name" hint="Optional — derived from legal name if blank">
            <input type="text" value={s.last_name} onChange={(e) => set("last_name", e.target.value)} placeholder="Chang" style={inputStyle}/>
          </Field>
          <Field label="Legal name * (full name on ID)" wide>
            <input type="text" value={s.legal_name} onChange={(e) => set("legal_name", e.target.value)} placeholder="Edward Chang" style={inputStyle}/>
          </Field>
          <Field label="Email *">
            <input type="email" value={s.email} onChange={(e) => set("email", e.target.value)} placeholder="eddy.chang@gmail.com" style={inputStyle}/>
          </Field>
          <Field label="Agreement number" hint="Auto-generated from initials + MM/YY">
            <input type="text" value={agreementNumber} readOnly style={{ ...inputStyle, opacity: 0.7 }}/>
          </Field>
        </FieldGrid>
      </Card>

      {/* Personal */}
      <Card pad={20} style={{ marginBottom: 18 }}>
        <SectionLabel>Personal</SectionLabel>
        <FieldGrid>
          <Field label="Date of birth">
            <input type="date" value={s.dob} onChange={(e) => set("dob", e.target.value)} style={inputStyle}/>
          </Field>
          <Field label="Occupation">
            <input type="text" value={s.occupation} onChange={(e) => set("occupation", e.target.value)} placeholder="Software Engineer" style={inputStyle}/>
          </Field>
        </FieldGrid>
      </Card>

      {/* Address */}
      <Card pad={20} style={{ marginBottom: 18 }}>
        <SectionLabel>Home address</SectionLabel>
        <FieldGrid>
          <Field label="Street number">
            <input type="text" value={s.street_num} onChange={(e) => set("street_num", e.target.value)} placeholder="4823" style={inputStyle}/>
          </Field>
          <Field label="Street">
            <input type="text" value={s.street} onChange={(e) => set("street", e.target.value)} placeholder="109 Street NW" style={inputStyle}/>
          </Field>
          <Field label="City">
            <input type="text" value={s.city} onChange={(e) => set("city", e.target.value)} placeholder="Edmonton" style={inputStyle}/>
          </Field>
          <Field label="Province">
            <input type="text" value={s.state} onChange={(e) => set("state", e.target.value)} placeholder="AB" style={inputStyle}/>
          </Field>
          <Field label="Postal code">
            <input type="text" value={s.zipcode} onChange={(e) => set("zipcode", e.target.value)} placeholder="T6H 1C5" style={inputStyle}/>
          </Field>
        </FieldGrid>
      </Card>

      {/* ID */}
      <Card pad={20} style={{ marginBottom: 18 }}>
        <SectionLabel>Identification</SectionLabel>
        <FieldGrid>
          <Field label="ID type">
            <select value={s.id_document_type} onChange={(e) => set("id_document_type", e.target.value)} style={inputStyle}>
              <option>Driver's Licence</option>
              <option>Passport</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="ID number">
            <input type="text" value={s.id_number} onChange={(e) => set("id_number", e.target.value)} placeholder="203-948-721" style={inputStyle}/>
          </Field>
          <Field label="Issuing jurisdiction">
            <input type="text" value={s.id_issuing_jurisdiction} onChange={(e) => set("id_issuing_jurisdiction", e.target.value)} placeholder="Alberta" style={inputStyle}/>
          </Field>
          <Field label="Expiry date">
            <input type="date" value={s.id_expiry_date} onChange={(e) => set("id_expiry_date", e.target.value)} style={inputStyle}/>
          </Field>
        </FieldGrid>
      </Card>

      {error && (
        <div style={{ background: "rgba(230,107,107,0.12)", color: "#F0A5A5", padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Btn variant="secondary" size="md" onClick={onCancel}>Cancel</Btn>
        <Btn size="md" disabled={!canSubmit} onClick={handleSubmit}>
          {submitting ? "Saving…" : "Save Buyer"}
        </Btn>
      </div>
    </div>
  );
}

// Small layout helpers used by the form
const inputStyle = {
  width: "100%", height: 38, padding: "0 12px",
  background: T.surface3, color: T.text,
  border: `1px solid ${T.border}`, borderRadius: 8,
  fontFamily: T.font, fontSize: 14,
  outline: "none", boxSizing: "border-box",
};
function FieldGrid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>{children}</div>;
}
function Field({ label, hint, wide, children }) {
  return (
    <label style={{ display: "block", gridColumn: wide ? "1 / -1" : "auto" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11, color: T.textMute, marginTop: 4 }}>{hint}</div>}
    </label>
  );
}


// ─── Home / Overview ──────────────────────────────────────────
// First screen the agent sees. Pipeline stats + urgent items +
// upcoming dates + recent activity. Stats derive from BUYERS; the
// urgent/upcoming/activity arrays are mocked until the watcher writes
// derived signals to a Sheets tab we can read.
function Home({ onSelectBuyer, onStartNew, onNewBuyer }) {
  const today = new Date();
  const monthName = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });

  const safeBuyers = Array.isArray(BUYERS) ? BUYERS : [];
  const safeTours = Array.isArray(TOURS) ? TOURS : [];
  const activeDeals = safeBuyers.filter((b) => ['Offer Out', 'Accepted', 'Conditions Pending', 'Pending Possession'].includes(b.status)).length;
  const closingThisMonth = safeBuyers.filter((b) => b.status === 'Pending Possession').length;

  // Showings scheduled = total upcoming property showings across all booked tours.
  const upcomingTours = safeTours.filter((t) => t.upcoming);
  const showingsScheduled = upcomingTours.reduce((sum, t) => sum + (t.properties || []).length, 0);

  // Map buyer names → ids so tour rows can navigate to the right buyer
  const buyerIdByName = {};
  safeBuyers.forEach((b) => { buyerIdByName[`${b.preferred} ${b.last}`] = b.id; });

  // Drive — pull from defaults.json on the watcher side; here we hardcode the
  // Deals parent folder. Year auto-detection happens server-side eventually.
  const driveDealsFolderId = '1JcKlfFgkHhI0TGrMkxlxiSyFbpvEI_SW';
  const driveDealsUrl = `https://drive.google.com/drive/folders/${driveDealsFolderId}`;

  // Helpers to format a date relative to today
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  function fmtShortDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  function relativeWhen(iso) {
    const d = new Date(iso + 'T00:00:00');
    const diff = Math.round((d - startOfDay) / (24 * 60 * 60 * 1000));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff < 0)   return `${-diff} days ago`;
    return `${diff} days`;
  }

  const urgent = [
    { kind: 'expiry',    icon: '🔥', text: 'Eddy Chang — offer expires in 22 hours',         buyerId: 'eddy-chang',    sub: '5016 Kinney Li SW · Apr 26, 9:00 PM' },
    { kind: 'condition', icon: '⚠️', text: 'Priya Sandhu — condition removal due Apr 28',    buyerId: 'priya-sandhu',  sub: '208 Windermere Drive SW · Financing + Inspection' },
    { kind: 'paperwork', icon: '📋', text: 'Marcus Okafor — generate FINTRAC pkg',           buyerId: 'marcus-okafor', sub: 'Required after offer acceptance' },
    { kind: 'possession',icon: '🔑', text: 'Rachel Tremblay — possession in 35 days',        buyerId: 'rachel-tremblay', sub: '92 Terwillegar Vista NW · May 30' },
  ];

  // Hardcoded deal milestones (offer expiry, condition removal, closing,
  // possession). These will derive from real Sheets data once the watcher
  // emits them — for now mocked.
  const upcomingMilestones = [
    { sortDate: '2026-04-26', text: 'Eddy Chang — offer expiry',          buyerId: 'eddy-chang' },
    { sortDate: '2026-04-28', text: 'Priya Sandhu — condition removal',   buyerId: 'priya-sandhu' },
    { sortDate: '2026-05-15', text: 'Marcus Okafor — closing',            buyerId: 'marcus-okafor' },
    { sortDate: '2026-05-30', text: 'Rachel Tremblay — possession',       buyerId: 'rachel-tremblay' },
    { sortDate: '2026-06-15', text: 'Eddy Chang — closing (if accepted)', buyerId: 'eddy-chang' },
  ];
  // Showings derive from TOURS — auto-include the new buyers' bookings
  const upcomingShowingRows = upcomingTours.map((t) => ({
    sortDate: t.date,
    text: `${t.buyer} — showing ${t.properties.length} ${t.properties.length === 1 ? 'property' : 'properties'}`,
    buyerId: buyerIdByName[t.buyer] || null,
  }));
  const upcoming = [...upcomingMilestones, ...upcomingShowingRows]
    .sort((a, b) => a.sortDate.localeCompare(b.sortDate))
    .map((u) => ({
      date: fmtShortDate(u.sortDate),
      when: relativeWhen(u.sortDate),
      text: u.text,
      buyerId: u.buyerId,
    }));

  return (
    <div style={{ padding: '32px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase' }}>{weekday}</div>
          <h1 style={{ margin: '4px 0 0', fontSize: 30, fontWeight: 700, letterSpacing: -0.6 }}>{monthName}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="secondary" size="md" onClick={onNewBuyer}>+ Add Buyer</Btn>
          <Btn size="md" onClick={onStartNew}>Start New Paperwork</Btn>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
        <HeroStat label="Active Deals"        value={activeDeals}       sub="Offer out · Accepted · Pending"/>
        <HeroStat label="Showings Scheduled"  value={showingsScheduled} sub="Upcoming this week + next"/>
        <HeroStat label="Closing This Month"  value={closingThisMonth}  sub={closingThisMonth ? 'Possession scheduled' : 'No closings yet'}/>
      </div>

      <SectionLabel>Urgent — needs attention</SectionLabel>
      <Card pad={0} style={{ marginBottom: 28 }}>
        {urgent.map((u, i) => (
          <button key={u.kind} onClick={() => onSelectBuyer && onSelectBuyer(u.buyerId)} style={{
            all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px', width: '100%', boxSizing: 'border-box',
            borderBottom: i === urgent.length - 1 ? 'none' : `1px solid ${T.border}`,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{u.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{u.text}</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{u.sub}</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={T.textMute} strokeWidth="1.5" style={{ flexShrink: 0 }}>
              <path d="M4 2l4 4l-4 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </Card>

      <SectionLabel>Upcoming (next 30 days)</SectionLabel>
      <Card pad={0} style={{ marginBottom: 28 }}>
        {upcoming.map((u, i) => (
          <button key={i} onClick={() => onSelectBuyer && onSelectBuyer(u.buyerId)} style={{
            all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 18px', width: '100%', boxSizing: 'border-box',
            borderBottom: i === upcoming.length - 1 ? 'none' : `1px solid ${T.border}`,
          }}>
            <div style={{ width: 56, flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: T.mono }}>{u.date}</div>
              <div style={{ fontSize: 10.5, color: T.textMute, marginTop: 1 }}>{u.when}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: T.text }}>{u.text}</div>
          </button>
        ))}
      </Card>

      <SectionLabel>Files</SectionLabel>
      <Card pad={16}>
        <a href={driveDealsUrl} target="_blank" rel="noopener noreferrer" style={{
          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 9, flexShrink: 0,
            background: 'rgba(55,217,168,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 5h5l2 2h7v9H3V5z"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Open Deals folder in Drive</div>
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Real Estate / Deals — buyer subfolders inside the year folder</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={T.textMute} strokeWidth="1.5" style={{ flexShrink: 0 }}>
            <path d="M5 3h6v6 M11 3l-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </Card>
    </div>
  );
}

function HeroStat({ label, value, sub }) {
  return (
    <Card pad={20}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, marginTop: 6, letterSpacing: -1, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.textDim, marginTop: 8 }}>{sub}</div>}
    </Card>
  );
}

function SectionLabel({ children }) {
  return (
    <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: T.textMute, letterSpacing: 0.5, textTransform: 'uppercase' }}>{children}</h3>
  );
}

// ─── Identity strip ───────────────────────────────────────────
// Compact replacement for the old right-column Identity panel — fits
// inline in the detail pane as a single 3-column card.
function IdentityStrip({ b, fullAddr }) {
  const items = [
    { label: 'Legal name', value: b.legal },
    { label: 'DOB',        value: fmtDate(b.dob) },
    { label: 'Occupation', value: b.occupation },
    { label: 'Address',    value: fullAddr },
    { label: 'ID',         value: `${b.idDoc.type} · ${b.idDoc.num} · ${b.idDoc.juris}`, mono: true },
    { label: 'ID expiry',  value: fmtDate(b.idDoc.expiry) },
  ];
  return (
    <Card pad={0}>
      <div style={{ padding: '12px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase' }}>Identity</span>
        <Btn size="sm" variant="ghost">Edit</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '14px 18px', gap: '12px 24px' }}>
        {items.map((it) => (
          <div key={it.label}>
            <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600 }}>{it.label}</div>
            <div style={{ fontSize: 13, color: T.text, marginTop: 3, fontFamily: it.mono ? T.mono : T.font, fontWeight: 500 }}>{it.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Detail pane ──────────────────────────────────────────────

// Maps the dashboard's compact doc kind to the form_key used by
// field_schema.json + forms_engine.fill_form().
const FORM_KEY_BY_KIND = {
  crg:     'consumer_relationships_guide',
  bra:     'buyer_representation_agreement',
  fintrac: 'fintrac_individual_id',
  rof:     'fintrac_receipt_of_funds',
  ti:      'transaction_information',
  waiver:  'notice_waiver',
};

function DetailPane({ buyer: b, onWizard }) {
  const fullAddr = `${b.addr.num} ${b.addr.street}, ${b.addr.city}, ${b.addr.state} ${b.addr.zip}`;
  // Track which doc kinds are currently being requested so we can show
  // a "Requesting…" state on the corresponding button.
  const [pending, setPending] = React.useState({});

  const requestGenerate = async (kind) => {
    const form_key = FORM_KEY_BY_KIND[kind];
    if (!form_key) {
      alert(`No form_key mapped for "${kind}"`);
      return;
    }
    setPending((p) => ({ ...p, [kind]: true }));
    try {
      const res = await fetch('/api/paperwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_key, buyer_id: b.id }),
      });
      const json = await res.json();
      if (json.success) {
        alert(
          `Queued ${form_key}\n\n` +
          `Paperwork ID: ${json.paperwork_id}\n\n` +
          `The desktop processor will pick it up within ~30 seconds and place ` +
          `the PDF in the buyer's Drive folder.`
        );
      } else {
        alert(`Error: ${json.error || 'unknown'}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    } finally {
      setPending((p) => ({ ...p, [kind]: false }));
    }
  };

  const docList = [
    { kind: 'crg', name: 'Consumer Relationships Guide', date: b.crg, on: b.docs.crg },
    { kind: 'bra', name: 'Buyer Representation Agreement', date: b.bra, on: b.docs.bra, sub: 'Expires Oct 19, 2026' },
    { kind: 'fintrac', name: 'FINTRAC ID + PEP', date: b.docs.fintrac ? '2026-04-26' : null, on: b.docs.fintrac, sub: 'Required post-acceptance' },
    { kind: 'rof', name: 'Receipt of Funds', date: b.docs.rof ? '2026-04-29' : null, on: b.docs.rof, sub: 'Generate after deposit' },
    { kind: 'ti', name: 'Transaction Information', date: b.docs.ti ? '2026-04-26' : null, on: b.docs.ti },
    { kind: 'waiver', name: 'Notice of Waiver / Satisfaction', date: b.docs.waiver ? '2026-04-30' : null, on: b.docs.waiver, sub: 'On condition removal' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '24px 32px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'flex-start', gap: 18, position: 'sticky', top: 0, background: 'rgba(11,13,16,0.92)', backdropFilter: 'blur(12px)', zIndex: 5 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 28, flexShrink: 0,
          background: 'oklch(0.32 0.05 200)', color: 'oklch(0.85 0.07 200)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 19, fontWeight: 700,
        }}>{b.preferred[0]}{b.last[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>{b.preferred} {b.last}</h2>
            <StatusBadge status={b.status}/>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 13, color: T.textDim, flexWrap: 'wrap' }}>
            <span>{b.email}</span>
            <span>·</span>
            <span>{b.phone}</span>
            <span>·</span>
            <span style={{ fontFamily: T.mono }}>{b.agreementNumber}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Btn variant="secondary" size="sm">Edit</Btn>
          <Btn size="sm" onClick={onWizard} leading={
            <svg width="13" height="13" viewBox="0 0 13 13"><path d="M6.5 2v9 M2 6.5h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          }>New Offer</Btn>
        </div>
      </div>

      {/* Body — single column, max 1100 wide, centered */}
      <div style={{ padding: '24px 32px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0, maxWidth: 1100, margin: '0 auto' }}>
          {/* Active deal banner */}
          {b.activeAddress && (
            <Card pad={18} style={{
              background: 'linear-gradient(135deg, rgba(55,217,168,0.06), rgba(55,217,168,0.02))',
              borderColor: 'rgba(55,217,168,0.25)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Active Deal</div>
                  <div style={{ fontSize: 20, fontWeight: 650, marginBottom: 4 }}>{b.activeAddress}</div>
                  <div style={{ fontSize: 12.5, color: T.textDim, fontFamily: T.mono }}>MLS E4521088 · Listed by Daniel Vu, RE/MAX Elite</div>
                </div>
                <Btn size="sm" variant="secondary">Open Deal →</Btn>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                <Stat label="Offer price" value="$670,000"/>
                <Stat label="Deposit" value="$25,000" sub="Due Apr 29"/>
                <Stat label="Closing" value="Jun 15, 2026"/>
                <Stat label="Expires" value="Apr 26, 9:00 PM" amber/>
              </div>
            </Card>
          )}

          {/* Identity strip — compact inline replacement for the old right column */}
          <IdentityStrip b={b} fullAddr={fullAddr}/>

          {/* Documents — table on desktop */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: T.textMute }}>Documents</h3>
              <span style={{ fontSize: 12, color: T.textDim }}>{docList.filter((d) => d.on).length}/{docList.length} generated</span>
            </div>
            <Card pad={0}>
              {docList.map((d, i) => (
                <div key={d.kind} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px',
                  borderBottom: i === docList.length - 1 ? 'none' : `1px solid ${T.border}`,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: d.on ? 'rgba(55,217,168,0.1)' : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <DocIcon kind={d.kind} on={d.on}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: d.on ? T.textDim : T.textMute, marginTop: 2 }}>
                      {d.on ? `Generated ${fmtDate(d.date)}` : (d.sub || 'Not yet generated')}
                    </div>
                  </div>
                  {d.on ? (
                    <>
                      <Btn size="sm" variant="ghost">Drive</Btn>
                      <Btn size="sm" variant="ghost">Resend</Btn>
                    </>
                  ) : (
                    <Btn size="sm" disabled={pending[d.kind]} onClick={() => requestGenerate(d.kind)}>
                      {pending[d.kind] ? 'Requesting…' : 'Generate'}
                    </Btn>
                  )}
                </div>
              ))}
            </Card>
          </div>

          {/* Showings */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: T.textMute }}>Showing History</h3>
              <span style={{ fontSize: 12, color: T.textDim }}>3 tours · 7 properties</span>
            </div>
            <Card pad={0}>
              {[
                { date: '2026-04-22', count: 3, addrs: ['5016 Kinney Li SW', '212 Wilson Lane NW', '8814 Allard Boulevard SW'] },
                { date: '2026-04-18', count: 2, addrs: ['5016 Kinney Li SW', '11023 Ellerslie Crescent SW'] },
                { date: '2026-04-12', count: 2, addrs: ['92 Terwillegar Vista NW', '4419 Gault Common SW'] },
              ].map((t, i, arr) => (
                <div key={t.date} style={{
                  padding: '14px 18px',
                  borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${T.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{fmtDate(t.date)} — {t.count} properties</span>
                    <Btn size="sm" variant="ghost">View tour</Btn>
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: T.textDim, flexWrap: 'wrap' }}>
                    {t.addrs.map((a) => <span key={a}>· {a}</span>)}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, amber }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 650, marginTop: 4, color: amber ? T.amber : T.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function KVRow({ label, value, mono, multi, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: multi ? 'flex-start' : 'center', gap: 12,
      padding: '10px 16px',
      borderBottom: last ? 'none' : `1px solid ${T.border}`,
    }}>
      <span style={{ fontSize: 12, color: T.textDim, flexShrink: 0 }}>{label}</span>
      <span style={{
        fontSize: 13, color: T.text, textAlign: 'right',
        fontFamily: mono ? T.mono : T.font, fontWeight: 500,
        maxWidth: '70%',
      }}>{value}</span>
    </div>
  );
}

// ─── Wizard pane (desktop) ────────────────────────────────────
// Modal-style wide wizard with step rail on left, form on right.
function WizardPane({ onClose, onNewBuyer }) {
  const [step, setStep] = React.useState(1);
  const labels = ['Buyer', 'Pre-offer', 'Property', 'Offer terms', 'Review'];
  const total = 5;

  return (
    <div>
      <div style={{ padding: '24px 32px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(11,13,16,0.92)', backdropFilter: 'blur(12px)', zIndex: 5 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase' }}>New Paperwork</div>
          <h2 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>{labels[step - 1]}</h2>
        </div>
        <Btn variant="ghost" size="sm" onClick={onClose}>Cancel</Btn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0, minHeight: 500 }}>
        {/* Step rail */}
        <nav style={{ borderRight: `1px solid ${T.border}`, padding: '24px 16px' }}>
          {labels.map((l, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <button key={l} onClick={() => setStep(n)} style={{
                all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 9, marginBottom: 2, width: '100%', boxSizing: 'border-box',
                background: active ? T.surface : 'transparent',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                  background: done ? T.accent : (active ? 'rgba(55,217,168,0.15)' : 'transparent'),
                  border: `1.5px solid ${done || active ? T.accent : T.border2}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: done ? T.accentInk : (active ? T.accent : T.textMute),
                  fontSize: 11, fontWeight: 700,
                }}>
                  {done ? <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 5.5l2.5 2.5l5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> : n}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: active ? T.text : T.textDim }}>{l}</span>
              </button>
            );
          })}
        </nav>

        {/* Form area */}
        <div style={{ padding: '24px 32px 100px', maxWidth: 720 }}>
          {step === 1 && <DesktopStepBuyer onNewBuyer={onNewBuyer}/>}
          {step === 2 && <DesktopStepPreOffer/>}
          {step === 3 && <DesktopStepProperty/>}
          {step === 4 && <DesktopStepTerms/>}
          {step === 5 && <DesktopStepReview/>}
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(11,13,16,0.94)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${T.border}`, padding: '14px 32px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" size="md" onClick={onClose}>Cancel</Btn>
        {step > 1 && <Btn variant="secondary" size="md" onClick={() => setStep(step - 1)}>Back</Btn>}
        {step < total && <Btn size="md" onClick={() => setStep(step + 1)}>Continue →</Btn>}
        {step === total && <Btn size="md" onClick={onClose}>Submit & Generate</Btn>}
      </div>
    </div>
  );
}

function DesktopStepBuyer({ onNewBuyer }) {
  const [sel, setSel] = React.useState('eddy-chang');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 650 }}>Find or create the buyer</h3>
        <p style={{ margin: 0, fontSize: 13.5, color: T.textDim }}>Pull from past showings or files, or start fresh.</p>
      </div>
      <Input placeholder="Search by name or email" value="" onChange={() => {}}
        prefix={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={T.textMute} strokeWidth="1.5"><circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5l3 3" strokeLinecap="round"/></svg>}/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {BUYERS.slice(0, 4).map((b) => (
          <Card key={b.id} onClick={() => setSel(b.id)} pad={14}
            style={{ borderColor: sel === b.id ? T.accent : T.border, background: sel === b.id ? 'rgba(55,217,168,0.06)' : T.surface }}>
            <div style={{ fontSize: 14.5, fontWeight: 650 }}>{b.preferred} {b.last}</div>
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{b.email}</div>
            <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 6 }}>{b.activity}</div>
          </Card>
        ))}
      </div>
      <Btn variant="secondary" size="md" onClick={onNewBuyer} leading={<svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10 M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}>New Buyer</Btn>
    </div>
  );
}

function DesktopStepPreOffer() {
  const [count, setCount] = React.useState(2);
  const [crg, setCrg] = React.useState(true);
  const [bra, setBra] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 650 }}>Pre-offer paperwork</h3>
        <p style={{ margin: 0, fontSize: 13.5, color: T.textDim }}>Capture buyer info and choose what to generate.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>How many buyers on this contract?</span>
        <div style={{ width: 220 }}>
          <RadioGroup value={count} onChange={setCount} options={[{ value: 1, label: '1 buyer' }, { value: 2, label: '2 buyers' }]}/>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: count === 2 ? '1fr 1fr' : '1fr', gap: 12 }}>
        <DesktopBuyerCard idx={1} buyer={BUYERS[0]}/>
        {count === 2 && <DesktopBuyerCard idx={2} buyer={BUYERS[1]}/>}
      </div>
      <Card pad={16}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 }}>Generate alongside offer</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ToggleRow on={crg} onChange={setCrg} title="Consumer Relationships Guide" sub="Required at first showing or offer"/>
          <ToggleRow on={bra} onChange={setBra} title="Buyer Representation Agreement" sub="Auto-numbered ECVH-0526 · 6 mo"/>
        </div>
      </Card>
    </div>
  );
}

function ToggleRow({ on, onChange, title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: T.surface2, borderRadius: 10, border: `1px solid ${T.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 2 }}>{sub}</div>
      </div>
      <Toggle on={on} onChange={onChange}/>
    </div>
  );
}

function DesktopBuyerCard({ idx, buyer }) {
  const [method, setMethod] = React.useState('upload');
  return (
    <Card pad={14}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: 12, background: T.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: T.textDim }}>{idx}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 650 }}>{buyer.preferred} {buyer.last}</div>
          <div style={{ fontSize: 11.5, color: T.textDim }}>{buyer.email}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { k: 'upload', l: 'Upload ID Photo', h: 'Auto-parse fields' },
          { k: 'type', l: 'Type Legal Name Only', h: 'Skip ID for now' },
          { k: 'skip', l: 'Already on File', h: 'Use saved info' },
        ].map((m) => {
          const sel = method === m.k;
          return (
            <button key={m.k} onClick={() => setMethod(m.k)} style={{
              all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px',
              background: sel ? 'rgba(55,217,168,0.07)' : T.surface2,
              border: `1px solid ${sel ? T.accent : T.border}`, borderRadius: 9,
            }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, border: `1.5px solid ${sel ? T.accent : T.border2}`, background: sel ? T.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {sel && <span style={{ width: 6, height: 6, borderRadius: 3, background: T.accentInk }}/>}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{m.l}</span>
              <span style={{ fontSize: 11, color: T.textDim, marginLeft: 'auto' }}>{m.h}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function DesktopStepProperty() {
  const [src, setSrc] = React.useState('showings');
  const [picked, setPicked] = React.useState('E4521088');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 650 }}>Choose the property</h3>
        <p style={{ margin: 0, fontSize: 13.5, color: T.textDim }}>From a recent showing, or upload an MLS PDF to parse.</p>
      </div>
      <div style={{ width: 320 }}>
        <RadioGroup value={src} onChange={setSrc} options={[{ value: 'showings', label: 'From Showings' }, { value: 'mls', label: 'Upload MLS' }]}/>
      </div>
      {src === 'showings' && TOURS.map((t) => (
        <Card key={t.id} pad={14}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{fmtDate(t.date)} · {t.buyer}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {t.properties.map((p) => {
              const sel = picked === p.mls;
              return (
                <button key={p.mls} onClick={() => setPicked(p.mls)} style={{
                  all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px',
                  background: sel ? 'rgba(55,217,168,0.07)' : T.surface2,
                  border: `1px solid ${sel ? T.accent : T.border}`, borderRadius: 9,
                }}>
                  <ImgPlaceholder w={56} h={40} label="img" style={{ borderRadius: 5 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.address}</div>
                    <div style={{ fontSize: 11, color: T.textDim, marginTop: 1, fontFamily: T.mono }}>{p.mls} · ${p.price.toLocaleString()}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

function DesktopStepTerms() {
  const [s, setS] = React.useState({ price: '670000', dep: '25000', dd: '2026-04-29', cl: '2026-06-15', fin: true, ins: true, exp: '2026-04-26T21:00' });
  const set = (k, v) => setS((x) => ({ ...x, [k]: v }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 650 }}>Offer terms</h3>
        <p style={{ margin: 0, fontSize: 13.5, color: T.textDim }}>Price, dates, conditions, and offer expiry.</p>
      </div>
      <Card pad={16}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 }}>Price & Dates</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Purchase price" prefix="$" value={s.price} onChange={(v) => set('price', v)}/>
          <Input label="Deposit" prefix="$" value={s.dep} onChange={(v) => set('dep', v)}/>
          <Input label="Deposit due" type="date" value={s.dd} onChange={(v) => set('dd', v)}/>
          <Input label="Closing date" type="date" value={s.cl} onChange={(v) => set('cl', v)}/>
        </div>
      </Card>
      <Card pad={16}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Conditions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <Check on={s.fin} onChange={(v) => set('fin', v)} label="Financing" sub="10 business days"/>
          <Check on={s.ins} onChange={(v) => set('ins', v)} label="Property inspection" sub="7 business days"/>
          <Check on={false} onChange={() => {}} label="Buyer's sale of existing home"/>
          <Check on={false} onChange={() => {}} label="Additional condition"/>
        </div>
      </Card>
      <Card pad={16} style={{ maxWidth: 360 }}>
        <Input label="Offer expiry" type="datetime-local" value={s.exp} onChange={(v) => set('exp', v)}/>
      </Card>
    </div>
  );
}

function DesktopStepReview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 650 }}>Review & submit</h3>
        <p style={{ margin: 0, fontSize: 13.5, color: T.textDim }}>Documents will be generated to Drive and a Gmail draft will open.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card pad={14}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Buyers</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Eddy Chang</div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 1 }}>eddy.chang@gmail.com</div>
          <div style={{ height: 8 }}/>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Vanessa Huang</div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 1 }}>v.huang@protonmail.com</div>
        </Card>
        <Card pad={14}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Property</div>
          <div style={{ fontSize: 14, fontWeight: 650 }}>5016 Kinney Li SW</div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 2, fontFamily: T.mono }}>E4521088 · $685,000</div>
        </Card>
      </div>
      <Card pad={14}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Will Generate</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Consumer Relationships Guide', 'Buyer Representation Agreement', 'Offer Contract — Residential'].map((t) => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(55,217,168,0.12)', color: T.accent, padding: '5px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600 }}>
              <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 5.5l2 2l5-5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {t}
            </span>
          ))}
        </div>
      </Card>
      <Card pad={14}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Offer Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <Stat label="Price" value="$670,000"/>
          <Stat label="Deposit" value="$25,000"/>
          <Stat label="Closing" value="Jun 15"/>
          <Stat label="Expires" value="Apr 26, 9 PM" amber/>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { DesktopApp });
