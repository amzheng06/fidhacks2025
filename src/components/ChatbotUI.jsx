import React, { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your guide for your career journey. Tell me about yourself.", isBot: true },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isBot: false }]);
      setInput("");
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "That's great! What are your strengths and values?", isBot: true },
        ]);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`p-3 rounded-xl max-w-xs ${
                  msg.isBot ? "bg-gray-200 text-black" : "bg-blue-500 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center mt-4">
          <input
            className="flex-grow p-2 rounded-l-full border border-gray-300 focus:outline-none"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <Button onClick={handleSend} className="rounded-r-full">
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotUI;
