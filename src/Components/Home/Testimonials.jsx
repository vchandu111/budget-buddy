import React from 'react';
import { Star } from 'lucide-react';
import Heading from '../Common/Heading';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Richard James",
      role: "Small Business Owner",
      quote: "BudgetBuddy has transformed how I manage my business finances. The intuitive interface and powerful tracking tools have saved me countless hours.",
      rating: 5,
      image: "https://mighty.tools/mockmind-api/content/human/65.jpg"
    },
    {
      id: 2,
      name: "Sarah White",
      role: "Freelance Consultant",
      quote: "As a professional, I need reliable financial tools. BudgetBuddy delivers with its comprehensive reporting and budget management features.",
      rating: 5,
      image: "https://mighty.tools/mockmind-api/content/human/44.jpg"
    },
    {
      id: 3,
      name: "Emma Brown",
      role: "Entrepreneur",
      quote: "The receipt scanner feature has been a game-changer for tracking my expenses. I highly recommend BudgetBuddy to anyone looking to improve their financial management.",
      rating: 4,
      image: "https://mighty.tools/mockmind-api/content/human/57.jpg"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Heading
          title="What Our Users Say"
          description="Hear from people who have transformed their financial management with BudgetBuddy."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-gray-50 p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-4">
            {[4, 5, 6, 7, 8].map((id) => (
              <img 
                key={id}
                src={`https://mighty.tools/mockmind-api/content/human/${id === 4 ? 5 : id === 5 ? 7 : id === 6 ? 68 : id === 7 ? 60 : 49}.jpg`}
                alt={`User ${id}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ))}
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm border-2 border-white shadow-md">
              +1K
            </div>
          </div>
          <p className="mt-4 text-gray-600">Join thousands of satisfied users today</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;