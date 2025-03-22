import { Search, BarChart2, Sparkles, PieChart } from 'lucide-react';

export function Features() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Smart Property Solutions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our AI-powered platform provides cutting-edge tools for property search and valuation.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'AI-Powered Search',
    description: 'Advanced machine learning algorithms to find your perfect property match.',
    icon: Search,
  },
  {
    name: 'Accurate Valuations',
    description: 'Get precise property valuations using our sophisticated ML models.',
    icon: BarChart2,
  },
  {
    name: 'Smart Recommendations',
    description: 'Personalized property recommendations based on your preferences.',
    icon: Sparkles,
  },
  {
    name: 'Market Insights',
    description: 'Real-time market analysis and property trends in your area.',
    icon: PieChart,
  },
];