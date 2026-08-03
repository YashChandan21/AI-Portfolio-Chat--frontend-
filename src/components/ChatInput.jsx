import { useState } from "react";

function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <input
        style={{
          flex: 1,
          padding: "12px",
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask anything..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />

      <button onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

export default ChatInput;