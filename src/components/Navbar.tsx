import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Property Listing</span>
            </Link>
            <Link to="/recommendations" className="flex items-center">
              <span className="text-gray-600 hover:text-gray-900">Recommendations</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}