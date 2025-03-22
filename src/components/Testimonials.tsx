import { StarIcon } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Real experiences from property buyers and sellers using our platform
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-8 transform transition duration-500 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.text}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Mumbai',
    rating: 5,
    text: 'The AI-powered valuation tool helped me price my property perfectly. Sold within weeks!',
    avatar: '/assets/images/avatars/avatar-1.jpg'
  },
  {
    name: 'Rahul Patel',
    location: 'Bangalore',
    rating: 5,
    text: 'Found my dream home using their smart search. The recommendations were spot-on!',
    avatar: '/assets/images/avatars/avatar-2.jpg'
  },
  {
    name: 'Priya Sharma',
    location: 'Delhi',
    rating: 5,
    text: 'The market insights helped me make an informed decision. Excellent platform!',
    avatar: '/assets/images/avatars/avatar-3.jpg'
  }
];