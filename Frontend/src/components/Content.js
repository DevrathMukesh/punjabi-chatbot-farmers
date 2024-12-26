import React from 'react';
import Chatbot from './Chatbot';
import GoveSchemes from './GoveSchemes';
import CropRates from './CropRates';
import Weather from './Weather';
import AudioPlayer from './audio';

const Content = ({ activeSection }) => {
  const renderSection = () => {
    switch (activeSection) {
      case 'chatbot':
        return (
          <section id="chatbot" className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-whatsapp-green">Chatbot</h1>
            <Chatbot />
          </section>
        );
      case 'gove-schemes':
        return (
          <section id="gove-schemes" className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-info">Government Schemes</h1>
            <GoveSchemes />
          </section>
        );
      case 'crop-rates':
        return (
          <section id="crop-rates" className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-success">Crop Rates</h1>
            <CropRates />
          </section>
        );
        case 'AudioPlayer':
        return (
          <section id="AudioPlayer" className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-success">AudioPlayer</h1>
            <AudioPlayer />
          </section>
        );
      case 'weather':
        return (
          <section id="weather" className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-dark">Weather</h1>
            <Weather />
          </section>
        );
      default:
        return (
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-error">Error</h1>
            <p className="text-gray-medium">Section not found. Please select a valid option.</p>
          </section>
        );
    }
  };

  return (
    <div className="p-4 bg-gray-light text-gray-dark flex-1 shadow-md border border-gray-medium">
      {renderSection()}
    </div>
  );
};

export default Content;
