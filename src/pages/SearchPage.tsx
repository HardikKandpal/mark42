import { useState } from 'react';
import { propertyApi } from '../api/propertyApi';
import { PropertyList } from '../components/PropertyList';
import { PropertyRecommendations } from '../components/PropertyRecommendations';

type SearchFilters = {
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  has_balcony: boolean | null;
};

// Add interface for search results
interface Property {
  id: number;
  title: string;
  location: string;
  price: string; // Ensure price is consistently a string
  total_area: number;
  beds: number;
  baths: number;
  has_balcony: boolean;
}

export function SearchPage() {
  // Update the state type to Property[]
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    has_balcony: null
  });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      // Transform filters to match SearchParams type
      const apiFilters = {
        location: filters.location,
        min_price: filters.minPrice ? parseInt(filters.minPrice) : 0,
        max_price: filters.maxPrice ? parseInt(filters.maxPrice) : 999999999,
        beds: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
        baths: filters.bathrooms ? parseInt(filters.bathrooms) : undefined,
        has_balcony: filters.has_balcony ?? undefined
      };
      
      console.log("Sending search filters:", apiFilters);
      const results = await propertyApi.search(apiFilters);
      
      // Handle the search results
      if (results && results.results) {
        setSearchResults(results.results.map((property: Property) => ({
          ...property,
          price: property.price.toString() // Convert price to string
        })) as Property[]);
      } else {
        setSearchResults(Array.isArray(results) ? results.map((property: Property) => ({
          ...property,
          price: property.price.toString() // Convert price to string
        })) as Property[] : []);
      }
      
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Properties</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Location"
            className="border rounded p-2"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          
          <input
            type="number"
            placeholder="Min Price"
            className="border rounded p-2"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          
          <input
            type="number"
            placeholder="Max Price"
            className="border rounded p-2"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
          
          <select
            className="border rounded p-2"
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
          >
            <option value="">Bedrooms</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </select>
          
          <select
            className="border rounded p-2"
            value={filters.bathrooms}
            onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
          >
            <option value="">Bathrooms</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </select>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_balcony"
              className="mr-2"
              checked={filters.has_balcony === true}
              onChange={(e) => setFilters({ ...filters, has_balcony: e.target.checked ? true : null })}
            />
            <label htmlFor="has_balcony">Has Balcony</label>
          </div>
        </div>
        
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search Properties'}
        </button>
      </form>

      {/* Search Results or Recommendations */}
      {hasSearched && (
        <div>
          {searchResults.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
              <PropertyList properties={searchResults} />
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-8">
                No exact matches found. Here are some properties you might be interested in:
              </p>
              <PropertyRecommendations propertyId={1} />
            </>
          )}
        </div>
      )}

      {/* Initial Recommendations */}
      {!hasSearched && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recommended Properties</h2>
          <PropertyRecommendations propertyId={1} />
        </div>
      )}
    </div>
  );
}