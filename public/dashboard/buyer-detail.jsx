// Screen 2 — Buyer Detail
// Identity · Documents · Active Deals · Showings · FAB

function BuyerDetail({ buyerId, onBack, onOpenDeal, onGenerate, onNewOffer }) {
  const b = BUYERS.find((x) => x.id === buyerId) || BUYERS[0];
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
    <Phone>
      <TopBar
        title={displayName(b)}
        sub={b.email}
        leading={<BackBtn onClick={onBack}/>}
        trailing={
          <button style={{
            background: 'transparent', border: `1px solid ${T.border2}`, color: T.text,
            height: 32, padding: '0 14px', borderRadius: 16,
            fontFamily: T.font, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Edit</button>
        }
      />

      {/* Status strip */}
      <div style={{ padding: '14px 18px 6px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <StatusBadge status={b.status}/>
        <span style={{ fontSize: 12, color: T.textMute, fontFamily: T.mono }}>{b.agreementNumber}</span>
        <span style={{ flex: 1 }}/>
        <span style={{ fontSize: 12, color: T.textDim }}>{b.activity}</span>
      </div>

      <div style={{ height: 18 }}/>

      {/* Identity */}
      <Section title="Identity">
        <Card pad={0}>
          <KV label="Legal name" value={b.legal}/>
          <KV label="DOB" value={fmtDate(b.dob)}/>
          <KV label="Occupation" value={b.occupation}/>
          <KV label="Phone" value={b.phone}/>
          <KV label="Address" value={fullAddr}/>
          <KV label="ID type" value={b.idDoc.type}/>
          <KV label="ID number" value={b.idDoc.num} mono/>
          <KV label="ID jurisdiction" value={b.idDoc.juris}/>
          <KV label="ID expiry" value={fmtDate(b.idDoc.expiry)} last/>
        </Card>
      </Section>

      {/* Documents */}
      <Section title="Documents" action={
        <span style={{ fontSize: 12, color: T.textDim }}>
          {docList.filter((d) => d.on).length}/{docList.length} generated
        </span>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {docList.map((d) => (
            <Card key={d.kind} pad={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: d.on ? 'rgba(55,217,168,0.1)' : 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <DocIcon kind={d.kind} on={d.on}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: d.on ? T.textDim : T.textMute, marginTop: 2 }}>
                    {d.on ? `Generated ${fmtDate(d.date)}` : (d.sub || 'Not yet generated')}
                  </div>
                </div>
                {d.on ? (
                  <button style={{
                    height: 32, padding: '0 12px', background: 'transparent',
                    border: `1px solid ${T.border2}`, color: T.text,
                    borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                    fontFamily: T.font, fontSize: 12.5, fontWeight: 600,
                  }}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 1h5v3h3v6H2V1z M7 1l3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Drive
                  </button>
                ) : (
                  <button onClick={() => onGenerate?.(d.kind)} style={{
                    height: 32, padding: '0 12px', background: T.accent, color: T.accentInk,
                    border: 'none', borderRadius: 16, cursor: 'pointer',
                    fontFamily: T.font, fontSize: 12.5, fontWeight: 700,
                  }}>Generate</button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Active deals */}
      <Section title="Active Deals">
        {b.activeAddress ? (
          <Card onClick={onOpenDeal} pad={14}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 650, color: T.text }}>{b.activeAddress}</div>
                <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 3, fontFamily: T.mono }}>MLS E4521088 · $670,000 offer</div>
              </div>
              <StatusBadge status={b.status} size="sm"/>
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12, color: T.textDim }}>
              <span>4 bd</span><span>3 ba</span><span>2,240 sqft</span>
              <span style={{ flex: 1 }}/>
              <span style={{ color: T.amber, fontWeight: 600 }}>Expires Apr 26, 9:00 PM</span>
            </div>
          </Card>
        ) : (
          <Card pad={20} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13.5, color: T.textDim }}>No active deals yet</div>
          </Card>
        )}
      </Section>

      {/* Showings */}
      <Section title="Showings" action={
        <span style={{ fontSize: 12, color: T.textDim }}>3 tours · 7 properties</span>
      }>
        <Card pad={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Apr 22 — 3 properties</div>
            <span style={{ flex: 1 }}/>
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" stroke={T.textMute} strokeWidth="1.5"><path d="M1 1l5 4.5L1 10"/></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 2 }}>
            {['5016 Kinney Li SW', '212 Wilson Lane NW', '8814 Allard Boulevard SW'].map((a) => (
              <div key={a} style={{ fontSize: 12.5, color: T.textDim, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 3, height: 3, borderRadius: 2, background: T.textMute }}/>
                {a}
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <div style={{ height: 100 }}/>
      <FAB onClick={onNewOffer}>
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10 M2 7h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
        New Offer
      </FAB>
    </Phone>
  );
}

function KV({ label, value, mono, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      padding: '11px 16px',
      borderBottom: last ? 'none' : `1px solid ${T.border}`,
    }}>
      <span style={{ fontSize: 12.5, color: T.textDim, flexShrink: 0 }}>{label}</span>
      <span style={{
        fontSize: 13.5, color: T.text, textAlign: 'right',
        fontFamily: mono ? T.mono : T.font,
        fontWeight: 500,
      }}>{value}</span>
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

Object.assign(window, { BuyerDetail, fmtDate });
