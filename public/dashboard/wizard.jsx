// Screen 3 — Start New Paperwork (5-step wizard)

function NewPaperwork({ onCancel, onComplete, startStep = 1 }) {
  const [step, setStep] = React.useState(startStep);
  const [state, setState] = React.useState({
    buyer: null,
    buyerCount: 1,
    buyer1Method: null,    // 'upload' | 'type' | 'skip'
    buyer2Method: null,
    generateCRG: true,
    generateBRA: true,
    propertySource: 'showings',
    selectedProperty: null,
    purchasePrice: '670000',
    deposit: '25000',
    depositDate: '2026-04-29',
    closing: '2026-06-15',
    cFinancing: true, cInspection: true, cBuyersSale: false, cAdditional: false,
    cAdditionalText: '',
    titleInsurance: true, cleaning: true, walkthrough: true, dower: true,
    expiry: '2026-04-26T21:00',
  });
  const set = (k, v) => setState((s) => ({ ...s, [k]: v }));

  const labels = ['Buyer', 'Pre-offer', 'Property', 'Offer terms', 'Review'];
  const total = 5;

  return (
    <Phone>
      <TopBar
        title="New Paperwork"
        sub={labels[step - 1]}
        leading={step === 1 ? <BackBtn onClick={onCancel} label="Cancel"/> : <BackBtn onClick={() => setStep(step - 1)}/>}
      />
      <StepRail step={step} total={total} labels={labels}/>

      <div style={{ padding: '20px 18px 100px' }}>
        {step === 1 && <StepBuyer state={state} set={set}/>}
        {step === 2 && <StepPreOffer state={state} set={set}/>}
        {step === 3 && <StepProperty state={state} set={set}/>}
        {step === 4 && <StepOfferTerms state={state} set={set}/>}
        {step === 5 && <StepReview state={state}/>}
      </div>

      <BottomBar>
        {step > 1 && <Btn variant="secondary" size="md" onClick={() => setStep(step - 1)} style={{ flex: '0 0 auto', minWidth: 96 }}>Back</Btn>}
        {step < total && <Btn full size="md" onClick={() => setStep(step + 1)}>Next</Btn>}
        {step === total && <Btn full size="md" onClick={onComplete}>Submit & Generate</Btn>}
      </BottomBar>
    </Phone>
  );
}

