import { useState } from 'react';
import { propertyApi } from '../api/propertyApi';

export function PropertyValuation() {
  const [propertyData, setPropertyData] = useState({
    location: '',
    total_area: '',
    bedrooms: '',
    bathrooms: '',
    has_balcony: false
  });
  const [valuation, setValuation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await propertyApi.getPropertyValuation(propertyData);
      setValuation(response);
    } catch (error) {
      console.error('Error getting valuation:', error);
    }
    setLoading(false);
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Property Valuation</h2>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={propertyData.location}
                onChange={(e) => setPropertyData({ ...propertyData, location: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Total Area (sq.ft)</label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={propertyData.total_area}
                onChange={(e) => setPropertyData({ ...propertyData, total_area: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Bedrooms</label>
              <select
                className="w-full border rounded p-2"
                value={propertyData.bedrooms}
                onChange={(e) => setPropertyData({ ...propertyData, bedrooms: e.target.value })}
              >
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Bathrooms</label>
              <select
                className="w-full border rounded p-2"
                value={propertyData.bathrooms}
                onChange={(e) => setPropertyData({ ...propertyData, bathrooms: e.target.value })}
              >
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="balcony"
                className="mr-2"
                checked={propertyData.has_balcony}
                onChange={(e) => setPropertyData({ ...propertyData, has_balcony: e.target.checked })}
              />
              <label htmlFor="balcony">Has Balcony</label>
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Get Valuation'}
          </button>
        </form>

        {valuation && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Estimated Valuation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600">Estimated Value</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{valuation.estimated_value.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Value Range</p>
                <p className="text-lg">
                  ₹{valuation.min_value.toLocaleString()} - ₹{valuation.max_value.toLocaleString()}
                </p>
              </div>
            </div>

            {valuation.top_features && (
              <div className="mt-6">
                <h4 className="text-xl font-semibold mb-3">Key Value Factors</h4>
                <ul className="space-y-2">
                  {valuation.top_features.map((feature: any, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1/2">{feature.feature}</span>
                      <div className="w-1/2 h-4 bg-gray-200 rounded">
                        <div
                          className="h-full bg-blue-600 rounded"
                          style={{ width: `${feature.importance * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
