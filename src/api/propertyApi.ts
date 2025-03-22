const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SearchParams {
  location?: string;
  min_price?: number;
  max_price?: number;
  beds?: number;
  baths?: number;
  has_balcony?: boolean;
  bedrooms?: number;
}

export const propertyApi = {
  search: async (searchParams: SearchParams) => {
    try {
      const transformedParams: SearchParams = { ...searchParams };
      if ('bedrooms' in transformedParams) {
        transformedParams.beds = transformedParams.bedrooms;
        delete transformedParams.bedrooms;
      }

      const response = await fetch(`${BASE_URL}/property-search`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": window.location.origin
        },
        body: JSON.stringify({
          ...transformedParams,
          use_embeddings: true,
          similarity_threshold: 0.7,
          debug: true,
          version: "1.0"
        }),
        // Remove credentials since server doesn't support it
        mode: 'cors'
      });
      
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("Detailed error:", {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            error: errorData,
            params: transformedParams
          });
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API connection error:", error);
      return { results: [] };
    }
  },

  getRecommendations: async (filters: SearchParams) => {
    try {
      const response = await fetch(`${BASE_URL}/get-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(filters)
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
  
      const data = await response.json();
      return data.recommendations || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },
};

