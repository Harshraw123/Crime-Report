'use client';

import React, { useEffect, useRef } from 'react';
import { Camera, MapPin, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StepCard = ({ number, title, description, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left step-card">
      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-sky-600 text-white font-bold text-xl mb-4">
        {number}
      </div>
      <div className="mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl text-slate-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const trackStatusRef = useRef(null); // Ref for the Track Status section


   

 

    // Reveal the Track Incident Status cards one by one on scroll

  const steps = [
    {
      number: 1,
      icon: Camera,
      title: 'Capture & Document',
      description: 'Take photos of the incident and add details through our intuitive mobile interface.',
    },
    {
      number: 2,
      icon: MapPin,
      title: 'Add Location Details',
      description: 'Pin the exact location on the map or let our app automatically detect where you are.',
    },
    {
      number: 3,
      icon: Clock,
      title: 'Track Resolution',
      description: 'Follow the status updates from pending to in-progress to completed as authorities respond.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-blue-200" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Reporting incidents in your community is simple with our streamlined three-step process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        <div className="mt-20 bg-white rounded-xl p-8 card-shadow" ref={trackStatusRef}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Track Incident Status</h3>
              <p className="text-gray-600 mb-6">
                Our transparent status system keeps you informed every step of the way.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="status-badge status-pending mr-3">Pending</div>
                  <span className="text-gray-600">Report received and awaiting review</span>
                </div>
                <div className="flex items-center">
                  <div className="status-badge status-inprogress mr-3">In Progress</div>
                  <span className="text-gray-600">Report verified and being addressed</span>
                </div>
                <div className="flex items-center">
                  <div className="status-badge status-completed mr-3">Completed</div>
                  <span className="text-gray-600">Incident resolved with confirmation</span>
                </div>
              </div>
            </div>

            <div className="flex-1 md:pl-8">
              <div className="bg-blue-50 rounded-lg p-6 space-y-6">
                <div className="incident-card flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 card-shadow">
                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  </div>
                  <div className="bg-white rounded-lg p-4 card-shadow flex-1">
                    <h4 className="font-medium text-slate-600 mb-1">Graffiti on Main St Bridge</h4>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-3 w-3 mr-1" /> Downtown, Main Street
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Reported 2 days ago</span>
                      <div className="status-badge status-inprogress sm:p-3">In Progress</div>
                    </div>
                  </div>
                </div>

                <div className="incident-card flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 card-shadow">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  </div>
                  <div className="bg-white rounded-lg p-4 card-shadow flex-1">
                    <h4 className="font-medium text-slate-600 mb-1">Broken Streetlight</h4>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-3 w-3 mr-1" /> Oak Avenue
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Reported 5 days ago</span>
                      <div className="status-badge status-completed">Completed</div>
                    </div>
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

export default HowItWorksSection;
