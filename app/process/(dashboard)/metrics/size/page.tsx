"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import metricImage from '@/data/images/size.png'

export default function Size() {
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 p-6">
        <h1 className="text-2xl font-semibold">Metrics Report</h1>
      </header>

      {/* Main Content */}
      <main className="m-8">
        {/* Metrics Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Size Metrics</h2>
          <div className="relative w-full h-[400px]">
            <Image 
              src={metricImage} 
              width={460}
              height={460}
              alt="Metrics" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Legend Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Legend</h2>
          <div className="grid grid-cols-3 gap-4 border-2 border-white p-4 rounded-md">
            <ul className="text-sm list-disc list-inside">
              <li>  IDL: IDENTIFICATION DIVISION lines</li>
              <li>+ EDL: ENVIRONMENT DIVISION lines</li>
              <li>+ DDL: DATA DIVISION lines</li>
              <li>+ PDL: PROCEDURE DIVISION lines</li>
              <li>= SL: SOURCE lines </li>
            </ul>
            <ul className="text-sm list-disc list-inside">
              <li>BL: BLANK lines</li>
              <li>+ CL: COMMENT lines</li>
              <li>+ EL: EXECUTABLE lines </li>                    
              <li>= SL: SOURCE lines </li>
            </ul>
            <ul className="text-sm list-disc list-inside">
              <li>DL: DEAD lines</li>
              <li>+ LL: LIVE lines</li>
              <li>= EL: EXECUTABLE lines</li>
              <li>  LD: live density = LL/EL</li>
            </ul>
          </div>
        </section>

        {/* Commentary Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Conclusion</h2>
          <p>
            These programs are typical legacy mainframe COBOL batch and online
            Dead code appears to be a mix of inadvertent and intentional (for example, some code is intact, but the PERFORM that once invoked it is commented out)
          </p>
        </section>
      </main>
    </div>
  );
};

   
    