// ─── Step 1 — Buyer lookup ────────────────────────────────────
function StepBuyer({ state, set }) {
  const [q, setQ] = React.useState('');
  const matches = q
    ? BUYERS.filter((b) =>
        `${b.preferred} ${b.last} ${b.email}`.toLowerCase().includes(q.toLowerCase()))
    : BUYERS.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        placeholder="Find buyer by name or email"
        value={q} onChange={setQ}
        prefix={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={T.textMute} strokeWidth="1.5"><circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5l3 3" strokeLinecap="round"/></svg>}
      />

      <Btn variant="secondary" size="md" full onClick={() => set('buyer', { id: 'new', preferred: 'New', last: 'Buyer' })} leading={
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2v12 M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      }>
        New Buyer
      </Btn>

      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', paddingTop: 4 }}>
        {q ? 'Results' : 'Recent'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {matches.map((b) => {
          const sel = state.buyer && state.buyer.id === b.id;
          return (
            <Card key={b.id} onClick={() => set('buyer', b)} pad={12}
              style={{
                borderColor: sel ? T.accent : T.border,
                background: sel ? 'rgba(55,217,168,0.06)' : T.surface,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={b.preferred + ' ' + b.last}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 650 }}>{b.preferred} {b.last}</div>
                  <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 2 }}>{b.email}</div>
                  <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 3 }}>{b.activity}</div>
                </div>
                {sel && (
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3l5-6" stroke={T.accentInk} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Avatar({ name }) {
  const initials = name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  // hash-pick a hue
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 19, flexShrink: 0,
      background: `oklch(0.32 0.04 ${h})`,
      color: `oklch(0.85 0.06 ${h})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
    }}>{initials}</div>
  );
}

// ─── Step 2 — Pre-offer paperwork ─────────────────────────────
function StepPreOffer({ state, set }) {
  const buyer = state.buyer || BUYERS[0];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <Label>How many buyers on this contract?</Label>
        <RadioGroup value={state.buyerCount} onChange={(v) => set('buyerCount', v)}
          options={[{ value: 1, label: '1 buyer' }, { value: 2, label: '2 buyers' }]}/>
      </div>

      <BuyerCard
        idx={1} buyer={buyer}
        method={state.buyer1Method}
        setMethod={(m) => set('buyer1Method', m)}
      />

      {state.buyerCount === 2 && (
        <BuyerCard
          idx={2}
          buyer={{ preferred: '', last: '', email: '' }}
          method={state.buyer2Method}
          setMethod={(m) => set('buyer2Method', m)}
        />
      )}

      <Card pad={14}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>
          Generate alongside offer
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <RowToggle
            on={state.generateCRG} onChange={(v) => set('generateCRG', v)}
            title="Consumer Relationships Guide"
            sub="Required at first showing or offer time"
          />
          <RowToggle
            on={state.generateBRA} onChange={(v) => set('generateBRA', v)}
            title="Buyer Representation Agreement"
            sub="Auto-numbered EC-0526 · 6-month term"
          />
        </div>
      </Card>
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 8 }}>{children}</div>;
}

function RowToggle({ on, onChange, title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle on={on} onChange={onChange}/>
    </div>
  );
}

function BuyerCard({ idx, buyer, method, setMethod }) {
  const methods = [
    { key: 'upload', label: 'Upload ID Photo', hint: 'Camera or library — auto-parses fields' },
    { key: 'type',   label: 'Type Legal Name Only', hint: 'Skip ID details for now' },
    { key: 'skip',   label: 'Already on File', hint: 'Use saved info from a prior file' },
  ];
  return (
    <Card pad={14}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 13, background: T.surface3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: T.textDim,
        }}>{idx}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 650 }}>
            {buyer.preferred && buyer.last ? `${buyer.preferred} ${buyer.last}` : 'New buyer'}
          </div>
          {buyer.email && <div style={{ fontSize: 12, color: T.textDim, marginTop: 1 }}>{buyer.email}</div>}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {methods.map((m) => {
          const sel = method === m.key;
          return (
            <button key={m.key} onClick={() => setMethod(m.key)} style={{
              all: 'unset', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 12px',
              background: sel ? 'rgba(55,217,168,0.07)' : T.surface2,
              border: `1px solid ${sel ? T.accent : T.border}`,
              borderRadius: 10,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 9, flexShrink: 0,
                border: `1.5px solid ${sel ? T.accent : T.border2}`,
                background: sel ? T.accent : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {sel && <span style={{ width: 7, height: 7, borderRadius: 4, background: T.accentInk }}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{m.label}</div>
                <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 1 }}>{m.hint}</div>
              </div>
              {m.key === 'upload' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={sel ? T.accent : T.textMute} strokeWidth="1.5"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/><circle cx="8" cy="8" r="2.5"/><path d="M5 3.5L6 1.5h4l1 2"/></svg>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Step 3 — Property selection ──────────────────────────────
function StepProperty({ state, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RadioGroup value={state.propertySource} onChange={(v) => set('propertySource', v)}
        options={[{ value: 'showings', label: 'From Showings' }, { value: 'mls', label: 'Upload MLS' }]}/>

      {state.propertySource === 'showings' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TOURS.map((tour) => (
            <Card key={tour.id} pad={14}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 650 }}>{fmtDate(tour.date)}</div>
                  <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 1 }}>{tour.buyer} · {tour.properties.length} properties</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tour.properties.map((p) => {
                  const sel = state.selectedProperty?.mls === p.mls;
                  return (
                    <button key={p.mls} onClick={() => set('selectedProperty', p)} style={{
                      all: 'unset', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px',
                      background: sel ? 'rgba(55,217,168,0.07)' : T.surface2,
                      border: `1px solid ${sel ? T.accent : T.border}`,
                      borderRadius: 10,
                    }}>
                      <ImgPlaceholder w={48} h={36} label="img" style={{ borderRadius: 6 }}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.address}</div>
                        <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 1, fontFamily: T.mono }}>
                          {p.mls} · ${p.price.toLocaleString()} · {p.beds}bd/{p.baths}ba
                        </div>
                      </div>
                      {sel && <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7l3 3l7-7" stroke={T.accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card pad={20} style={{ textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 24, margin: '0 auto 12px',
            background: T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={T.accent} strokeWidth="1.6"><path d="M10 14V4 M5 9l5-5l5 5 M3 16h14"/></svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Upload MLS PDF</div>
          <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 4, marginBottom: 14 }}>Listing details parse automatically</div>
          <Btn size="sm" variant="secondary">Choose File</Btn>
        </Card>
      )}

      {state.selectedProperty && (
        <Card pad={14}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Selected</div>
          <div style={{ fontSize: 16, fontWeight: 650 }}>{state.selectedProperty.address}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12.5, color: T.textDim }}>
            <span style={{ fontFamily: T.mono }}>{state.selectedProperty.mls}</span>
            <span>·</span>
            <span>${state.selectedProperty.price.toLocaleString()}</span>
            <span>·</span>
            <span>{state.selectedProperty.beds}bd / {state.selectedProperty.baths}ba / {state.selectedProperty.sqft.toLocaleString()} sqft</span>
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.textMute }}>
            Listed by Daniel Vu · RE/MAX Elite
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Step 4 — Offer terms ─────────────────────────────────────
function StepOfferTerms({ state, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card pad={14}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 }}>Price & Dates</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Purchase price" prefix="$" value={state.purchasePrice} onChange={(v) => set('purchasePrice', v)}/>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input label="Deposit" prefix="$" value={state.deposit} onChange={(v) => set('deposit', v)} style={{ flex: 1 }}/>
            <Input label="Deposit due" type="date" value={state.depositDate} onChange={(v) => set('depositDate', v)} style={{ flex: 1 }}/>
          </div>
          <Input label="Closing date" type="date" value={state.closing} onChange={(v) => set('closing', v)}/>
        </div>
      </Card>

      <Card pad={14}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Conditions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Check on={state.cFinancing}  onChange={(v) => set('cFinancing', v)}  label="Financing condition" sub="10 business days"/>
          <Check on={state.cInspection} onChange={(v) => set('cInspection', v)} label="Property inspection" sub="7 business days"/>
          <Check on={state.cBuyersSale} onChange={(v) => set('cBuyersSale', v)} label="Buyer's sale of existing home"/>
          <Check on={state.cAdditional} onChange={(v) => set('cAdditional', v)} label="Additional condition"/>
          {state.cAdditional && (
            <div style={{ paddingLeft: 34, paddingTop: 4 }}>
              <Input placeholder="Describe condition" value={state.cAdditionalText} onChange={(v) => set('cAdditionalText', v)}/>
            </div>
          )}
        </div>
      </Card>

      <Card pad={14}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Terms</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Check on={state.titleInsurance} onChange={(v) => set('titleInsurance', v)} label="Title insurance — buyer pays"/>
          <Check on={state.cleaning}       onChange={(v) => set('cleaning', v)}       label="Property professionally cleaned"/>
          <Check on={state.walkthrough}    onChange={(v) => set('walkthrough', v)}    label="Final walkthrough 24h before"/>
          <Check on={state.dower}          onChange={(v) => set('dower', v)}          label="Dower Act compliance"/>
        </div>
      </Card>

      <Card pad={14}>
        <Input label="Offer expiry" type="datetime-local" value={state.expiry} onChange={(v) => set('expiry', v)}/>
      </Card>
    </div>
  );
}

// ─── Step 5 — Review ──────────────────────────────────────────
function StepReview({ state }) {
  const buyer = state.buyer || BUYERS[0];
  const prop = state.selectedProperty || { address: '— select a property —', mls: '', price: 0 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <ReviewBlock title="Buyers" icon="👥">
        <div style={{ fontSize: 14, fontWeight: 600 }}>{buyer.preferred} {buyer.last}</div>
        <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 2 }}>{buyer.email}</div>
        {state.buyerCount === 2 && (
          <>
            <div style={{ height: 8 }}/>
            <div style={{ fontSize: 14, fontWeight: 600 }}>+ Co-buyer</div>
          </>
        )}
      </ReviewBlock>

      <ReviewBlock title="Pre-offer paperwork">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {state.generateCRG && <Tag>Generate CRG</Tag>}
          {state.generateBRA && <Tag>Generate BRA</Tag>}
          <Tag>Offer Contract</Tag>
        </div>
      </ReviewBlock>

      <ReviewBlock title="Property">
        <div style={{ fontSize: 14, fontWeight: 650 }}>{prop.address}</div>
        <div style={{ fontSize: 12, color: T.textDim, marginTop: 2, fontFamily: T.mono }}>{prop.mls} · ${prop.price.toLocaleString()}</div>
      </ReviewBlock>

      <ReviewBlock title="Offer">
        <ReviewRow k="Purchase price" v={`$${Number(state.purchasePrice).toLocaleString()}`}/>
        <ReviewRow k="Deposit"        v={`$${Number(state.deposit).toLocaleString()} · ${fmtDate(state.depositDate)}`}/>
        <ReviewRow k="Closing"        v={fmtDate(state.closing)}/>
        <ReviewRow k="Conditions"     v={[
          state.cFinancing && 'Financing',
          state.cInspection && 'Inspection',
          state.cBuyersSale && 'Sale of existing',
          state.cAdditional && 'Additional',
        ].filter(Boolean).join(' · ') || 'None'}/>
        <ReviewRow k="Expires"        v={state.expiry.replace('T', ' ')}/>
      </ReviewBlock>

      <div style={{
        background: 'rgba(55,217,168,0.08)',
        border: `1px solid rgba(55,217,168,0.25)`,
        borderRadius: 12, padding: 14,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={T.accent} strokeWidth="1.6" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="9" cy="9" r="7.5"/><path d="M9 5v4 M9 12v.5"/></svg>
        <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.5 }}>
          On submit: documents are generated to a Drive folder and a Gmail draft is created with the offer attached.
        </div>
      </div>
    </div>
  );
}

function ReviewBlock({ title, children }) {
  return (
    <Card pad={14}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>{title}</div>
      {children}
    </Card>
  );
}
function ReviewRow({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '4px 0', fontSize: 13 }}>
      <span style={{ color: T.textDim }}>{k}</span>
      <span style={{ color: T.text, fontWeight: 500, textAlign: 'right' }}>{v}</span>
    </div>
  );
}
function Tag({ children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: 'rgba(55,217,168,0.12)', color: T.accent,
      padding: '4px 10px', borderRadius: 999,
      fontSize: 12, fontWeight: 600,
    }}>
      <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5l2 2l5-5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      {children}
    </span>
  );
}

Object.assign(window, { NewPaperwork });
