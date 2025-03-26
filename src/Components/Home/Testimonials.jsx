  import React from 'react';
import { Star } from 'lucide-react';
import Heading from '../Common/Heading';
import testimonials from '../../../testimonials.json';
const Testimonials = () => {


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
            {[1, 2, 3,4,5].map((id) => (
              <img 
                key={id}
                src={`https://mighty.tools/mockmind-api/content/human/${id}.jpg`}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ))}
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm border-2 border-white shadow-md">
              +500
            </div>
          </div>
          <p className="mt-4 text-gray-600">Join our growing community of users today</p>
        </div>
      </div>
    </div>
  );
};

  export default Testimonials;