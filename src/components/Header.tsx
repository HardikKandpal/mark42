import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

type NavigationItem = {
  title: string;
  path: string;
  dropdownItems?: Array<{
    title: string;
    path: string;
  }>;
};

const navigationItems: NavigationItem[] = [
  { title: 'Home', path: '/' },
  { title: 'Search Properties', path: '/search' },
  {
    title: 'Tools',
    path: '#',
    dropdownItems: [
      { title: 'Property Valuation', path: '/valuation' },
      { title: 'List Your Property', path: '/list-property' },
      { title: 'Market Analysis', path: '/market-analysis' }
    ]
  },
  { title: 'Market Insights', path: '/insights' }
];

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Property Finder
          </Link>
          
          <div className="flex space-x-6">
            {navigationItems.map((item) => (
              <div key={item.title} className="relative">
                {item.dropdownItems ? (
                  <div>
                    <button
                      className="flex items-center text-gray-600 hover:text-gray-900"
                      onClick={() => setOpenDropdown(openDropdown === item.title ? null : item.title)}
                    >
                      {item.title}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {openDropdown === item.title && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.title}
                              to={dropdownItem.path}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {dropdownItem.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}