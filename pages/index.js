import React, { useState } from 'react';
import { Search, Wine, Heart, MapPin, Globe, Store } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [retailerType, setRetailerType] = useState('all');
  
  // Australian states
  const states = [
    { value: 'all', label: 'All States' },
    { value: 'nsw', label: 'New South Wales' },
    { value: 'vic', label: 'Victoria' },
    { value: 'qld', label: 'Queensland' },
    { value: 'wa', label: 'Western Australia' },
    { value: 'sa', label: 'South Australia' },
    { value: 'tas', label: 'Tasmania' }
  ];

  // Demo wine data
  const wines = [
    {
      id: 1,
      name: "Penfolds Grange 2018",
      rating: 4.8,
      retailers: [
        { 
          name: "Dan Murphy's", 
          price: 950.00,
          type: "both",
          state: 'nsw',
          location: 'Sydney'
        },
        { 
          name: "Vintage Cellars", 
          price: 975.00,
          type: "both",
          state: 'vic',
          location: 'Melbourne'
        }
      ]
    },
    {
      id: 2,
      name: "19 Crimes Red Blend",
      rating: 3.9,
      retailers: [
        { 
          name: "BWS", 
          price: 19.99,
          type: "both",
          state: 'nsw',
          location: 'Sydney'
        }
      ]
    }
  ];

  // Filter wines based on search
  const filteredWines = wines.filter(wine => 
    wine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Wine className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Australian Wine Price Comparison</h1>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for a wine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {states.map(state => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredWines.map(wine => (
        <div key={wine.id} className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{wine.name}</h3>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{wine.rating} rating</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {wine.retailers
              .sort((a, b) => a.price - b.price)
              .map((retailer, index) => (
                <div
                  key={index}
                  className={`flex justify-between p-2 rounded ${
                    index === 0 ? 'bg-green-50' : ''
                  }`}
                >
                  <div>
                    <div className="font-medium">{retailer.name}</div>
                    <div className="text-sm text-gray-600">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {retailer.location}
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    index === 0 ? 'text-green-600' : ''
                  }`}>
                    ${retailer.price.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
