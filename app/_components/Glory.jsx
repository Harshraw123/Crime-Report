'use client';
import React from 'react';
import { Shield, Users2, Camera, MapPin, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-8 h-8 text-sky-600" />,
    value: '24/7',
    label: 'Support & Response',
  },
  {
    icon: <Users2 className="w-8 h-8 text-sky-600" />,
    value: '100K+',
    label: 'Community Members',
  },
  {
    icon: <Camera className="w-8 h-8 text-sky-600" />,
    value: '50K+',
    label: 'Reports Submitted',
  },
  {
    icon: <MapPin className="w-8 h-8 text-sky-600" />,
    value: '500+',
    label: 'Areas Covered',
  },
];

const Glory = () => {
  return (
    <section className="py-24 relative bg-blue-200 text-sky-800 overflow-hidden animate-fade-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl shadow-xl overflow-hidden bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left Content */}
            <div className="p-8 md:p-12 lg:p-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-700">
                Make Your Community Safer
              </h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                Join thousands of citizens who are actively contributing to community safety. With SafeReport, you can report incidents, track case progress, and stay informed about your neighborhood.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-sky-100 rounded-xl p-6 transition-all hover:bg-sky-200 shadow-sm"
                  >
                    {feature.icon}
                    <div className="text-2xl font-bold text-sky-700 mt-3">
                      {feature.value}
                    </div>
                    <div className="text-sm text-sky-600">{feature.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-all flex items-center gap-2">
                  Get Started Now
                  <ArrowRight size={18} />
                </button>
                <button className="px-6 py-3 rounded-lg border border-sky-600 text-sky-600 hover:bg-sky-100 transition">
                  View Recent Reports
                </button>
              </div>
            </div>

            {/* Right side Image with Floating Effect */}
            <div className="hidden lg:flex items-center justify-center p-8">
              <img
                src="/safe-city.jpg" // Update with your image path or URL
                alt="Community Safety"
                className="max-w-md max-h-[400px] w-full rounded-2xl shadow-xl object-cover animate-float"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Glory;
