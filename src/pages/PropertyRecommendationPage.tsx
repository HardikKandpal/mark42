import React, { useState } from 'react';
import { propertyApi } from '../api/propertyApi';

interface RecommendationFilters {
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  propertyType: string;
}

interface Property {
  id: number;
  title: string;
  location: string;
  city: string;
  neighborhood: string;
  price: string;
  price_value: number;
  total_area: number;
  baths: number;
  similarity_score?: number;
}

export function PropertyRecommendationPage() {
  const [filters, setFilters] = useState<RecommendationFilters>({
    location: '',
    minPrice: 0,
    maxPrice: 0,
    bedrooms: '',
    propertyType: ''
  });
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedLocation, setExtractedLocation] = useState<{city: string, neighborhood: string} | null>(null);

  useEffect(() => {
    if (filters.location) {
      // Extract city and neighborhood when location changes
      const parts = filters.location.split(',').map(part => part.trim());
      if (parts.length > 1) {
        setExtractedLocation({
          neighborhood: parts[0],
          city: parts[parts.length - 1]
        });
      }
    }
  }, [filters.location]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await propertyApi.getRecommendations({
        ...filters,
        use_faiss: true,
        similarity_threshold: 0.7
      });
      setRecommendations(results);
    } catch (err) {
      setError('Failed to fetch recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const value = typeof price === 'string' ? parseFloat(price) : price;
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Property Recommendations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded"
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        />
        <input
          type="number"
          placeholder="Min Price"
          className="border p-2 rounded"
          value={filters.minPrice || ''}
          onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="border p-2 rounded"
          value={filters.maxPrice || ''}
          onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
        />
        <select
          className="border p-2 rounded"
          value={filters.bedrooms}
          onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
        >
          <option value="">Select BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
        </select>
        <select
          className="border p-2 rounded"
          value={filters.propertyType}
          onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
        >
          <option value="">Property Type</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Villa">Villa</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Find Recommendations'}
        </button>
      </div>

      {extractedLocation && (
        <div className="mb-4 text-sm text-gray-600">
          Searching in: {extractedLocation.neighborhood}, {extractedLocation.city}
        </div>
      )}

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((property) => (
            <div key={property.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-2">
                {property.neighborhood && `${property.neighborhood}, `}{property.city}
              </p>
              <p className="text-blue-600 font-bold">{formatPrice(property.price_value)}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>{property.total_area} sq ft</p>
                <p>{property.baths} Bathrooms</p>
              </div>
              {property.similarity_score && (
                <div className="mt-2 text-xs text-gray-400">
                  Match Score: {(property.similarity_score * 100).toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {recommendations.length === 0 && !loading && !error && (
        <div className="text-gray-500 text-center py-8">
          No properties found. Try adjusting your filters for more results.
        </div>
      )}
    </div>
  );
}