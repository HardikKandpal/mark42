import { propertyApi } from '../api/propertyApi';

interface PropertyData {
    location: string;
    total_area: number;
    bedrooms: number;
    bathrooms: number;
    property_type: string;
    amenities: string[];
}

interface ValuationResult {
    estimated_price: number;
    confidence_score: number;
    price_range: {
        min: number;
        max: number;
    };
    similar_properties?: Property[];
}

interface RecommendationFilters {
    location: string;
    propertyType: string;
    price: number;
    bedrooms: number;
    useEmbeddings?: boolean;
    useFaiss?: boolean;
    embeddingType?: 'text' | 'location' | 'combined';
}

interface RecommendationResponse {
    properties: Property[];
    metadata?: {
        total_count: number;
        similarity_scores?: number[];
        vector_search_used?: boolean;
    };
}

interface Property {
    id: number;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    total_area: number;
    property_type: string;
    similarity_score?: number;
}

// First, add the SearchParams interface
// Update SearchParams interface
interface SearchParams extends RecommendationFilters {
    similarity_threshold: number;
    include_nearby?: boolean;
    price_range_buffer?: number;
    vector_search_top_k?: number;
    vector_search?: boolean;
}

// Remove this duplicate section:
// useFaiss?: boolean;
//     useEmbeddings?: boolean;
//     embeddingType?: 'text' | 'location' | 'combined';
//     vector_search?: boolean;
// }

class PropertyService {
    async getRecommendations(filters: RecommendationFilters): Promise<Property[]> {
        try {
            // Validate filters
            if (!this.validateRecommendationFilters(filters)) {
                console.warn('Invalid filters provided:', filters);
                return [];
            }

            const enhancedFilters: SearchParams = {
                ...filters,
                useFaiss: true,
                useEmbeddings: true,
                embeddingType: 'combined',
                similarity_threshold: 0.7, // Changed from similarityThreshold
                vector_search: true
            };

            const response = await propertyApi.getRecommendations(enhancedFilters);

            // Use the type guard method
            if (!this.isValidRecommendationResponse(response)) {
                console.error('Invalid response format:', response);
                console.log('No exact matches, trying fallback...');
                
                const fallbackResponse = await propertyApi.getRecommendations({
                    ...enhancedFilters,
                    similarity_threshold: 0.5,
                    include_nearby: true,
                    price_range_buffer: 0.2,
                    vector_search_top_k: 50
                });

                // Check fallback response using the same type guard
                if (!this.isValidRecommendationResponse(fallbackResponse)) {
                    console.error('Invalid fallback response format:', fallbackResponse);
                    return [];
                }

                return this.processRecommendations(fallbackResponse.properties);
            }

            return this.processRecommendations(response.properties);
        } catch (error) {
            console.error('Error in getRecommendations:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message, error.stack);
            }
            return [];
        }
    }

    // Update type guard
    private isValidRecommendationResponse(response: unknown): response is RecommendationResponse {
        if (!response || typeof response !== 'object') return false;
        const resp = response as any;
        return (
            'properties' in resp &&
            Array.isArray(resp.properties) &&
            resp.properties.every((prop: any) =>
                typeof prop === 'object' &&
                typeof prop.id === 'number' &&
                typeof prop.title === 'string' &&
                typeof prop.location === 'string'
            )
        );
    }

    private validateRecommendationFilters(filters: RecommendationFilters): boolean {
        return !!(
            filters &&
            typeof filters.location === 'string' &&
            typeof filters.propertyType === 'string' &&
            (typeof filters.price === 'number' || filters.price === undefined) &&
            (typeof filters.bedrooms === 'number' || filters.bedrooms === undefined)
        );
    }

    private processRecommendations(properties: Property[]): Property[] {
        return properties.map(prop => ({
            ...prop,
            price: typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price,
            similarity_score: prop.similarity_score || 0
        })).sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0));
    }

    async getValuation(data: PropertyData): Promise<ValuationResult> {
        try {
            const response = await propertyApi.predictPrice(data);
            
            if (!response) {
                // Try fallback mechanism for similar properties
                const fallbackResponse = await propertyApi.getSimilarProperties({
                    ...data,
                    similarity_threshold: 0.6,
                    include_pending: true
                });

                if (!fallbackResponse) {
                    throw new Error('No properties found for valuation');
                }

                // Calculate estimated price based on similar properties
                const avgPrice = this.calculateAveragePrice(fallbackResponse.similar_properties);
                return {
                    estimated_price: avgPrice,
                    confidence_score: 0.7, // Lower confidence for fallback
                    price_range: {
                        min: avgPrice * 0.85,
                        max: avgPrice * 1.15
                    },
                    similar_properties: fallbackResponse.similar_properties
                };
            }

            return {
                estimated_price: response.estimated_price,
                confidence_score: response.confidence_score || 0.8,
                price_range: {
                    min: response.estimated_price * 0.9,
                    max: response.estimated_price * 1.1
                },
                similar_properties: response.similar_properties
            };
        } catch (error) {
            console.error('Error in property valuation:', error);
            throw new Error('Failed to get property valuation. Please try again later.');
        }
    }

    private calculateAveragePrice(properties: any[]): number {
        if (!properties || properties.length === 0) {
            return 0;
        }
        const sum = properties.reduce((acc, prop) => acc + (prop.price || 0), 0);
        return sum / properties.length;
    }

    formatPrice(price: number): string {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} L`;
        }
        return `₹${price.toLocaleString()}`;
    }

    validatePropertyData(data: PropertyData): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.location) errors.push('Location is required');
        if (!data.total_area || data.total_area <= 0) errors.push('Valid total area is required');
        if (!data.bedrooms || data.bedrooms < 0) errors.push('Valid number of bedrooms is required');
        if (!data.bathrooms || data.bathrooms < 0) errors.push('Valid number of bathrooms is required');
        if (!data.property_type) errors.push('Property type is required');

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export const propertyService = new PropertyService();