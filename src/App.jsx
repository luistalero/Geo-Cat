import React, { useEffect, useRef, useState } from "react";
import "./index.css";

const N8N_WEBHOOK = import.meta.env.VITE_TEST_N8N_WEBHOOK;

function ChatBubble({ from, text, time, typing }) {
  return (
    <div className={`message ${from}`}>
      <div>{typing ? "💭 Geo-Cat está escribiendo..." : text}</div>
      {!typing && <div className="message-time">{time}</div>}
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

  // 🔹 Scroll automático
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // 🔹 Enviar mensaje
  async function handleSend(e) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), from: "user", text, time: timeNow() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);

    // mensaje temporal de "escribiendo..."
    const typingId = Date.now() + 1;
    setMessages((m) => [
      ...m,
      { id: typingId, from: "bot", text: "", time: "", typing: true },
    ]);

    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        replaceTypingWithMessage(typingId, `Error: ${res.status}`);
        return;
      }

      const data = await res.json().catch(() => null);
      const replyText =
        data?.reply ||
        data?.answer ||
        data?.text ||
        data?.message ||
        "✨ Recibí tu mensaje, pero no encontré respuesta válida.";

      replaceTypingWithMessage(typingId, replyText);
    } catch (err) {
      replaceTypingWithMessage(typingId, `Error de red: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  // 🔹 Reemplaza el bubble "escribiendo..." con el mensaje real
  function replaceTypingWithMessage(typingId, text) {
    setMessages((m) =>
      m.map((msg) =>
        msg.id === typingId
          ? { id: Date.now() + 2, from: "bot", text, time: timeNow() }
          : msg
      )
    );
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
          <ChatBubble
            key={m.id}
            from={m.from}
            text={m.text}
            time={m.time}
            typing={m.typing}
          />
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

// 🔹 Hora actual
function timeNow() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
