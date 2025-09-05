import React, { useEffect, useRef, useState } from "react";
import "./index.css";

const N8N_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK;

function ChatBubble({ from, text, time }) {
  return (
    <div className={`message ${from}`}>
      <div>{text}</div>
      <div className="message-time">{time}</div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Hola 💖 Soy Geo-Cat Tu Asistente, ¿lista para resolver tus dudas?",
      time: timeNow(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), from: "user", text, time: timeNow() };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setSending(true);
    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 1,
            from: "bot",
            text: `Error: ${res.status}`,
            time: timeNow(),
          },
        ]);
      } else {
        const data = await res.json();
        const replyText =
          data?.reply ||
          data?.answer ||
          data?.text ||
          "✨ Recibí tu mensaje, pero no encontré respuesta válida.";

        setMessages((m) => [
          ...m,
          { id: Date.now() + 2, from: "bot", text: replyText, time: timeNow() },
        ]);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 3,
          from: "bot",
          text: `Error de red: ${err.message}`,
          time: timeNow(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <span>💖</span>
        <div>
          <div>Geo-Cat Chat</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Catalina & Luis💗
          </div>
        </div>
      </header>

      {/* Messages */}
      <main ref={listRef} className="chat-messages">
        {messages.map((m) => (
          <ChatBubble key={m.id} from={m.from} text={m.text} time={m.time} />
        ))}
      </main>

      {/* Input */}
      <form onSubmit={handleSend} className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit" disabled={sending}>
          {sending ? "..." : "➤"}
        </button>
      </form>
    </div>
  );
}

function timeNow() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
