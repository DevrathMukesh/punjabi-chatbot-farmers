// import React, { useState, useEffect, useRef } from 'react';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const chatContainerRef = useRef(null);

//   const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/chat';

//   const handleSend = async () => {
//     if (input.trim()) {
//       const userMessage = { text: input, type: 'user' };

//       setMessages((prevMessages) => [...prevMessages, userMessage]);
//       setInput('');
//       setLoading(true);

//       try {
//         const response = await fetch(BACKEND_URL, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ query: input }),
//         });

//         const data = await response.json();
//         const botReply = data.response.trim();

//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: botReply, type: 'bot' },
//         ]);
//       } catch (error) {
//         console.error('Error fetching response from bot:', error);
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: 'Sorry, there was an error. Please try again later.', type: 'bot' },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       handleSend();
//     }
//   };

//   return (
//     <div className=" flex flex-col h-[500px] w-[1000px] bg-gradient-to-b from-blue-800 to-purple-800 border rounded-lg shadow-xl p-4  mx-auto">
//       <div
//         ref={chatContainerRef}
//         className="flex-1 overflow-y-auto p-4 bg-gray-900 rounded-lg border border-gray-700 mb-4 space-y-4"
//       >
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-3 rounded-lg transition-all duration-300 ${
//               msg.type === 'user'
//                 ? 'bg-blue-600 text-white self-end '
//                 : 'bg-gray-700 text-gray-200 self-start '
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       <div className="flex items-center mt-4 space-x-4">
//         <input
//           type="text"
//           className="flex-1 p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//         />
//         <button
//           className={`flex items-center justify-center p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 ${
//             !input.trim() && 'opacity-50 cursor-not-allowed'
//           }`}
//           onClick={handleSend}
//           disabled={!input.trim()}
//         >
//           {loading ? (
//             <div className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></div>
//           ) : (
//             'Send'
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
