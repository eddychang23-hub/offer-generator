// Shared design tokens + atoms for the Buyer Files dashboard
// Dark theme · slate/charcoal · single accent
// All components use system font stack

const T = {
  // Backgrounds
  bg:        '#0B0D10',         // app background (almost black)
  surface:   '#14171C',         // cards
  surface2:  '#1B1F26',         // raised / pressed
  surface3:  '#262B33',         // input bg
  // Text
  text:      '#E8EAEE',
  textDim:   '#9AA1AC',
  textMute:  '#6B7280',
  // Lines
  border:    'rgba(255,255,255,0.07)',
  border2:   'rgba(255,255,255,0.12)',
  // Accent — bright teal-green for primary actions (oklch ~0.78/0.16/170)
  accent:    '#37D9A8',
  accentDim: '#1F7B5F',
  accentInk: '#062019',
  // Status
  gray:      '#6B7280',
  blue:      '#5B8DEF',
  amber:     '#E0A93B',
  green:     '#37D9A8',
  purple:    '#A98BE8',
  red:       '#E66B6B',
  // Shadows
  shadow:    '0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.25)',
  // Type
  font:      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif",
  mono:      "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
};

// Frame — phone-shaped surface (no chrome — we wrap with IOSDevice when needed)
function Phone({ children, scroll = true, style }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.text,
      fontFamily: T.font,
      fontSize: 15, lineHeight: 1.4,
      WebkitFontSmoothing: 'antialiased',
      overflow: scroll ? 'auto' : 'hidden',
      position: 'relative',
      ...style,
    }}>{children}</div>
  );
}

// Top bar — sticky, with title + optional trailing
// paddingTop accounts for the iOS status bar (~50px) so the title clears
// the dynamic island and the time/battery glyphs.
function TopBar({ title, leading, trailing, sub }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5,
      background: 'rgba(11,13,16,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${T.border}`,
      padding: '60px 18px 12px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 19, fontWeight: 650, letterSpacing: -0.3, color: T.text }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 1 }}>{sub}</div>}
      </div>
      {trailing}
    </div>
  );
}

// Back chevron button
function BackBtn({ onClick, label = 'Back' }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: 'transparent', border: 'none', color: T.accent,
      fontFamily: T.font, fontSize: 15, fontWeight: 500,
      padding: '4px 0', cursor: 'pointer',
    }}>
      <svg width="9" height="15" viewBox="0 0 9 15"><path d="M7.5 1L1.5 7.5L7.5 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span>{label}</span>
    </button>
  );
}

// Pill-style status badge
// Workflow stages (in order):
//   Showings Only → BRA Signed → Offer Written → Pending → Firm → Closed
//   - Offer Written: offer sent, awaiting seller response
//   - Pending: seller accepted, conditions still in play
//   - Firm: conditions waived, awaiting possession
//   - Closed: possession completed
const STATUS_COLOR = {
  'Showings Only':  { bg: 'rgba(107,114,128,0.18)', fg: '#A8AEB8', dot: T.gray },
  'BRA Signed':     { bg: 'rgba(91,141,239,0.16)',  fg: '#9BB7F0', dot: T.blue },
  'Offer Written':  { bg: 'rgba(224,169,59,0.16)',  fg: '#E5BD6E', dot: T.amber },
  'Pending':        { bg: 'rgba(55,217,168,0.14)',  fg: '#7AE3C2', dot: T.green },
  'Firm':           { bg: 'rgba(169,139,232,0.16)', fg: '#C2ACEE', dot: T.purple },
  'Closed':         { bg: 'rgba(169,139,232,0.10)', fg: '#9F8AC2', dot: T.purple },
};
const STATUS_OPTIONS = Object.keys(STATUS_COLOR);

function StatusBadge({ status, size = 'md' }) {
  const c = STATUS_COLOR[status] || STATUS_COLOR['Showings Only'];
  const small = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: c.bg, color: c.fg,
      borderRadius: 999, padding: small ? '3px 8px' : '4px 10px',
      fontSize: small ? 11 : 12, fontWeight: 600, letterSpacing: 0.1,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: c.dot }} />
      {status}
    </span>
  );
}

// Document icon — outlined when not generated, filled when generated
function DocIcon({ kind, on = false, size = 22 }) {
  const stroke = on ? T.accent : 'rgba(255,255,255,0.32)';
  const fill   = on ? 'rgba(55,217,168,0.18)' : 'transparent';
  const paths = {
    crg:    'M5 3h10l4 4v14H5V3z M15 3v4h4',
    bra:    'M4 5h16v4H4z M4 13h16v6H4z',
    fintrac:'M12 2L3 6v6c0 5 4 9 9 10c5-1 9-5 9-10V6l-9-4z',
    rof:    'M3 7h18v10H3z M7 12h2 M11 12h6',
    ti:     'M4 4h12l4 4v12H4z M4 12h16',
    waiver: 'M4 4h16v16H4z M8 12l3 3l5-6',
    title:  'M3 9l9-6l9 6v11H3z M9 20v-6h6v6',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d={paths[kind] || paths.crg}/>
    </svg>
  );
}

