import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>At Prescripto, our mission is to bridge the gap between patients and healthcare providers through innovative technology. We believe that efficient scheduling is the cornerstone of effective healthcare, and we are committed to providing solutions that enhance both patient satisfaction and provider productivity.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <Link className='hover:text-blue-700' to="/"><li>Home</li></Link>
            <Link className='hover:text-blue-700' to="/about"><li>About us</li></Link>
            <Link className='hover:text-blue-700' to="/doctors"><li>Doctors</li></Link>
            <Link className='hover:text-blue-700' to="/contact"><li>Contact</li></Link>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+91 91576 49574</li>
            <li>Doctor@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024 @ Doctor.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
