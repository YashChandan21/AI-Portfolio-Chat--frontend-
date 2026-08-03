function Message({ role, text }) {
  return (
    <div
      style={{
        textAlign: role === "user" ? "right" : "left",
        margin: "10px 0",
      }}
    >
      <b>{role === "user" ? "You" : "AI"}:</b>

      <div
        style={{
          display: "inline-block",
          padding: "10px",
          borderRadius: "10px",
          background: role === "user" ? "#DCF8C6" : "#F1F1F1",
          maxWidth: "80%",
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;