const DOC_LABEL = {
  crg: 'CRG', bra: 'BRA', fintrac: 'FINTRAC', rof: 'ROF', ti: 'TI', waiver: 'Waiver', title: 'Title',
};

// Card — rounded surface
function Card({ children, style, onClick, pad = 16 }) {
  return (
    <div onClick={onClick} style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: pad,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background .12s',
      ...style,
    }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.background = T.surface2)}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.background = T.surface)}
    >
      {children}
    </div>
  );
}

// Primary button — accent fill
function Btn({ children, variant = 'primary', size = 'md', onClick, full, leading, disabled, style }) {
  const sizes = {
    sm: { h: 36, px: 14, fs: 14 },
    md: { h: 46, px: 18, fs: 15 },
    lg: { h: 52, px: 22, fs: 16 },
  };
  const s = sizes[size];
  const variants = {
    primary:   { bg: T.accent, fg: T.accentInk, border: 'transparent' },
    secondary: { bg: T.surface2, fg: T.text, border: T.border2 },
    ghost:     { bg: 'transparent', fg: T.text, border: T.border2 },
    danger:    { bg: 'rgba(230,107,107,0.12)', fg: '#F0A5A5', border: 'rgba(230,107,107,0.25)' },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height: s.h, minHeight: s.h, padding: `0 ${s.px}px`,
      width: full ? '100%' : undefined,
      background: v.bg, color: v.fg,
      border: `1px solid ${v.border}`, borderRadius: 12,
      fontFamily: T.font, fontSize: s.fs, fontWeight: 600, letterSpacing: -0.1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'transform .08s, filter .12s',
      ...style,
    }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {leading}{children}
    </button>
  );
}

// Filter chip
function Chip({ children, active, onClick, count }) {
  return (
    <button onClick={onClick} style={{
      height: 32, padding: '0 12px',
      background: active ? T.text : 'transparent',
      color: active ? T.bg : T.textDim,
      border: `1px solid ${active ? T.text : T.border2}`,
      borderRadius: 999,
      fontFamily: T.font, fontSize: 13, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'all .12s',
    }}>
      {children}
      {count !== undefined && (
        <span style={{
          fontSize: 11, fontWeight: 700,
          padding: '1px 6px', borderRadius: 999,
          background: active ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.06)',
          color: active ? T.bg : T.textMute,
        }}>{count}</span>
      )}
    </button>
  );
}

// Form input
function Input({ label, value, onChange, placeholder, type = 'text', hint, prefix, suffix, autoFocus, error, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: T.textDim, letterSpacing: 0.2, textTransform: 'uppercase' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: T.surface3,
        border: `1px solid ${error ? T.red : T.border}`,
        borderRadius: 10,
        padding: '0 12px',
        height: 44,
      }}>
        {prefix && <span style={{ color: T.textMute, fontSize: 14, marginRight: 8 }}>{prefix}</span>}
        <input type={type} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: T.text, fontFamily: T.font, fontSize: 15, height: '100%', minWidth: 0 }}/>
        {suffix && <span style={{ color: T.textMute, fontSize: 13, marginLeft: 8 }}>{suffix}</span>}
      </div>
      {hint && <div style={{ fontSize: 11.5, color: T.textMute }}>{hint}</div>}
    </div>
  );
}

// Toggle switch
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange?.(!on)} style={{
      width: 46, height: 28, borderRadius: 999,
      background: on ? T.accent : 'rgba(255,255,255,0.12)',
      border: 'none', padding: 2, cursor: 'pointer',
      transition: 'background .15s',
      position: 'relative',
    }}>
      <span style={{
        display: 'block', width: 24, height: 24, borderRadius: 12,
        background: '#fff',
        transform: `translateX(${on ? 18 : 0}px)`,
        transition: 'transform .15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}/>
    </button>
  );
}

