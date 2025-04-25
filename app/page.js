import React from 'react'
import HeroSection from './_components/Hero'
import Navbar from './_components/Navbar'
import HowItWorksSection from './_components/HowItWorks'
import Glory from './_components/Glory'


const page = () => {
  return (
    <div>
      <Navbar/>
  <div className=''>
    <HeroSection/>
    </div>

    <HowItWorksSection/>
    <Glory/>
    </div>
  )
}

export default page
