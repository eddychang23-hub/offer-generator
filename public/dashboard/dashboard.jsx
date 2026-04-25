// Screen 1 — Dashboard Home
// List of buyer cards · filter chips · "Start New Paperwork" CTA

function Dashboard({ onOpenBuyer, onStartNew }) {
  const [filter, setFilter] = React.useState('All');
  const filters = [
    { key: 'All',           test: () => true },
    { key: 'Active',        test: (b) => ['BRA Signed', 'Offer Out', 'Accepted', 'Conditions Pending'].includes(b.status) },
    { key: 'Showing-only',  test: (b) => b.status === 'Showings Only' },
    { key: 'Pending Deals', test: (b) => ['Offer Out', 'Accepted', 'Pending Possession'].includes(b.status) },
    { key: 'Closed',        test: (b) => b.status === 'Closed' },
  ];
  const counts = Object.fromEntries(filters.map((f) => [f.key, BUYERS.filter(f.test).length]));
  const visible = BUYERS.filter(filters.find((f) => f.key === filter).test);

  return (
    <Phone>
      <TopBar
        title="Buyer Files"
        sub={`${BUYERS.length} buyers · ${BUYERS.filter((b) => b.status !== 'Closed' && b.status !== 'Showings Only').length} active deals`}
        trailing={
          <button style={{
            width: 38, height: 38, borderRadius: 19, border: `1px solid ${T.border2}`,
            background: T.surface, color: T.text, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3" strokeLinecap="round"/></svg>
          </button>
        }
      />

      {/* Primary CTA */}
      <div style={{ padding: '18px 18px 6px' }}>
        <Btn full size="lg" onClick={onStartNew} leading={
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 3v12 M3 9h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
        }>
          Start New Paperwork
        </Btn>
      </div>

      {/* Filter chips — horizontally scrollable */}
      <div style={{
        display: 'flex', gap: 8, padding: '14px 18px 8px',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      }}>
        {filters.map((f) => (
          <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)} count={counts[f.key]}>
            {f.key}
          </Chip>
        ))}
      </div>

      {/* Buyer cards */}
      <div style={{ padding: '8px 18px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.map((b) => (
          <Card key={b.id} onClick={() => onOpenBuyer(b.id)} pad={14}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 650, letterSpacing: -0.3, color: T.text }}>
                  {b.preferred} {b.last}
                </div>
                {b.activeAddress ? (
                  <div style={{ fontSize: 13, color: T.textDim, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ flexShrink: 0 }}>
                      <path d="M5.5 1C3 1 1 3 1 5.5C1 9 5.5 12 5.5 12C5.5 12 10 9 10 5.5C10 3 8 1 5.5 1Z"/><circle cx="5.5" cy="5.5" r="1.5"/>
                    </svg>
                    {b.activeAddress}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: T.textMute, marginTop: 2, fontStyle: 'italic' }}>
                    {b.activity}
                  </div>
                )}
              </div>
              <StatusBadge status={b.status} size="sm"/>
            </div>
            <div style={{
              marginTop: 12, paddingTop: 12,
              borderTop: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <DocStrip docs={b.docs}/>
              <span style={{ fontSize: 11, color: T.textMute, fontFamily: T.mono, letterSpacing: 0.3 }}>
                {b.agreementNumber}
              </span>
            </div>
          </Card>
        ))}
        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: T.textMute, fontSize: 14 }}>
            No buyers match this filter.
          </div>
        )}
      </div>
    </Phone>
  );
}

Object.assign(window, { Dashboard });
