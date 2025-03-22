import { useState } from 'react';
import { propertyService } from '../services/propertyService';

export function ValuationPage() {
  const [prediction, setPrediction] = useState<{
    estimated_value: number;
    min_value: number;
    max_value: number;
    top_features?: Array<{
      feature: string;
      importance: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    neighborhood: '',
    bedrooms: 0,
    bathrooms: 0,
    total_area: 0,
    has_balcony: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert string values to numbers for the ML model
      const modelData = {
        ...formData,
        bedrooms: parseInt(formData.bedrooms.toString()),
        bathrooms: parseInt(formData.bathrooms.toString()),
        total_area: parseFloat(formData.total_area.toString())
      };
      const result = await propertyService.predictPrice(modelData);
      setPrediction(result);
    } catch (error) {
      console.error('Error predicting price:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Property Valuation</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              className="border rounded p-2"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Neighborhood"
              className="border rounded p-2"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Number of Bedrooms"
              className="border rounded p-2"
              value={formData.bedrooms || ''}
              onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
              required
              min="1"
            />
            <input
              type="number"
              placeholder="Number of Bathrooms"
              className="border rounded p-2"
              value={formData.bathrooms || ''}
              onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
              required
              min="1"
            />
            <input
              type="number"
              placeholder="Total Area (sq ft)"
              className="border rounded p-2"
              value={formData.total_area || ''}
              onChange={(e) => setFormData({ ...formData, total_area: parseFloat(e.target.value) || 0 })}
              required
              min="100"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.has_balcony}
                onChange={(e) => setFormData({ ...formData, has_balcony: e.target.checked })}
              />
              <label>Has Balcony</label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
          >
            {loading ? 'Calculating...' : 'Get Valuation'}
          </button>
        </form>

        {prediction && (
          <div className="mt-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-2xl font-bold mb-4">Estimated Property Value</h2>
            <p className="text-3xl font-bold text-blue-600">₹{prediction.estimated_value.toLocaleString()}</p>
            <p className="text-gray-600 mb-4">
              Range: ₹{prediction.min_value.toLocaleString()} - ₹{prediction.max_value.toLocaleString()}
            </p>
            {prediction.top_features && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Top Value Factors</h3>
                <ul className="list-disc pl-5">
                  {prediction.top_features.map((feature: { feature: string; importance: number }, index: number) => (
                    <li key={index} className="text-gray-600">
                      {feature.feature}: {(feature.importance * 100).toFixed(1)}% impact
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}