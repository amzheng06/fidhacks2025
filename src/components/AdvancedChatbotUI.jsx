import React, { useState } from 'react';
import axios from 'axios';
import './ChatbotUI.css';
import avatarImage from '../assets/sierra2.png';


const AdvancedChatbotUI = () => {
  const [messages, setMessages] = useState([{ text: "Hi there! I'm Sierra, your friendly guide for your Summit climb. Let's get to know each other. To start, can you tell me about yourself?", sender: 'bot' }]);
  const [userInput, setUserInput] = useState('');
  const [userData, setUserData] = useState({ role: '', interests: '', strengths: [], values: [], weaknesses: [], goals: '' });
  const [currentStep, setCurrentStep] = useState('about_me');
  const [pathway, setPathway] = useState([]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { text: userInput, sender: 'user' }]);
    handleUserResponse(userInput);
    setUserInput('');
  };

  const handleUserResponse = (input) => {
    switch (currentStep) {
      case 'about_me':
        userData.role = input;
        setCurrentStep('interests');
        break;
      case 'interests':
        userData.interests = input;
        setCurrentStep('strengths');
        break;
      case 'strengths':
        userData.strengths = input.split(',').map((s) => s.trim());
        setCurrentStep('values');
        break;
      case 'values':
        userData.values = input.split(',').map((v) => v.trim());
        setCurrentStep('weaknesses');
        break;
      case 'weaknesses':
        userData.weaknesses = input.split(',').map((w) => w.trim());
        setCurrentStep('goals');
        break;
      case 'goals':
        userData.goals = input;
        sendToOpenAI();
        break;
      default:
        break;
    }
  };

  const sendToOpenAI = async () => {
  try {
    const response = await axios.post("/api/openai", userData);
    const botReply = response.data.reply;
    setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
    parsePathway(botReply);
  } catch (error) {
    setMessages((prev) => [...prev, { text: "Sorry, I couldn't connect to the AI service.", sender: 'bot' }]);
  }
};


  const generateContextualReply = () => {
    switch (currentStep) {
      case 'about_me':
        return "";
      case 'interests':
        return `Nice, looks like you're a ${userData.role}. Tell me more - what are you interested in?`;
      case 'strengths':
        return `Awesome! Since you're interested in ${userData.interests}, what strengths do you bring to the table? (List them, separated by commas)`;
      case 'values':
        return `${userData.strengths} - amazing qualities and skills to have! To complement these strengths, what are the values you hold dear? (List them, separated by commas)`;
      case 'weaknesses':
        return `${userData.values} - it's so important to be driven by these values. Thanks for sharing! On the flip side, what are the areas you'd like to improve on?`;
      case 'goals':
        return `${userData.weaknesses} - I can definitely help you improve on those! Finally, where do you want to be in 5 years?`;
      default:
        return "";
    }
  };

  const generatePlaceholderText = () => {
    switch (currentStep) {
      case 'about_me':
        return "I'm a (high school student, college student, etc.)";
      case 'interests':
        return "I'm interested in...";
      case 'strengths':
        return "My strengths are...";
      case 'values':
        return "I value...";
      case 'weaknesses':
        return "My weaknesses are...";
      case 'goals':
        return "My goal is...";
      default:
        return "Type your message here...";
    }
  };

  const parsePathway = (text) => {
    const steps = text.split(/\n?\d\./).slice(1).map(step => {
      const [title, ...subGoals] = step.split(/- |• /).map(s => s.trim()).filter(Boolean);
      return { title: title.trim(), subGoals };
    });
    setPathway(steps);
  };
  
  return (
    <div className="chat-container">
      
      <img src={avatarImage} alt="Avatar" className="avatar" />

      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            {msg.text}
          </div>
        ))}
      
        <div className="bot-message">{generateContextualReply()}</div>
      </div>
      

      {pathway.length > 0 && (
    <div className="pathway-container">
      <h3>Your 5-Step Pathway:</h3>
      {pathway.map((step, index) => (
        <div key={index} className="pathway-step">
          <div className="pathway-step-title">{index + 1}. {step.title}</div>
          <ul>
            {step.subGoals.map((subGoal, subIndex) => (
              <li key={subIndex} className="pathway-subgoal">{subGoal}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )}

      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={generatePlaceholderText()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AdvancedChatbotUI;