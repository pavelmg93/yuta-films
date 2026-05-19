/* ═══════════════════════════════════════════════════════════════════════════
   ADD ITEM MODAL
═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";

import { T } from "../theme";

import { parseItem } from "../services/parsing/parseItem";

import { ImageDropZone } from "./ImageDropZone";
import { ParsedEditor } from "./ParsedEditor";

export function AddModal({ onClose, onAdd, pool }) {
  const [text, setText] = useState("");
  const [imgs, setImgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prev, setPrev] = useState(null);
  const [ep, setEp] = useState(null);

  const parse = async () => {
    setLoading(true);
    setPrev(null);

    try {
      const parsed = await parseItem({
        text,
        imgs,
      });

      setPrev(parsed);
      setEp(parsed);
    } catch (e) {
      console.error(e);

      setPrev({
        error: true,
        msg: String(e),
      });
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    if (!ep || prev?.error) return;

    const id = "X" + Date.now().toString().slice(-5);

    onAdd({
      id,
      category: ep.category || "HERO PROPS",
      item: ep.item || "New Item",
      qty: ep.qty || 1,
      photoReqd: !!ep.photoReqd,
      tags: Array.isArray(ep.tags) ? ep.tags : [],
      comment: [ep.altNames, ep.comment]
        .filter(Boolean)
        .join("\n"),
    });

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 999,
        display: "flex",
        alignItems: "flex-end",
      }}
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div
        style={{
          background: T.surf,
          borderRadius: "16px 16px 0 0",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            width: 44,
            height: 5,
            background: T.border,
            borderRadius: 3,
            margin: "12px auto 4px",
          }}
        />

        <div style={{ padding: "0 18px 24px" }}>
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: T.accent,
                letterSpacing: 1,
              }}
            >
              ADD NEW ITEM
            </span>

            <button
              onClick={onClose}
              style={{
                background: "#333",
                border: "none",
                borderRadius: 8,
                color: T.text,
                width: 38,
                height: 38,
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* TEXT INPUT */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Paste text, Thai listing, WhatsApp message, item description…"
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              color: T.text,
              padding: "10px 12px",
              fontSize: 15,
              fontFamily: "inherit",
              resize: "vertical",
              marginBottom: 10,
            }}
          />

          {/* IMAGE DROP ZONE */}
          <ImageDropZone
            imgs={imgs}
            setImgs={setImgs}
          />

          {/* PARSE BUTTON */}
          <button
            onClick={parse}
            disabled={loading || (!text && imgs.length === 0)}
            style={{
              background: loading ? "#333" : T.accent,
              border: "none",
              borderRadius: 8,
              color: T.text,
              padding: "12px",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
              marginBottom: 12,
              letterSpacing: 0.5,
            }}
          >
            {loading
              ? "⏳  PARSING WITH CLAUDE…"
              : "⚡  PARSE WITH CLAUDE"}
          </button>

          {/* PARSED EDITOR */}
          {ep && !prev?.error && (
            <ParsedEditor
              ep={ep}
              setEp={setEp}
              submit={submit}
              pool={pool}
            />
          )}

          {/* ERROR */}
          {prev?.error && (
            <div
              style={{
                background: "#1a0000",
                border: `1px solid ${T.red}`,
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                color: T.red,
              }}
            >
              Parse error — add more detail to the text field.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```
