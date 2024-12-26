import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Content from './components/Content';

const App = () => {
  const [activeSection, setActiveSection] = useState('chatbot');

  return (
    <div className="flex h-screen bg-gray-800 text-gray-200">
      {/* Navbar Component */}
      <nav className="w-1/6 bg-green-700 shadow-xl">
        <Navbar setActiveSection={setActiveSection} />
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-100 text-gray-900">
        <Content activeSection={activeSection} />
      </main>
    </div>
  );
};

export default App;