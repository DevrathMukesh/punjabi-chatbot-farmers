import React, { useState } from 'react';

const crops = [
  { id: 1, name: 'Wheat', rate: '₹2000/quintal' },
  { id: 2, name: 'Rice', rate: '₹3000/quintal' },
  // Add more crop rates as needed
];

const CropRates = () => {
  const [filter, setFilter] = useState('');

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Crop Rates</h1>
      <input
        type="text"
        placeholder="Filter by Crop"
        className="mb-4 p-2 border rounded"
        onChange={(e) => setFilter(e.target.value)}
      />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Crop Name</th>
            <th className="border p-2">Rate</th>
          </tr>
        </thead>
        <tbody>
          {filteredCrops.map(crop => (
            <tr key={crop.id}>
              <td className="border p-2">{crop.name}</td>
              <td className="border p-2">{crop.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CropRates;
