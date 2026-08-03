import { useState, useEffect } from "react";
import API from "../services/api";
import ChatInput from "./ChatInput";
import Message from "./Message";

function Chat() {
  // Store all chat messages
  const [messages, setMessages] = useState([]);

  // Load chat history when the page opens
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save chat whenever messages change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  async function sendQuestion(question) {
    // Add user message
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: question,
      },
    ];

    // Show user's message immediately
    setMessages(updatedMessages);

    try {
      // Send the full conversation to the backend
      const response = await API.post("/chat", {
        messages: updatedMessages,
      });

      // AI reply
      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
      };

      // Update chat
      setMessages([...updatedMessages, aiMessage]);

    } catch (error) {
      console.error(error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "❌ Backend is not running.",
        },
      ]);
    }
  }

  function clearChat() {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  }

  return (
    <>
      <div
        style={{
          border: "1px solid gray",
          minHeight: "400px",
          padding: "20px",
          marginBottom: "20px",
          overflowY: "auto",
          borderRadius: "10px",
        }}
      >
        {messages.length === 0 ? (
          <p>Start a conversation...</p>
        ) : (
          messages.map((msg, index) => (
            <Message
              key={index}
              role={msg.role}
              text={msg.content}
            />
          ))
        )}
      </div>

      <ChatInput onSend={sendQuestion} />

      <button
        onClick={clearChat}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        🗑 Clear Chat
      </button>
    </>
  );
}

export default Chat;