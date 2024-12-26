import React, { useState } from 'react';

const schemes = [
  { id: 1, name: 'Scheme 1', description: 'Description of Scheme 1' },
  { id: 2, name: 'Scheme 2', description: 'Description of Scheme 2' },
  // Add more schemes as needed
];

const GoveSchemes = () => {
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleSchemeClick = (scheme) => {
    setSelectedScheme(scheme);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Government Schemes</h1>
      <input
        type="text"
        placeholder="Search Schemes"
        className="mb-4 p-2 border rounded"
      />
      <ul>
        {schemes.map(scheme => (
          <li
            key={scheme.id}
            className="p-3 mb-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
            onClick={() => handleSchemeClick(scheme)}
          >
            {scheme.name}
          </li>
        ))}
      </ul>

      {selectedScheme && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">{selectedScheme.name}</h2>
            <p>{selectedScheme.description}</p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => setSelectedScheme(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoveSchemes;
