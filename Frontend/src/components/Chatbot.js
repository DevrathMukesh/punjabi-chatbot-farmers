import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import RecordRTC from "recordrtc";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null); // Track the recorder instance
  const [recognizedText, setRecognizedText] = useState("");
  const [language, setLanguage] = useState("en-IN"); // Language toggle state
  const [file, setFile] = useState(null); // Track the selected file for upload
  const chatContainerRef = useRef(null);


  const handleAddDocuments = async () => {
    if (!file) {
      alert("Please select a document to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data.message); // Success message
    } catch (error) {
      console.error('Error uploading document:', error.message || error);
    }
  };

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  // Auto-scroll to the latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  // Toggle Language
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en-IN" ? "pa-IN" : "en-IN"));
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        query: input,
      });

      const botMessage = {
        text: response.data.answer,
        type: "bot",
        audio_url: response.data.audio_url,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Handle text-to-speech playback
  const handleTTS = (audioUrl) => {
    if (!audioUrl) return;
    const audioSource = `http://localhost:5000${audioUrl}`;
    const audio = new Audio(audioSource);
    audio.play().catch((err) => console.error("Audio playback error:", err));
  };

  // Handle 'Enter' key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && input.trim()) {
      handleSend();
    }
  };

  // Handle Recording
  const handleRecord = async () => {
    if (isRecording) {
      // Stop Recording
      recorder.stopRecording(async () => {
        const audioBlob = recorder.getBlob();
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");
        formData.append("language", language); // Send selected language

        try {
          const response = await axios.post(
            "http://localhost:5000/speech-to-text",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          setRecognizedText(response.data.recognized_text || "No text recognized");
          setInput(response.data.recognized_text || ""); // Autofill recognized text into input
        } catch (error) {
          console.error("Error sending audio:", error.message || error);
        }
      });
      setIsRecording(false);
    } else {
      // Start Recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newRecorder = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1,
        });

        newRecorder.startRecording();
        setRecorder(newRecorder);
        setIsRecording(true);
      } catch (error) {
        console.error("Recording error:", error.message || error);
      }
    }
  };

  return (
    <div className="flex flex-col h-[610px] bg-gray-900 overflow-hidden rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-white">Chatbot</h1>
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Language: {language === "en-IN" ? "🇬🇧 English" : "🇮🇳 Punjabi"}
        </button>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-100"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"
              } mb-2`}
          >
            <div
              className={`p-3 rounded-lg max-w-[75%] ${msg.type === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
                }`}
            >
              {msg.text}
            </div>
            {msg.audio_url && (
              <button
                onClick={() => handleTTS(msg.audio_url)}
                className="ml-2 p-2 bg-gray-600 text-white rounded-md"
              >
                🔊
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleRecord}
            className={`p-3 rounded-md ${isRecording ? "bg-red-500" : "bg-green-500"
              } text-white hover:opacity-80 transition`}
          >
            {isRecording ? "Stop 🎙️" : "Record 🎤"}
          </button>
          <button
            onClick={handleSend}
            disabled={!input || loading}
            className={`p-3 rounded-md ${loading ? "bg-gray-500" : "bg-blue-600"
              } text-white hover:bg-blue-700 transition`}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></div>
            ) : (
              "Send 🚀"
            )}
          </button>
        </div>
        {/* File Upload Section */}
        <div className="flex items-center mt-3 space-x-3">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx"
            className="p-2 rounded-md bg-gray-700 text-white"
          />
          <button
            onClick={handleAddDocuments}
            disabled={!file}
            className={`p-3 rounded-md ${!file ? "bg-gray-500" : "bg-yellow-600"} text-white hover:bg-yellow-700 transition`}
          >
            Upload Document 📄
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
