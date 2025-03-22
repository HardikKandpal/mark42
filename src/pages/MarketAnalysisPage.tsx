import React, { useState, useEffect } from 'react';
import { propertyApi } from '../api/propertyApi';

interface MarketStats {
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  popularLocations: string[];
  propertyTypes: {
    type: string;
    count: number;
  }[];
}

export function MarketAnalysisPage() {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');

  const fetchMarketStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await propertyApi.getMarketAnalysis(selectedLocation);
      setMarketStats(stats);
    } catch (err) {
      setError('Failed to fetch market analysis data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketStats();
  }, [selectedLocation]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Market Analysis</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Enter location for analysis"
          className="border p-2 rounded w-full md:w-1/2"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {marketStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Average Price</h3>
            <p className="text-2xl text-blue-600">{formatPrice(marketStats.averagePrice)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <p className="text-sm text-gray-600">Min: {formatPrice(marketStats.priceRange.min)}</p>
            <p className="text-sm text-gray-600">Max: {formatPrice(marketStats.priceRange.max)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Popular Locations</h3>
            <ul className="space-y-2">
              {marketStats.popularLocations.map((location, index) => (
                <li key={index} className="text-sm text-gray-600">{location}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Property Types Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {marketStats.propertyTypes.map((type, index) => (
                <div key={index} className="text-center">
                  <p className="font-medium">{type.type}</p>
                  <p className="text-gray-600">{type.count} properties</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}