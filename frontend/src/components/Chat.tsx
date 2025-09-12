import { useState } from "react";

type Props = {
  username: string;
};

type Message = {
  sender: "me" | "bot";
  user: string;
  text: string;
};

function Chat({ username }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const myMsg: Message = { sender: "me", user: username, text: input };
    setMessages((prev) => [...prev, myMsg]);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, username }),
      });

      const data = await res.json();

      const botMsg: Message = {
        sender: "bot",
        user: "Bot 🤖",
        text:
          typeof data.reply === "string"
            ? data.reply
            : data.message || JSON.stringify(data) || "Sin respuesta",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", user: "Sistema", text: "❌ Error al enviar el mensaje" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="h-screen w-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white w-[400px] h-[600px] flex flex-col shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 text-lg font-semibold">
          💬 Chat - {username}
        </div>

        {/* Mensajes */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-100">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[75%] p-3 rounded-2xl shadow ${
                msg.sender === "me"
                  ? "bg-green-500 text-white ml-auto rounded-br-none"
                  : "bg-white text-gray-800 mr-auto rounded-bl-none"
              }`}
            >
              <p className="text-xs font-semibold mb-1">
                {msg.user}
              </p>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 flex space-x-2 border-t bg-gray-50">
          <input
            className="flex-1 border rounded-full p-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe un mensaje..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-5 rounded-full hover:bg-green-600 transition"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
