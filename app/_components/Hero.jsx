'use client';


import { ArrowRight, Camera, MapPin, FileCheck } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 bg-blue-200  ">
      <div className="container mx-auto px-4 md:px-6 h-100vh ">
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Text content */}
          <div className="flex-1 md:pr-10 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary leading-tight mb-4">
              Report Incidents. <br />
              <span className="text-primary">Enhance Safety.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              A modern approach to community safety. Report incidents in your area with photos and location data. Track resolution status in real-time.
            </p>

            <div className="flex sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
  <button className="inline-flex items-center px-5 py-3 bg-primary text-white font-medium rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 group">
    Report an Incident
    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
  </button>
</div>


            {/* Features */}
            <div className="mt-12 flex flex-wrap gap-6">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full card-shadow mr-3">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-gray-600">Photo Evidence</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full card-shadow mr-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-gray-600">Precise Location</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full card-shadow mr-3">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-gray-600">Status Updates</span>
              </div>
            </div>
          </div>

          {/* Image & Info Cards */}
          <div className="flex-1">
            <div className="relative">
              <div className="bg-white rounded-lg card-shadow p-4 max-w-md mx-auto transform rotate-1">
              <Image src={'/seen.jpg'} className="h-full w-full" height={200}  width={200} alt="crime scene"/>
                <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-lg card-shadow">
                  <div className="status-badge status-inprogress">In Progress</div>
                </div>
              </div>

              {/* Location Tag (Only on larger screens) */}
              <div className="absolute -bottom-6 -left-6 hidden md:block">
                <div className="bg-white rounded-lg card-shadow p-3 transform -rotate-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-gray-700">Downtown Area</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
