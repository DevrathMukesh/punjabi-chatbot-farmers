// import React, { useState } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize the AI instance with your API key (use environment variable for security)
// const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// // Define a constant for additional information
// const ADDITIONAL_INFO = "This chatbot only answers questions about agriculture in India.";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [language, setLanguage] = useState('pa'); // State for language preference (en for English, pa for Punjabi)

//   const handleSend = async () => {
//     if (input.trim()) {
//       const userMessage = { text: input, type: 'user' };

//       setMessages([...messages, userMessage]);
//       setInput('');

//       try {
//         // Construct the prompt with language and additional context
//         const prompt = `
//           User message: "${input}". 
//           Additional info: "${ADDITIONAL_INFO}". 
//           Respond in ${language === 'en' ? 'English' : 'Punjabi'} with a single concise line related to agriculture in India. Avoid any markdown, emojis, and extra details. 
//         `;

//         // Get the bot's response
//         const response = await model.generateContent(prompt);
//         const botReply = response.response.text().trim();

//         // Ensure the response is a single line and sanitize
//         const singleLineReply = botReply.split('\n')[0].trim();

//         // Add bot's reply to the messages
//         setMessages([...messages, userMessage, { text: singleLineReply, type: 'bot' }]);
//       } catch (error) {
//         console.error('Error fetching response from bot:', error);
//         setMessages([...messages, userMessage, { text: 'Sorry, there was an error. Please try again later.', type: 'bot' }]);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-gray-800 border rounded-lg shadow-lg p-4">
//       <div className="flex-1 overflow-y-auto p-2 border-b border-gray-700">
//         {messages.map((msg, index) => (
//           <div key={index} className={`mb-2 p-2 rounded-lg transition-transform duration-300 ${msg.type === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-700 text-gray-200'}`}>
//             {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="flex items-center mt-2">
//         <input 
//           type="text" 
//           className="flex-1 p-2 border border-gray-700 rounded-l-lg bg-gray-900 text-gray-100" 
//           value={input} 
//           onChange={(e) => setInput(e.target.value)} 
//           placeholder="Type your message..." 
//         />
//         <select
//           className="p-2 border border-gray-700 rounded-l-lg bg-gray-900 text-gray-100 ml-2"
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//         >
//           <option value="en">English</option>
//           <option value="pa">Punjabi</option>
//         </select>
//         <button 
//           className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition-colors duration-300" 
//           onClick={handleSend}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
