// import React, { useState } from 'react';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   const handleSend = () => {
//     if (input.trim()) {
//       setMessages([...messages, { text: input, type: 'user' }]);
//       setInput('');
      
//       // Get the bot's response
//       const response = getAnswer(input);
      
//       // Simulate a bot response
//       setTimeout(() => {
//         setMessages([...messages, { text: input, type: 'user' }, { text: response, type: 'bot' }]);
//       }, 1000);
//     }
//   };

//   // JavaScript logic function
//   const getAnswer = (userInput, threshold = 0.5) => {
//     const contextAnswerDict = {
//       "ਧਰਤੀ ਉਪਜਾਊ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਜ਼ਰੂਰੀ ਪਦਾਰਥਾਂ ਦੀ ਕਮੀ ਕਾਰਨ ਧਰਤੀ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਘਟ ਰਹੀ ਹੈ।",
//       "ਫਲ ਬਾਗਬਾਨੀ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਫਲਾਂ ਦੀ ਬਾਗਬਾਨੀ ਵਧ ਰਹੀ ਹੈ, ਜਿਸ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਵਧੇਰੇ ਆਮਦਨੀ ਹੋ ਰਹੀ ਹੈ।",
//       "ਕਣਕ ਉਤਪਾਦਨ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਕਣਕ ਦੀ ਉਤਪਾਦਨ ਘਟ ਰਹੀ ਹੈ ਕਿਉਂਕਿ ਪਾਣੀ ਦੀ ਕਮੀ ਅਤੇ ਮੌਸਮ ਬਦਲਾਅ ਇਸ 'ਤੇ ਬੁਰਾ ਅਸਰ ਪਾ ਰਹੇ ਹਨ।",
//       "ਫਲਸ ਬਿਮਾਰੀ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਫਸਲਾਂ 'ਤੇ ਵੱਧ ਰਹੀਆਂ ਬਿਮਾਰੀਆਂ ਦੇ ਕਾਰਨ ਕਿਸਾਨਾਂ ਨੂੰ ਨੁਕਸਾਨ ਹੋ ਰਹੀ ਹੈ।",
//       "ਸਬਜ਼ੀਆਂ ਬਿਉਣ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਸਬਜ਼ੀਆਂ ਦੇ ਨਵੇਂ ਬਿਉਣਾਂ ਦੇ ਨਤੀਜੇ ਵਧੀਆ ਆ ਰਹੇ ਹਨ।",
//       "ਪਾਣੀ ਘਾਟ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਪਾਣੀ ਦੀ ਘਾਟ ਕਾਰਨ ਕਿਸਾਨਾਂ ਨੂੰ ਸਿੰਚਾਈ ਵਿੱਚ ਮੁਸ਼ਕਲਾਂ ਆ ਰਹੀਆਂ ਹਨ।",
//       "ਮੌਸਮ ਫ਼ਲਸ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਮੌਸਮ ਦੀ ਬਦਲਾਅ ਨੇ ਫਸਲਾਂ 'ਤੇ ਬੁਰਾ ਅਸਰ ਪਾਇਆ ਹੈ।",
//       "ਟੈਕਨਾਲੋਜੀ ਮਸ਼ੀਨਰੀ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਨਵੀਂ ਟੈਕਨਾਲੋਜੀ ਅਤੇ ਮਸ਼ੀਨਰੀ ਦੇ ਵਰਤੋਂ ਨਾਲ ਖੇਤੀ ਦੀ ਉਤਪਾਦਕਤਾ ਵਧ ਰਹੀ ਹੈ।",
//       "ਜਮ਼ੀਨ ਮਾਲਕੀ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਜਮ਼ੀਨ ਦੀ ਮਾਲਕੀ ਅਤੇ ਵੰਡ ਨਾਲ ਸਬੰਧਿਤ ਮਸਲੇ ਵਧ ਰਹੇ ਹਨ।",
//       "ਖਾਦ ਸਰਕਾਰੀ ਸਹਾਇਤਾ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਸਰਕਾਰੀ ਸਹਾਇਤਾ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਖਾਦ ਤੇ ਸਬਸਿਡੀ ਮਿਲ ਰਹੀ ਹੈ।",
//       "ਪੌਦਿਆਂ ਸਰਬੱਤ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਪੌਦਿਆਂ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਸਰਬੱਤ ਸਹਾਇਤਾ ਮੁਹੱਈਆ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ।",
//       "ਸੇਰ ਖੇਤੀ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਸੇਰ ਦੀ ਖੇਤੀ ਦੀ ਮਿਆਦ ਵਧ ਰਹੀ ਹੈ ਜੋ ਕਿਸਾਨਾਂ ਲਈ ਲਾਭਕਾਰੀ ਸਾਬਤ ਹੋ ਰਹੀ ਹੈ।",
//       "ਮੋਸਮੀ ਬਦਲਾਅ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਮੋਸਮੀ ਬਦਲਾਅ ਕਾਰਨ ਕਿਸਾਨਾਂ ਨੂੰ ਆਪਣੀਆਂ ਫਸਲਾਂ ਨੂੰ ਸੰਭਾਲਣ ਵਿੱਚ ਔਖਾਂਈਆਂ ਆ ਰਹੀਆਂ ਹਨ।",
//       "ਹਰਿਆਲੀ ਅਭਿਆਨ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਹਰਿਆਲੀ ਅਭਿਆਨ ਦੇ ਅੰਤਰਗਤ ਬਹੁਤ ਸਾਰੇ ਰੁੱਖ ਪੌਦੇ ਲਗਾਏ ਜਾ ਰਹੇ ਹਨ।",
//       "ਸਬਜ਼ੀਆਂ ਪਾਣੀ ਸੰਭਾਲ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਸਬਜ਼ੀਆਂ ਦੀ ਪਾਣੀ ਸੰਭਾਲ ਕਰਨ ਵਾਲੀਆਂ ਵਿਧੀਆਂ ਨੂੰ ਅਪਨਾਇਆ ਜਾ ਰਹਾ ਹੈ।",
//       "ਚਰਣ ਪਸ਼ੂ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਪਸ਼ੂਆਂ ਲਈ ਚਰਣ ਦੀ ਕਮੀ ਕਾਰਨ ਪਸ਼ੂਚਿਕਿਤਸਾ ਅਤੇ ਆਹਾਰ ਸਮੱਸਿਆਵਾਂ ਖੜੀਆਂ ਹੋ ਰਹੀਆਂ ਹਨ।",
//       "ਫਸਲਾਂ ਬੁੱਢਾ ਪਾਣੀ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਬੁੱਢੀ ਫਸਲਾਂ ਨੂੰ ਪਾਣੀ ਦੇ ਪ੍ਰਬੰਧਨ ਲਈ ਵਿਸ਼ੇਸ਼ ਧਿਆਨ ਦਿੱਤਾ ਜਾ ਰਿਹਾ ਹੈ।",
//       "ਖੇਤੀਬਾੜੀ ਪ੍ਰੋਜੈਕਟ ਸਰਕਾਰੀ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਸਰਕਾਰੀ ਖੇਤੀਬਾੜੀ ਪ੍ਰੋਜੈਕਟਾਂ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਨਵੀਂ ਖੇਤੀਬਾੜੀ ਟੈਕਨਾਲੋਜੀ ਮਿਲ ਰਹੀ ਹੈ।",
//       "ਬੀਜ ਉੱਚ ਮਿਆਰੀ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਉੱਚ ਮਿਆਰੀ ਬੀਜ ਦੇ ਲਾਗੂ ਹੋਣ ਨਾਲ ਫਸਲਾਂ ਦੀ ਉਪਜ ਵਧ ਰਹੀ ਹੈ।",
//       "ਸੁਧਾਰ ਖੇਤੀਬਾੜੀ ਤਕਨੀਕੀ ਪੰਜਾਬ": "ਪੰਜਾਬ ਵਿੱਚ ਖੇਤੀਬਾੜੀ ਸੁਧਾਰ ਅਤੇ ਤਕਨੀਕੀ ਨਵੀਨਤਾ ਨੂੰ ਪ੍ਰਸਾਰਤ ਕੀਤਾ ਜਾ ਰਹੀ ਹੈ।"
//     };

//     const userInputWords = new Set(userInput.split(/\s+/));

//     for (const [keywords, answer] of Object.entries(contextAnswerDict)) {
//       const keywordSet = new Set(keywords.split(/\s+/));
//       const matchCount = [...keywordSet].filter(keyword => userInputWords.has(keyword)).length;
      
//       if (matchCount / keywordSet.size >= threshold) {
//         return answer;
//       }
//     }
    
//     return "ਮਾਫ ਕਰਨਾ, ਮੈਨੂੰ ਤੁਹਾਡਾ ਸਵਾਲ ਸਮਝ ਨਹੀਂ ਆਇਆ।";
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
