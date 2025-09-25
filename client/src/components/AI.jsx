import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

const GeminiBot = () => {
  const [messages, setMessages] = useState([
    { role: 'user', content: 'From now on, only respond to questions about saving money, budgeting, or financial tips. Ignore everything else.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    let updatedMessages = [...messages];
    if (messages.length === 0) {
      updatedMessages = [
        { role: 'user', content: 'From now on, only respond to questions about saving money, budgeting, or financial tips. Avoid all other topics.' },
        { role: 'user', content: input }
      ];
    } else {
      updatedMessages.push({ role: 'user', content: input });
    }
  
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
  
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBSSF_mTx0BT5aStfrYmoy5AEFrk0sdZPc',
        {
          contents: updatedMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      const botReply = response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I didn't get that.";
      setMessages([...updatedMessages, { role: 'model', content: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages([...updatedMessages, { role: 'model', content: 'Error contacting Gemini API.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className=" flex flex-col">
      <div className=" h-[700px] flex7-1 flex flex-col  mx-auto w-full p-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col flex-1">
          {/* Header */}
          <div className=" border-b border-gray-700 p-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">💸</span> GORA - Smart Money Chatbot
            </h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.slice(1).map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 rounded-2xl px-4 py-2 text-gray-100">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>GORA is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask for money-saving tips..."
                className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiBot;