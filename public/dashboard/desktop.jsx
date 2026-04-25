// Desktop two-pane layout — sidebar list + main detail pane
// Reuses tokens (T) and atoms (StatusBadge, DocIcon, DocStrip, Card, Btn, Chip,
// Input, Toggle, Check, RadioGroup, Section, fmtDate) from shared.jsx + buyer-detail.jsx.

function DesktopApp() {
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
      gridTemplateColumns: '64px 360px 1fr',
      overflow: 'hidden',
    }}>
      {/* Rail — global nav */}
      <Rail/>

      {/* Sidebar — buyer list */}
      <aside style={{
        background: '#0F1216',
        borderRight: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column',
        minHeight: 0,
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

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 17.5px 16px' }}>
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

      {/* Main pane */}
      <main style={{ overflowY: 'auto', minHeight: 0 }}>
        {route.name === 'detail' && <DetailPane buyer={BUYERS.find((b) => b.id === route.id) || BUYERS[0]} onWizard={() => setRoute({ name: 'wizard' })}/>}
        {route.name === 'wizard' && <WizardPane onClose={() => setRoute({ name: 'detail', id: 'eddy-chang' })}/>}
      </main>
    </div>
  );
}

// ─── Rail ─────────────────────────────────────────────────────
function Rail() {
  const items = [
    { name: 'Buyers', active: true, icon: <path d="M9 9a3 3 0 100-6 3 3 0 000 6zM3 16c0-3 3-5 6-5s6 2 6 5"/> },
    { name: 'Showings', icon: <path d="M3 8l6-5l6 5v8H3V8z M7 16v-5h4v5"/> },
    { name: 'Calendar', icon: <path d="M3 5h12v10H3V5z M3 8h12 M6 3v3 M12 3v3"/> },
    { name: 'Templates', icon: <path d="M4 3h7l3 3v9H4V3z M11 3v3h3"/> },
    { name: 'Settings', icon: <path d="M9 6.5a2.5 2.5 0 100 5a2.5 2.5 0 000-5z M9 1v2 M9 15v2 M3 9H1 M17 9h-2 M4 4l1.5 1.5 M14 14l-1.5-1.5 M14 4l-1.5 1.5 M4 14l1.5-1.5"/> },
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
      {items.map((it) => (
        <button key={it.name} title={it.name} style={{
          width: 40, height: 40, borderRadius: 9, border: 'none', cursor: 'pointer',
          background: it.active ? 'rgba(55,217,168,0.1)' : 'transparent',
          color: it.active ? T.accent : T.textDim,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {it.icon}
          </svg>
        </button>
      ))}
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

// ─── Detail pane ──────────────────────────────────────────────
function DetailPane({ buyer: b, onWizard }) {
  const fullAddr = `${b.addr.num} ${b.addr.street}, ${b.addr.city}, ${b.addr.state} ${b.addr.zip}`;
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

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, padding: '24px 32px 40px' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
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
                    <Btn size="sm">Generate</Btn>
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

        {/* Right column — identity */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card pad={0}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase' }}>Identity</div>
            </div>
            <KVRow label="Legal name" value={b.legal}/>
            <KVRow label="DOB" value={fmtDate(b.dob)}/>
            <KVRow label="Occupation" value={b.occupation}/>
            <KVRow label="Phone" value={b.phone}/>
            <KVRow label="Address" value={fullAddr} multi/>
            <KVRow label="ID type" value={b.idDoc.type}/>
            <KVRow label="ID number" value={b.idDoc.num} mono/>
            <KVRow label="Jurisdiction" value={b.idDoc.juris}/>
            <KVRow label="Expiry" value={fmtDate(b.idDoc.expiry)} last/>
          </Card>

          <Card pad={14}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Btn variant="secondary" size="sm" full>Email Drive Folder</Btn>
              <Btn variant="secondary" size="sm" full>Upload Title Document</Btn>
              <Btn variant="secondary" size="sm" full>Archive Buyer</Btn>
            </div>
          </Card>
        </aside>
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
function WizardPane({ onClose }) {
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
          {step === 1 && <DesktopStepBuyer/>}
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

function DesktopStepBuyer() {
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
      <Btn variant="secondary" size="md" leading={<svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10 M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}>New Buyer</Btn>
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
