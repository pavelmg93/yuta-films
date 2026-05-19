import { T } from "../theme";
import { CATS_RAW } from "../constants";
import { TagInput } from "./TagInput";

function Field({ label, value, onChange, multi = false }) {
const baseStyle = {
width: "100%",
boxSizing: "border-box",
background: T.surf,
border: `1px solid ${T.border}`,
borderRadius: 8,
color: T.text,
padding: "9px 12px",
fontSize: 15,
fontFamily: "inherit",
};

return (
<div style={{ marginBottom: 12 }}>
<div
style={{
fontSize: 11,
color: T.dim,
letterSpacing: 1,
marginBottom: 5,
textTransform: "uppercase",
fontWeight: 700,
}}
>
{label} </div>

```
  {multi ? (
    <textarea
      value={value || ""}
      rows={3}
      onChange={e => onChange(e.target.value)}
      style={{
        ...baseStyle,
        resize: "vertical",
      }}
    />
  ) : (
    <input
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      style={baseStyle}
    />
  )}
</div>
```

);
}

export function ParsedEditor({
ep,
setEp,
prev,
pool,
onSubmit,
}) {
if (!ep || prev?.error) return null;

return (
<div
style={{
background: T.card,
border: `1px solid ${T.greenD}44`,
borderRadius: 10,
padding: 14,
marginBottom: 10,
}}
>
<div
style={{
fontSize: 11,
color: T.green,
letterSpacing: 2,
marginBottom: 12,
fontWeight: 700,
}}
>
PARSED — EDIT BEFORE ADDING </div>

```
  <Field
    label="ITEM NAME"
    value={ep.item}
    onChange={v => setEp(p => ({ ...p, item: v }))}
  />

  <Field
    label="ALT NAMES"
    value={ep.altNames}
    onChange={v => setEp(p => ({ ...p, altNames: v }))}
  />

  <Field
    label="QTY"
    value={ep.qty}
    onChange={v => setEp(p => ({ ...p, qty: v }))}
  />

  <div style={{ marginBottom: 12 }}>
    <div
      style={{
        fontSize: 11,
        color: T.dim,
        letterSpacing: 1,
        marginBottom: 5,
        textTransform: "uppercase",
        fontWeight: 700,
      }}
    >
      CATEGORY
    </div>

    <select
      value={ep.category || "HERO PROPS"}
      onChange={e =>
        setEp(p => ({
          ...p,
          category: e.target.value,
        }))
      }
      style={{
        width: "100%",
        background: T.surf,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        color: T.text,
        padding: "9px 12px",
        fontSize: 15,
        fontFamily: "inherit",
      }}
    >
      {Object.keys(CATS_RAW).map(c => (
        <option key={c}>{c}</option>
      ))}
    </select>
  </div>

  <Field
    label="NOTES / SOURCING"
    value={ep.comment}
    onChange={v => setEp(p => ({ ...p, comment: v }))}
    multi
  />

  <div style={{ marginBottom: 12 }}>
    <div
      style={{
        fontSize: 11,
        color: T.dim,
        letterSpacing: 1,
        marginBottom: 6,
        textTransform: "uppercase",
        fontWeight: 700,
      }}
    >
      TAGS
    </div>

    <TagInput
      tags={ep.tags || []}
      onChange={v =>
        setEp(p => ({
          ...p,
          tags: v,
        }))
      }
      pool={pool}
    />
  </div>

  <label
    style={{
      fontSize: 15,
      color: T.sub,
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
      cursor: "pointer",
    }}
  >
    <input
      type="checkbox"
      checked={!!ep.photoReqd}
      onChange={e =>
        setEp(p => ({
          ...p,
          photoReqd: e.target.checked,
        }))
      }
      style={{
        width: 22,
        height: 22,
        accentColor: T.amber,
      }}
    />

    Photo required
  </label>

  <button
    onClick={onSubmit}
    style={{
      background: T.greenD,
      border: "none",
      borderRadius: 8,
      color: "#000",
      padding: "12px",
      fontSize: 15,
      fontWeight: 700,
      fontFamily: "inherit",
      cursor: "pointer",
      width: "100%",
      letterSpacing: 0.5,
    }}
  >
    ✓ ADD TO TRACKER
  </button>
</div>
```

);
}
