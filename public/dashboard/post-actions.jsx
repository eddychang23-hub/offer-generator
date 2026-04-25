// Screen 4 — Post-acceptance trigger screen
// Screen 5 — ID parse review (modal)
// Screen 6 — Confirmation screen

function PostAcceptance({ onBack }) {
  const [accepted, setAccepted] = React.useState(true);
  const [depositReceived, setDepositReceived] = React.useState(false);
  const [waiverOpen, setWaiverOpen] = React.useState(false);
  const [conditions, setConditions] = React.useState({ financing: true, inspection: false });

  const docs = [
    { name: 'FINTRAC Individual ID — Eddy Chang', date: '2026-04-26', kind: 'fintrac' },
    { name: 'FINTRAC Individual ID — Vanessa Huang', date: '2026-04-26', kind: 'fintrac' },
    { name: 'FINTRAC PEP Determination', date: '2026-04-26', kind: 'fintrac' },
    { name: 'Transaction Information', date: '2026-04-26', kind: 'ti' },
  ];
  if (depositReceived) docs.push({ name: 'Receipt of Funds', date: '2026-04-29', kind: 'rof' });

  return (
    <Phone>
      <TopBar
        title="5016 Kinney Li SW"
        sub="Eddy Chang & Vanessa Huang"
        leading={<BackBtn onClick={onBack}/>}
      />

      {/* Status hero */}
      <div style={{ padding: '18px 18px 8px' }}>
        <Card pad={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 20, flexShrink: 0,
              background: 'rgba(55,217,168,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 9l4 4l8-9" stroke={T.accent} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: T.textDim }}>Status</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 1 }}>Accepted · Apr 25, 2026</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}`, fontSize: 12.5 }}>
            <DealStat label="Price" value="$670,000"/>
            <DealStat label="Deposit" value="$25,000"/>
            <DealStat label="Closing" value="Jun 15"/>
          </div>
        </Card>
      </div>

      {/* Trigger actions */}
      <Section title="Trigger Actions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ActionRow
            done={accepted}
            title="Mark Accepted"
            sub="Generates FINTRAC pkg + Transaction Info"
            cta={accepted ? 'Done Apr 25' : 'Mark Accepted'}
            onClick={() => setAccepted(true)}
          />
          <ActionRow
            done={depositReceived}
            title="Mark Deposit Received"
            sub="Generates Receipt of Funds"
            cta={depositReceived ? 'Done Apr 29' : 'Mark Received'}
            onClick={() => setDepositReceived(true)}
          />
          <ActionRow
            done={false}
            title="Generate Waiver of Conditions"
            sub="Notice of Waiver / Satisfaction"
            cta="Open"
            onClick={() => setWaiverOpen(!waiverOpen)}
            warn={!waiverOpen}
          />

          {waiverOpen && (
            <Card pad={14} style={{ borderColor: 'rgba(224,169,59,0.3)', background: 'rgba(224,169,59,0.04)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Which conditions are removed?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Check on={conditions.financing}  onChange={(v) => setConditions((c) => ({ ...c, financing: v }))}  label="Financing" sub="Due May 5"/>
                <Check on={conditions.inspection} onChange={(v) => setConditions((c) => ({ ...c, inspection: v }))} label="Property inspection" sub="Due May 2"/>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Btn size="sm" variant="secondary" onClick={() => setWaiverOpen(false)} style={{ flex: 1 }}>Cancel</Btn>
                <Btn size="sm" onClick={() => setWaiverOpen(false)} style={{ flex: 1 }}>Generate Notice</Btn>
              </div>
            </Card>
          )}
        </div>
      </Section>

      {/* Generated docs */}
      <Section title={`Generated Documents · ${docs.length}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {docs.map((d, i) => (
            <Card key={i} pad={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(55,217,168,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <DocIcon kind={d.kind} on={true} size={16}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.name}</div>
                  <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 1 }}>Generated {fmtDate(d.date)}</div>
                </div>
                <button style={{
                  height: 28, padding: '0 10px', background: 'transparent',
                  border: `1px solid ${T.border2}`, color: T.text,
                  borderRadius: 14, cursor: 'pointer',
                  fontFamily: T.font, fontSize: 11.5, fontWeight: 600,
                }}>Drive</button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <div style={{ height: 30 }}/>
    </Phone>
  );
}

function DealStat({ label, value }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 650, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function ActionRow({ done, title, sub, cta, onClick, warn }) {
  return (
    <Card pad={12}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 15, flexShrink: 0,
          background: done ? 'rgba(55,217,168,0.14)' : (warn ? 'rgba(224,169,59,0.14)' : 'rgba(255,255,255,0.05)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {done ? (
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7l3 3l7-7" stroke={T.accent} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <span style={{ width: 8, height: 8, borderRadius: 4, background: warn ? T.amber : T.textMute }}/>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 1 }}>{sub}</div>
        </div>
        <button onClick={onClick} disabled={done && cta.startsWith('Done')} style={{
          height: 32, padding: '0 12px',
          background: done ? 'transparent' : T.accent,
          color: done ? T.textDim : T.accentInk,
          border: done ? `1px solid ${T.border2}` : 'none',
          borderRadius: 16, cursor: done ? 'default' : 'pointer',
          fontFamily: T.font, fontSize: 12, fontWeight: 700,
          whiteSpace: 'nowrap',
        }}>{cta}</button>
      </div>
    </Card>
  );
}

// ─── ID Parse Review ──────────────────────────────────────────
function IDReview({ onBack, onSave }) {
  const [data, setData] = React.useState({
    legal: 'Edward Wei Chang',
    dob: '1991-03-14',
    addr: '4823 109 Street NW, Edmonton, AB T6H 1C5',
    idNum: '203-948-721',
    juris: 'Alberta',
    expiry: '2028-03-14',
  });
  const set = (k, v) => setData((s) => ({ ...s, [k]: v }));

  return (
    <Phone>
      <TopBar
        title="Review Parsed ID"
        sub="Driver's Licence · Alberta"
        leading={<BackBtn onClick={onBack} label="Cancel"/>}
      />

      <div style={{ padding: '18px' }}>
        {/* Preview thumbnail */}
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 14, marginBottom: 14,
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            width: 88, height: 56, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, oklch(0.42 0.06 240), oklch(0.32 0.04 270))',
            border: `1px solid ${T.border2}`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 6, left: 6, width: 18, height: 22, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }}/>
            <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 7, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: 0.5 }}>ALBERTA</div>
            <div style={{ position: 'absolute', bottom: 6, left: 6, right: 6, height: 2, background: 'rgba(255,255,255,0.3)' }}/>
            <div style={{ position: 'absolute', bottom: 12, left: 28, right: 6, height: 1, background: 'rgba(255,255,255,0.2)' }}/>
            <div style={{ position: 'absolute', bottom: 16, left: 28, right: 14, height: 1, background: 'rgba(255,255,255,0.2)' }}/>
            <div style={{ position: 'absolute', bottom: 20, left: 28, right: 20, height: 1, background: 'rgba(255,255,255,0.2)' }}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>id_photo_front.jpg</div>
            <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 2 }}>1.4 MB · uploaded just now</div>
            <button style={{
              marginTop: 6, padding: '4px 10px', borderRadius: 12,
              background: 'transparent', border: `1px solid ${T.border2}`, color: T.text,
              fontFamily: T.font, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
            }}>Re-upload</button>
          </div>
        </div>

        {/* Privacy banner */}
        <div style={{
          background: 'rgba(224,169,59,0.08)',
          border: `1px solid rgba(224,169,59,0.25)`,
          borderRadius: 10, padding: '10px 12px', marginBottom: 18,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={T.amber} strokeWidth="1.6" style={{ flexShrink: 0, marginTop: 1 }}><path d="M8 1l6 3v4c0 4-3 6-6 7c-3-1-6-3-6-7V4l6-3z"/></svg>
          <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.45 }}>
            Photo will be deleted after save — review and edit fields below before continuing.
          </div>
        </div>

        {/* Editable fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Legal name" value={data.legal} onChange={(v) => set('legal', v)}/>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input label="Date of birth" type="date" value={data.dob} onChange={(v) => set('dob', v)} style={{ flex: 1 }}/>
            <Input label="Expiry" type="date" value={data.expiry} onChange={(v) => set('expiry', v)} style={{ flex: 1 }}/>
          </div>
          <Input label="Address" value={data.addr} onChange={(v) => set('addr', v)}/>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input label="ID number" value={data.idNum} onChange={(v) => set('idNum', v)} style={{ flex: 2 }}/>
            <Input label="Jurisdiction" value={data.juris} onChange={(v) => set('juris', v)} style={{ flex: 1 }}/>
          </div>
        </div>
      </div>

      <BottomBar>
        <Btn variant="secondary" size="md" onClick={onBack} style={{ flex: 1 }}>Re-upload</Btn>
        <Btn size="md" onClick={onSave} style={{ flex: 2 }}>Save & Continue</Btn>
      </BottomBar>
    </Phone>
  );
}

// ─── Submit Confirmation ──────────────────────────────────────
function Confirmation({ onDone }) {
  return (
    <Phone>
      <TopBar title="Submitted"/>
      <div style={{ padding: '40px 24px 24px', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36, margin: '0 auto 20px',
          background: 'rgba(55,217,168,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32"><path d="M6 16l7 7l13-15" stroke={T.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Paperwork generated</div>
        <div style={{ fontSize: 13.5, color: T.textDim, marginTop: 8, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
          3 documents created in Drive · Gmail draft ready to send to Daniel Vu at RE/MAX Elite.
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        <Card pad={14}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Generated</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Consumer Relationships Guide', 'Buyer Representation Agreement', 'Offer Contract — Residential'].map((n) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7l3 3l7-7" stroke={T.accent} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize: 13.5 }}>{n}</span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ height: 12 }}/>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <LinkRow icon="folder" label="Drive Folder" sub="EC-VH-0526 · 5016 Kinney Li SW"/>
          <LinkRow icon="mail"   label="Open Gmail Draft" sub="To: dvu@remax-elite.ca"/>
        </div>
      </div>

      <BottomBar>
        <Btn full size="md" onClick={onDone}>Done</Btn>
      </BottomBar>
    </Phone>
  );
}

function LinkRow({ icon, label, sub }) {
  const icons = {
    folder: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={T.accent} strokeWidth="1.6"><path d="M2 5a1 1 0 011-1h4l1.5 2H15a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"/></svg>,
    mail:   <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={T.accent} strokeWidth="1.6"><rect x="2" y="4" width="14" height="10" rx="1.5"/><path d="M2 5l7 5l7-5"/></svg>,
  };
  return (
    <Card pad={14} onClick={() => {}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18, flexShrink: 0,
          background: 'rgba(55,217,168,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icons[icon]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 1 }}>{sub}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={T.textDim} strokeWidth="1.6"><path d="M5 2h7v7 M12 2L4 10 M2 6v6h6"/></svg>
      </div>
    </Card>
  );
}

Object.assign(window, { PostAcceptance, IDReview, Confirmation });
