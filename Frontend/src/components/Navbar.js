import React from 'react';
import logo from "../assests/logo.png";

const Navbar = ({ setActiveSection }) => {
  return (
    <nav className="w-full h-full bg-whatsapp-dark text-white shadow-lg flex flex-col items-center py-6">
      {/* Logo Section */}
      <div className="flex items-center mb-8">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
        <h1 className="ml-3 text-2xl font-bold text-white">Khet Mitra</h1>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col space-y-6 w-full">
        {[
          { label: 'Chatbot', id: 'chatbot' },
          { label: 'Govt Schemes', id: 'govt-schemes' },
          { label: 'Crop Rates', id: 'crop-rates' },
          { label: 'Weather', id: 'weather' },
          // { label: 'AudioPlayer', id: 'AudioPlayer' },
        ].map((item) => (
          <li key={item.id} className="w-full">
            <a
              href={`#${item.id}`}
              className="text-lg font-medium w-full block text-center py-3 bg-whatsapp-green hover:bg-whatsapp-hover text-white rounded-lg transition duration-300"
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
