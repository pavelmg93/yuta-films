import { useRef } from "react";
import { T } from "../theme";

export function ImageDropZone({
imgs,
setImgs,
}) {
const fileRef = useRef();

const handleFiles = files => {
Array.from(files).forEach(file => {
const reader = new FileReader();

```
  reader.onload = e => {
    setImgs(prev => [
      ...prev,
      {
        name: file.name,
        data: e.target.result.split(",")[1],
        mime: file.type,
        src: e.target.result,
      },
    ]);
  };

  reader.readAsDataURL(file);
});
```

};

const removeImage = index => {
setImgs(prev => prev.filter((_, i) => i !== index));
};

return (
<>
<div
onClick={() => fileRef.current?.click()}
onDrop={e => {
e.preventDefault();
handleFiles(e.dataTransfer.files);
}}
onDragOver={e => e.preventDefault()}
style={{
border: `2px dashed ${T.border}`,
borderRadius: 8,
padding: "14px",
textAlign: "center",
cursor: "pointer",
marginBottom: 10,
color: T.dim,
fontSize: 14,
}}
>
{imgs.length ? (
<span
style={{
color: T.blue,
fontWeight: 600,
}}
>
✓ {imgs.length} image{imgs.length > 1 ? "s" : ""} attached </span>
) : (
"DROP SCREENSHOT or tap to browse"
)}

```
    <input
      ref={fileRef}
      type="file"
      multiple
      accept="image/*"
      style={{ display: "none" }}
      onChange={e => handleFiles(e.target.files)}
    />
  </div>

  {imgs.length > 0 && (
    <div
      style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: 12,
      }}
    >
      {imgs.map((img, i) => (
        <div
          key={i}
          style={{
            position: "relative",
          }}
        >
          <img
            src={img.src}
            alt=""
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 6,
              border: `1px solid ${T.border}`,
            }}
          />

          <button
            onClick={() => removeImage(i)}
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "#444",
              border: "none",
              borderRadius: "50%",
              width: 18,
              height: 18,
              color: T.text,
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</>
```

);
}
