import ReactMarkdown from "react-markdown";

function Message({ role, text }) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        margin: "14px 0",
      }}
    >
      <div style={{ maxWidth: "82%" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: isUser ? "#6366f1" : "#0d9488",
            marginBottom: "6px",
            paddingLeft: isUser ? "0" : "4px",
            paddingRight: isUser ? "4px" : "0",
            textAlign: isUser ? "right" : "left",
            display: "flex",
            alignItems: "center",
            justifyContent: isUser ? "flex-end" : "flex-start",
            gap: "6px",
          }}
        >
          {!isUser && (
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
              }}
            />
          )}
          {isUser ? "You" : "Yash's Agent"}
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "13px 17px",
            borderRadius: isUser ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
            background: isUser ? "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)" : "#ffffff",
            color: isUser ? "#ffffff" : "#1e293b",
            border: isUser ? "none" : "1px solid rgba(226, 232, 240, 0.9)",
            boxShadow: isUser
              ? "0 4px 14px rgba(67, 56, 202, 0.25)"
              : "0 4px 14px rgba(15, 23, 42, 0.04)",
            lineHeight: 1.6,
            fontSize: "14.5px",
          }}
        >
          {isUser ? (
            <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>
          ) : (
            <div style={{ fontSize: "14.5px" }}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p style={{ margin: "0 0 8px 0", lastChild: { margin: 0 } }}>{children}</p>,
                  ul: ({ children }) => <ul style={{ margin: "4px 0 8px 18px", padding: 0 }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ margin: "4px 0 8px 18px", padding: 0 }}>{children}</ol>,
                  li: ({ children }) => <li style={{ marginBottom: "4px" }}>{children}</li>,
                  strong: ({ children }) => <strong style={{ color: "#0f172a", fontWeight: 650 }}>{children}</strong>,
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;