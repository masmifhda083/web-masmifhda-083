// FILE: tina/ui/CompactColorField.tsx
import React from "react";

type Props = {
  input: {
    value: string | string[] | undefined;
    onChange: (v: any) => void;
  };
  field: {
    label?: string;
  };
};

export default function CompactColorField({ input, field }: Props) {
  // Tina sometimes passes value as array (for list fields). Normalize it.
  const raw = input.value as string | string[] | undefined;
  const value = Array.isArray(raw) ? (raw.length ? raw[0] : "") : raw ?? "";

  function setColorFromPicker(e: React.ChangeEvent<HTMLInputElement>) {
    input.onChange(e.target.value);
  }

  function setColorFromText(e: React.ChangeEvent<HTMLInputElement>) {
    input.onChange(e.target.value);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
      <label style={{ minWidth: 140, fontSize: 14, color: "#111" }}>{field.label}</label>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={setColorFromPicker}
          aria-label={field.label}
          style={{
            width: 28,
            height: 28,
            padding: 0,
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 6,
            background: value || "#ffffff",
            cursor: "pointer",
          }}
        />

        <input
          type="text"
          value={value}
          onChange={setColorFromText}
          placeholder="#ffffff"
          style={{
            width: 92,
            padding: "6px 8px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            fontFamily: "monospace",
            fontSize: 13,
          }}
        />
      </div>
    </div>
  );
}
