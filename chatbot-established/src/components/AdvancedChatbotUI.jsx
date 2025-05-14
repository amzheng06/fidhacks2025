import React, { useState } from "react";
import axios from "axios";
import "./ChatbotUI.css";
import chatBg from "../assets/chat_bg.png";
import avatarImage from '../assets/sierra2.png';

const AdvancedChatbotUI = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey - Sierra here! What can I help you with?" }
  ]);
  const [isChoosingOption, setIsChoosingOption] = useState(true);
  const [fiveYearGoal, setFiveYearGoal] = useState("");
  const [currentStep, setCurrentStep] = useState(null);

  const handleOptionClick = (option) => {
    if (option === "change-goal") {
      setMessages([...messages, { sender: "bot", text: "Of course! Your journey is as flexible as you are. Remind me of your five-year goal again?" }]);
      setCurrentStep("awaiting-goal");
      setIsChoosingOption(false);
    } else if (option === "apply-position") {
      setMessages([...messages, { sender: "bot", text: "That's amazing! First off, remind me of your five-year goal again?" }]);
      setCurrentStep("apply-goal");
      setIsChoosingOption(false);
    } else if (option === "mentor-group") {
      setMessages([...messages, { sender: "bot", text: "Awesome! I'll help you find a mentor and some groups you might be interested in." }]);
      setIsChoosingOption(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages([...messages, userMessage]);

    if (currentStep === "awaiting-goal") {
      setFiveYearGoal(userInput);
      setCurrentStep("goal-options");
      setMessages((prev) => [
        ...prev,
        userMessage,
        { sender: "bot", text: "Gotcha. Would you like to change your goal or explore your options?" }
      ]);
    } else if (currentStep === "goal-options") {
      if (userInput.toLowerCase().includes("change")) {
        setCurrentStep("update-goal");
        setMessages((prev) => [
          ...prev,
          userMessage,
          { sender: "bot", text: "Got it! I'll update your goal, and we can work together to outline a new plan." }
        ]);
      } else if (userInput.toLowerCase().includes("explore")) {
        await generateOpenAIResponse(
          `What are some goals similar to ${fiveYearGoal}, but I'd like to explore some different professional options?`
        );
      }
    } else if (currentStep === "apply-goal") {
      setFiveYearGoal(userInput);
      setCurrentStep("apply-resources");
      setMessages((prev) => [
        ...prev,
        userMessage,
        { sender: "bot", text: "Gotcha! What kind of resources were you looking for?" }
      ]);
    } else if (currentStep === "apply-resources") {
      await generateOpenAIResponse(`I'd like some resources that can help me with ${userInput}`);
    } else {
      await generateOpenAIResponse(userInput);
    }

    setUserInput("");
  };

  const generateOpenAIResponse = async (query) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: query }],
          max_tokens: 100,
          temperature: 0.7
        },
        {
          headers: {
            Authorization: `Bearer OPENAI_API_KEY
`,
            "Content-Type": "application/json"
          }
        }
      );

      const botReply = { sender: "bot", text: response.data.choices[0].message.content.trim() };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Sorry, something went wrong." }]);
    }
  };

  return (
    <div className="chat-container" style={{ backgroundImage: `url(${chatBg})` }}>
      <img src={avatarImage} alt="Avatar" className="avatar" />
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
            {msg.text}
          </div>
        ))}
      </div>

      {isChoosingOption ? (
        <div className="options-container">
          <button onClick={() => handleOptionClick("change-goal")}>I'd like to change my goal.</button>
          <button onClick={() => handleOptionClick("apply-position")}>I want preparation for applying for a position.</button>
          <button onClick={() => handleOptionClick("mentor-group")}>Connect me with a mentor or interest group!</button>
        </div>
      ) : currentStep === "goal-options" ? (
  <div className="options-container">
    <button onClick={() => {
      setUserInput("Change my goal");
      setTimeout(sendMessage, 0); // Immediately trigger the sendMessage function
    }}>Change my goal</button>

    <button onClick={() => {
      setUserInput("Explore my options");
      setTimeout(sendMessage, 0); // Immediately trigger the sendMessage function
    }}>Explore my options</button>
  </div>
) : (

        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message here..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default AdvancedChatbotUI;
