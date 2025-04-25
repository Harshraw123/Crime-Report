'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Submit Report', href: '/submit-report' },
  { label: 'Track Report', href: '/track-report' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const {user}=useUser();
const role=user?.publicMetadata.role;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold text-slate-800">
              Report <span className="text-red-500">IQ</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative font-medium transition-colors duration-200 ${
                    isActive ? 'text-red-500' : 'text-slate-700 hover:text-red-500'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2/3 h-[2px] bg-red-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">

          
        {role==="admin" ?
       <Link href={'/admin'}><button  className="bg-slate-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl shadow transition-all"> Admin Page</button></Link>

          :
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow transition-all">
          Emergency: 911
        </button>
        }

<UserButton/>

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 z-50 h-full w-64 bg-white backdrop-blur-3xl border-l border-slate-200 p-6 flex flex-col gap-6 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-slate-800">Menu</span>
          <button className='text-black' onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        {navItems.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`text-base font-medium transition-colors ${
                isActive ? 'text-red-500' : 'text-black hover:text-red-500'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          );
        })}

        <hr className="border-slate-300 my-4" />



        {role==="admin" ?
            <Link href={'/admin'}><button  className="bg-slate-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl shadow transition-all"> Admin Page</button></Link>

          :
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow transition-all">
          Emergency: 911
        </button>
        }

<UserButton/>

      </div>

      
    </header>
  );
}