// Checkbox
function Check({ on, onChange, label, sub }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '4px 0' }}
      onClick={(e) => { e.preventDefault(); onChange?.(!on); }}>
      <span style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: on ? T.accent : 'transparent',
        border: `1.5px solid ${on ? T.accent : T.border2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 1,
        transition: 'all .12s',
      }}>
        {on && <svg width="13" height="13" viewBox="0 0 13 13"><path d="M2 6.5l3 3l6-6.5" stroke={T.accentInk} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{label}</div>
        {sub && <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 2 }}>{sub}</div>}
      </span>
    </label>
  );
}

// Radio — pill group
function RadioGroup({ value, onChange, options }) {
  return (
    <div style={{
      display: 'flex', background: T.surface3,
      border: `1px solid ${T.border}`, borderRadius: 10,
      padding: 3, gap: 2,
    }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange?.(o.value)} style={{
          flex: 1, height: 38, border: 'none', cursor: 'pointer',
          background: value === o.value ? T.accent : 'transparent',
          color: value === o.value ? T.accentInk : T.textDim,
          borderRadius: 8, fontFamily: T.font, fontSize: 14, fontWeight: 600,
          transition: 'all .12s',
        }}>{o.label}</button>
      ))}
    </div>
  );
}

// Section header inside detail screens
function Section({ title, action, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px 8px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase' }}>{title}</div>
        {action}
      </div>
      <div style={{ padding: '0 18px' }}>{children}</div>
    </div>
  );
}

// Document strip — used on cards and detail. `compact` drops the labels and
// shrinks icons; useful in the desktop sidebar where horizontal space is tight.
// Hover tooltips still expose the doc names.
function DocStrip({ docs, compact = false }) {
  // docs: { crg: bool, bra: bool, ... }
  const order = ['crg', 'bra', 'fintrac', 'rof', 'ti', 'waiver'];
  const iconSize = compact ? 14 : 18;
  const gap = compact ? 7 : 10;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      {order.map((k) => (
        compact ? (
          <span key={k} title={DOC_LABEL[k]} style={{ display: 'inline-flex' }}>
            <DocIcon kind={k} on={!!docs[k]} size={iconSize}/>
          </span>
        ) : (
          <div key={k} title={DOC_LABEL[k]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <DocIcon kind={k} on={!!docs[k]} size={iconSize}/>
            <span style={{ fontSize: 9, fontWeight: 600, color: docs[k] ? T.accent : T.textMute, letterSpacing: 0.3 }}>{DOC_LABEL[k]}</span>
          </div>
        )
      ))}
    </div>
  );
}

// Step rail — wizard progress
function StepRail({ step, total, labels }) {
  return (
    <div style={{ padding: '12px 18px 16px', borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: 0.6, textTransform: 'uppercase' }}>Step {step} of {total}</span>
        <span style={{ fontSize: 12.5, color: T.textDim }}>{labels[step - 1]}</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < step ? T.accent : 'rgba(255,255,255,0.08)',
            transition: 'background .2s',
          }}/>
        ))}
      </div>
    </div>
  );
}

// Bottom bar — fixed action area
function BottomBar({ children }) {
  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 5,
      background: 'linear-gradient(to top, rgba(11,13,16,0.96) 70%, rgba(11,13,16,0))',
      padding: '16px 18px 22px',
      display: 'flex', gap: 10,
    }}>{children}</div>
  );
}

// FAB
function FAB({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      position: 'absolute', bottom: 24, right: 18, zIndex: 10,
      height: 52, padding: '0 22px',
      background: T.accent, color: T.accentInk,
      border: 'none', borderRadius: 26,
      fontFamily: T.font, fontSize: 15, fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: 8,
      cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(55,217,168,0.35), 0 2px 6px rgba(0,0,0,0.4)',
    }}>
      {children}
    </button>
  );
}

// Image placeholder (for ID photo etc.)
function ImgPlaceholder({ w, h, label, style }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 10, flexShrink: 0,
      background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 10px, rgba(255,255,255,0.07) 10px, rgba(255,255,255,0.07) 20px)',
      border: `1px dashed ${T.border2}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: T.textMute, fontFamily: T.mono, fontSize: 11,
      ...style,
    }}>{label}</div>
  );
}

// Display helpers — used everywhere a buyer name is rendered. Falls back
// to legal name if preferred + last are both empty (the New Buyer form
// only requires legal name + email).
function displayName(b) {
  if (!b) return "";
  const pref = (b.preferred || "").trim();
  const last = (b.last || "").trim();
  if (pref || last) return `${pref} ${last}`.trim();
  return (b.legal || "").trim() || "(unnamed)";
}

function avatarInitials(b) {
  const name = displayName(b);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return ((parts[0][0] || "") + (parts[parts.length - 1][0] || "")).toUpperCase();
  if (parts.length === 1) return (parts[0][0] || "").toUpperCase();
  return "?";
}

Object.assign(window, {
  T, Phone, TopBar, BackBtn, StatusBadge, DocIcon, DOC_LABEL, Card, Btn, Chip,
  Input, Toggle, Check, RadioGroup, Section, DocStrip, StepRail, BottomBar, FAB, ImgPlaceholder,
  displayName, avatarInitials,
});
