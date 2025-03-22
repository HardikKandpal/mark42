import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { propertyApi } from "../api/propertyApi";
import { Bed, Bath, Square, MapPin } from "lucide-react";

type Property = {
  id: number;
  title: string;
  location: string;
  price: number | string;  // Update to handle both number and string
  total_area: number;
  bedrooms: number;
  bathrooms: number;
  images: { url: string }[];
  city: string;
  state: string;
};

export function FeaturedListings() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await propertyApi.getFeaturedProperties();
        setFeaturedProperties(data);
      } catch (err) {
        setError('Failed to load featured properties');
        console.error('Error fetching featured properties:', err);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-10">Featured Properties</h2>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : featuredProperties.length === 0 ? (
        <p className="text-gray-500 text-center">Loading featured properties...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative">
                <img
                  src={property.images[0]?.url || "/assets/images/default-property.jpg"}
                  alt={property.title}
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                <p className="text-gray-600 mb-2">
                  <MapPin className="inline mr-1" size={16} />
                  {property.location}
                </p>
                <p className="text-blue-600 text-lg font-bold">
                  ₹{typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
                </p>

                <div className="flex items-center justify-between text-gray-600 mt-4">
                  <span className="flex items-center">
                    <Bed className="mr-1" size={16} /> {property.bedrooms}
                  </span>
                  <span className="flex items-center">
                    <Bath className="mr-1" size={16} /> {property.bathrooms}
                  </span>
                  <span className="flex items-center">
                    <Square className="mr-1" size={16} /> {property.total_area} sq.ft
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
