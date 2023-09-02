import React from 'react';

function ServiceTerminated() {
  return (
    <div className='bg-white min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-3xl font-semibold text-black'>
          Service Terminated
        </h1>
        <p className='text-lg text-black mt-4'>Contact Support Team</p>
        <a
          href='mailto:contact.thynk@gmail.com'
          className='text-blue-500 underline mt-2'
        >
          contact.thynk@gmail.com
        </a>
      </div>
    </div>
  );
}

export default ServiceTerminated;
