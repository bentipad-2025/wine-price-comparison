import React, { useState, useEffect } from 'react';
import { Search, Wine, Heart, MapPin, Globe, Store } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [retailerType, setRetailerType] = useState('all');
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch wines from our API
  const searchWines = async (term) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/wines/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error fetching wines');
      setWines(data);
    } catch (err) {
      setError('Unable to fetch wine data. Please try again later.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchWines(searchTerm);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Wine className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Australian Wine Price Comparison</h1>
        </div>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for any wine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Searching...' : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">All States</option>
            <option value="nsw">New South Wales</option>
            <option value="vic">Victoria</option>
            <option value="qld">Queensland</option>
            <option value="wa">Western Australia</option>
            <option value="sa">South Australia</option>
            <option value="tas">Tasmania</option>
            <option value="act">ACT</option>
            <option value="nt">Northern Territory</option>
          </select>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for wines...</p>
        </div>
      )}

      {!loading && wines.length === 0 && searchTerm && !error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-lg">
          No wines found. Try adjusting your search terms.
        </div>
      )}

      {wines.map(wine => (
        <div key={wine.id} className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{wine.name}</h3>
            {wine.rating && (
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{wine.rating} rating</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {wine.retailers
              .filter(retailer => 
                selectedState === 'all' || retailer.state === selectedState
              )
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
