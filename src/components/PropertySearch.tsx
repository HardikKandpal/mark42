import React, { useState } from 'react';
import { propertyApi } from '../api/propertyApi';

interface SearchFilters {
  location: string;
  min_price: number;
  max_price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  total_area: number | null;
  has_balcony: boolean | undefined;  // Changed from boolean | null to boolean | undefined
  sort_by?: string;
  sort_order?: string;
}

interface Property {
  id: number;
  title: string;
  location: string;
  price: string | number;
  total_area: number;
  baths: number;
  bedrooms: number;
  has_balcony: boolean;
}

export function PropertySearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    min_price: 0,
    max_price: 999999999,
    bedrooms: null,
    bathrooms: null,
    total_area: null,
    has_balcony: Boolean(false),
    sort_by: 'price',
    sort_order: 'asc'
  });

  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'bedrooms' || name === 'bathrooms' || name === 'total_area') {
      setFilters(prev => ({ 
        ...prev, 
        [name]: value === '' ? null : Number(value) 
      }));
    } else if (name === 'min_price' || name === 'max_price') {
      setFilters(prev => ({ 
        ...prev, 
        [name]: value === '' ? (name === 'min_price' ? 0 : 999999999) : Number(value) 
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      // Transform filters to match SearchParams type
      const searchParams = {
        location: filters.location,
        min_price: filters.min_price,
        max_price: filters.max_price,
        beds: filters.bedrooms ?? undefined,
        baths: filters.bathrooms ?? undefined,
        total_area: filters.total_area ?? undefined,
        has_balcony: filters.has_balcony,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order
      };
      
      const data = await propertyApi.search(searchParams);
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Error searching properties:', err);
      setError('Failed to search properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Search Properties</h2>
      
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="City, neighborhood, etc."
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              name="min_price"
              value={filters.min_price === 0 ? '' : filters.min_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Minimum price"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              name="max_price"
              value={filters.max_price === 999999999 ? '' : filters.max_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Maximum price"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Bedrooms</label>
            <select
              name="bedrooms"
              value={filters.bedrooms === null ? '' : filters.bedrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Bathrooms</label>
            <select
              name="bathrooms"
              value={filters.bathrooms === null ? '' : filters.bathrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Min Area (sq ft)</label>
            <input
              type="number"
              name="total_area"
              value={filters.total_area === null ? '' : filters.total_area}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Minimum area"
            />
          </div>
          
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="has_balcony"
              name="has_balcony"
              checked={filters.has_balcony === true}
              onChange={(e) => setFilters(prev => ({ ...prev, has_balcony: e.target.checked ? true : undefined }))}
              className="mr-2"
            />
            <label htmlFor="has_balcony">Has Balcony</label>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search Properties
        </button>
      </form>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Searching properties...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {searchPerformed && !loading && !error && searchResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No properties found matching your criteria.</p>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Search Results ({searchResults.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold">₹{typeof property.price === 'number' ? property.price.toLocaleString() : property.price}</span>
                    <span className="text-gray-500">{property.total_area} sq ft</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex justify-between">
                    <span>{property.bedrooms} Bedrooms</span>
                    <span>{property.baths} Bathrooms</span>
                  </div>
                  {property.has_balcony && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ Balcony
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}