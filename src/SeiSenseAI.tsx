import React, { useRef, useState, useEffect } from "react";

const MCP_SERVER = "http://localhost:3004"; // Change if needed

type Message = {
  text: string;
  sender: "user" | "ai";
  timestamp: string;
};

const SUGGESTIONS = [
  "How do I check my Sei wallet balance?",
  "send 1 sei to 0x9496c5bB7397536Ae4aD729D88bA24d4c22DcF48 my address 0xFDa155D978CcC14635921e7FbD5d922D939076FD",
  "Analyze a wallet",
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const SeiSenseAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `👋 I am Sei-Sense AI! You can ask me anything about Sei blockchain: wallet balances, smart contract explanations, transaction details, recent market trends, and more. I provide instant answers, explain how things work, and can guide you through using Sei. Try the suggestions below or type your own question!`,
      sender: "ai",
      timestamp: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatMessagesRef.current?.scrollTo({ top: chatMessagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, processing]);

  useEffect(() => {
    const userMsgExists = messages.some((m) => m.sender === "user");
    setShowSuggestions(!userMsgExists && !processing);
  }, [messages, processing]);

  // Only update: show only the value of 'text' from the Gemini response
  const sendMessage = async (msgOverride?: string) => {
    const contentToSend = typeof msgOverride === "string" ? msgOverride : input.trim();
    if (!contentToSend || processing) return;
    setProcessing(true);
    setMessages((prev) => [
      ...prev,
      { text: contentToSend, sender: "user", timestamp: getTime() },
    ]);
    setInput("");
    setShowSuggestions(false);

    try {
      const res = await fetch(`${MCP_SERVER}/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: contentToSend }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { text };
      }
      setMessages((prev) => [
        ...prev,
        {
          text: data.text ?? data.summary ?? data.response ?? text ?? JSON.stringify(data),
          sender: "ai",
          timestamp: getTime(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was an error contacting the AI server.",
          sender: "ai",
          timestamp: getTime(),
        },
      ]);
    } finally {
      setProcessing(false);
    }
  };

  // UI remains unchanged
  return (
    <div style={{
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        width: "100%", maxWidth: 800, height: "90vh",
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        borderRadius: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white",
          padding: 20, textAlign: "center", position: "relative"
        }}>
          <div style={{
            position: "absolute", top: 20, right: 20,
            width: 12, height: 12, background: "#10b981", borderRadius: "50%",
            animation: "pulse 2s infinite"
          }} />
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 5 }}>Sei-Sense AI</h1>
          <p style={{ opacity: 0.9, fontSize: 14 }}>Interact with the Sei blockchain and smart contracts using AI.</p>
        </div>
        <div
          ref={chatMessagesRef}
          style={{
            flex: 1, padding: 20, overflowY: "auto", scrollBehavior: "smooth", background: "transparent"
          }}>
          {messages.map((msg, i) => (
            <div key={i}
              style={{
                marginBottom: 20,
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                animation: "messageSlideIn 0.5s ease-out forwards"
              }}>
              <div style={{
                maxWidth: "70%",
                padding: "15px 20px",
                borderRadius: 18,
                background: msg.sender === "user"
                  ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                  : "#f3f4f6",
                color: msg.sender === "user" ? "white" : "#374151",
                borderBottomRightRadius: msg.sender === "user" ? 4 : 18,
                borderBottomLeftRadius: msg.sender === "ai" ? 4 : 18,
                position: "relative"
              }}>
                {msg.text}
                <div style={{
                  fontSize: 12, color: "#9ca3af", marginTop: 5,
                  textAlign: msg.sender === "user" ? "right" : "left"
                }}>{msg.timestamp}</div>
              </div>
            </div>
          ))}
          {processing && (
            <div style={{
              display: "flex", justifyContent: "flex-start", marginBottom: 20,
              animation: "messageSlideIn 0.5s ease-out forwards"
            }}>
              <div style={{
                padding: "15px 20px",
                background: "#f3f4f6", borderRadius: 18, borderBottomLeftRadius: 4,
                maxWidth: "70%", display: "flex", alignItems: "center"
              }}>
                <TypingDots />
              </div>
            </div>
          )}
          {showSuggestions && (
            <div style={{
              textAlign: "center", color: "#6b7280", padding: "40px 20px"
            }}>
              <h2 style={{
                fontSize: 28, marginBottom: 10,
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Welcome! 👋</h2>
              <p style={{ fontSize: 16, marginBottom: 20 }}>
                I'm Sei-Sense AI. Ask me anything about wallets, contracts, transactions, or market trends on the Sei blockchain!
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {SUGGESTIONS.map((sugg) => (
                  <div
                    key={sugg}
                    style={{
                      background: "white", border: "2px solid #e5e7eb", borderRadius: 20,
                      padding: "8px 16px", cursor: "pointer", fontSize: 14,
                      transition: "all 0.3s ease"
                    }}
                    onClick={() => sendMessage(sugg)}
                  >
                    {sugg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{
          padding: 20, background: "white", borderTop: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{
              flex: 1, position: "relative", background: "#f9fafb",
              border: "2px solid #e5e7eb", borderRadius: 24,
            }}>
              <textarea
                id="messageInput"
                placeholder="Type your question here..."
                rows={1}
                value={input}
                disabled={processing}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                style={{
                  width: "100%", border: "none", outline: "none", background: "transparent",
                  padding: "12px 20px", fontSize: 16, resize: "none", maxHeight: 120, minHeight: 48, borderRadius: 24
                }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={processing || !input.trim()}
              style={{
                width: 48, height: 48, border: "none", borderRadius: "50%",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white",
                cursor: processing ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease", position: "relative", overflow: "hidden"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                style={{ opacity: processing ? 0 : 1 }}>
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
              </svg>
              {processing && <Spinner />}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.5;} }
        @keyframes messageSlideIn { to { opacity: 1; transform: translateY(0); } }
        @keyframes typingAnimation {
          0%,80%,100%{transform:scale(0.8);opacity:0.5;}
          40%{transform:scale(1);opacity:1;}
        }
        @keyframes spin { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
      `}</style>
    </div>
  );
};

const TypingDots = () => (
  <div style={{ display: "flex", gap: 4 }}>
    {[0, 0.16, 0.32].map((delay, i) => (
      <div key={i} style={{
        width: 8, height: 8, background: "#9ca3af", borderRadius: "50%",
        animation: "typingAnimation 1.4s infinite ease-in-out",
        animationDelay: `-${delay}s`
      }} />
    ))}
  </div>
);

const Spinner = () => (
  <div style={{
    width: 20, height: 20,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    position: "absolute"
  }} />
);

export default SeiSenseAI;