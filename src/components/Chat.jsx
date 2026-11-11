import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import ChatInput from "./ChatInput";
import Message from "./Message";

const suggestedPrompts = [
  "Can you tell me about Yash's experience?",
  "What AI & ML projects has Yash built?",
  "What technical skills does Yash bring?",
  "Why is Yash a great fit for an AI Engineer role?",
];
const EMPTY_MESSAGES = [];

function getInitialSessions() {
  try {
    const saved = localStorage.getItem("chatSessions");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to parse saved sessions", error);
  }

  return [
    {
      id: Date.now().toString(),
      title: "New chat",
      messages: [],
    },
  ];
}

function buildTitleFromMessage(message) {
  const clean = message.trim();
  if (!clean) return "New chat";
  return clean.length > 26 ? `${clean.slice(0, 26)}...` : clean;
}

function Chat() {
  const [sessions, setSessions] = useState(getInitialSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => {
    try {
      const saved = localStorage.getItem("activeSessionId");
      if (saved && sessions.some((session) => session.id === saved)) return saved;
    } catch (error) {
      console.error("Failed to parse active session", error);
    }

    return sessions[0]?.id;
  });
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  const activeSession = sessions.find((session) => session.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || EMPTY_MESSAGES;

  useEffect(() => {
    localStorage.removeItem("portfolioResume");
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isSending, activeSessionId]);

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem("activeSessionId", activeSessionId);
    }
  }, [activeSessionId]);

  function createNewSession() {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
    const newSession = { id, title: "New chat", messages: [] };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
  }

  function mergeSessionMessages(nextMessages, role = "user") {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== activeSessionId) return session;

        const title =
          session.messages.length === 0 && nextMessages.length > 0 && role === "user"
            ? buildTitleFromMessage(nextMessages[0].content)
            : session.title;

        return {
          ...session,
          title,
          messages: nextMessages,
        };
      })
    );
  }

  async function sendQuestion(question) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isSending) return;

    const userMessage = { role: "user", content: trimmedQuestion };
    const currentMessages = [...messages, userMessage];

    mergeSessionMessages(currentMessages, "user");
    setIsSending(true);

    try {
      const response = await API.post("/chat", {
        messages: currentMessages,
      });

      const aiMessage = {
        role: "assistant",
        content: response?.data?.answer || "I couldn't generate a response.",
      };

      mergeSessionMessages([...currentMessages, aiMessage], "assistant");
    } catch (error) {
      console.error("Chat request failed:", error);
      mergeSessionMessages([
        ...currentMessages,
        {
          role: "assistant",
          content:
            error?.response?.data?.detail ||
            "I’m having trouble reaching the backend right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function clearChat() {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId ? { ...session, title: "New chat", messages: [] } : session
      )
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "rgba(17, 24, 39, 0.82)",
        border: "none",
        borderRadius: "0px",
        overflow: "hidden",
        display: "flex",
        boxShadow: "none",
      }}
    >
      <aside
        style={{
          width: "300px",
          background: "rgba(15, 23, 42, 0.9)",
          borderRight: "1px solid rgba(148, 163, 184, 0.12)",
          padding: "18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <button
          onClick={createNewSession}
          style={{
            border: "1px solid rgba(148, 163, 184, 0.25)",
            background: "rgba(255,255,255,0.04)",
            color: "#e5e7eb",
            borderRadius: "14px",
            padding: "12px 14px",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          + New chat
        </button>

        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#94a3b8",
            padding: "0 8px",
            marginTop: "8px",
          }}
        >
          Recent chats
        </div>

        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;

            return (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                style={{
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 12px",
                  textAlign: "left",
                  background: isActive ? "rgba(96, 165, 250, 0.15)" : "transparent",
                  color: isActive ? "#f8fafc" : "#cbd5e1",
                  cursor: "pointer",
                  borderLeft: isActive ? "2px solid #60a5fa" : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {session.title || "New chat"}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                  {session.messages.length} messages
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "rgba(248, 250, 252, 0.96)",
          color: "#0f172a",
        }}
      >
        <div
          style={{
            padding: "18px 22px 10px",
            borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
            background: "rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b" }}>
              Yash Chandan • AI Representative
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, marginTop: "4px" }}>
              {activeSession?.title || "Chat on behalf of Yash"}
            </div>
          </div>

          <button
            onClick={clearChat}
            style={{
              border: "1px solid rgba(148, 163, 184, 0.3)",
              background: "rgba(255,255,255,0.7)",
              color: "#334155",
              borderRadius: "999px",
              padding: "9px 14px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Clear chat
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 20px 10px",
            background: "linear-gradient(180deg, rgba(248,250,252,0.85) 0%, rgba(241,245,249,0.95) 100%)",
          }}
        >
          {messages.length === 0 ? (
            <div style={{ padding: "30px 10px" }}>
              <div style={{ fontSize: "14px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", marginBottom: "18px" }}>
                Start with a question
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendQuestion(prompt)}
                    disabled={isSending}
                    style={{
                      border: "1px solid rgba(99, 102, 241, 0.14)",
                      background: "rgba(99, 102, 241, 0.06)",
                      color: "#312e81",
                      borderRadius: "999px",
                      padding: "10px 14px",
                      cursor: isSending ? "not-allowed" : "pointer",
                      fontSize: "13px",
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <Message key={`${msg.role}-${index}`} role={msg.role} text={msg.content} />
            ))
          )}

          {isSending && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "12px",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#818cf8", display: "inline-block" }} />
              Thinking...
            </div>
          )}

          <div ref={scrollRef} style={{ height: "1px" }} />
        </div>

        <div style={{ padding: "14px 18px 18px", background: "rgba(255,255,255,0.5)" }}>
          <ChatInput onSend={sendQuestion} disabled={isSending} />
        </div>
      </main>
    </div>
  );
}

export default Chat;