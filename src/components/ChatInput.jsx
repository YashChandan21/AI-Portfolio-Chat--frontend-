import { useState } from "react";

function ChatInput({ onSend, disabled = false }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;

    onSend(text);
    setText("");
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <input
        style={{
          flex: 1,
          border: "1px solid rgba(148, 163, 184, 0.35)",
          background: "rgba(255,255,255,0.8)",
          borderRadius: "16px",
          padding: "14px 16px",
          fontSize: "15px",
          outline: "none",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask anything..."
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        style={{
          border: "none",
          borderRadius: "16px",
          padding: "14px 18px",
          background: disabled || !text.trim() ? "#c7d2fe" : "linear-gradient(135deg, #111827 0%, #4f46e5 100%)",
          color: "#fff",
          cursor: disabled || !text.trim() ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: 600,
          boxShadow: "0 12px 24px rgba(79, 70, 229, 0.18)",
        }}
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;