"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import metricImage from '@/data/images/architecture.png'

export default function Architecture() {
  
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
          <h2 className="text-xl font-semibold mb-4">Architectural Complexity - reveals where legacy applications are complex internally and externally</h2>
          <div className="relative w-full h-[400px]">
            <Image 
              src={metricImage} 
              width={460}
              height={440}
              alt="Metrics" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Legend Section */}
        <section className="mb-8 mt-12">
          <h2 className="text-xl font-semibold mb-4">Legend</h2>
          <div className="grid grid-cols-3 gap-4 border-2 border-white p-4 rounded-md">
            <ul className="text-sm list-disc list-inside">
              <li>  IO: input-output (READ, WRITE)</li>
              <li>+ MANI: manipulation (COMPUTE, MOVE)</li>
              <li>+ CALL: CALL (& outline PERFORM)</li>
              <li>+ OSS: open source software</li>
              <li>+ NET: internet (GET, POST, PUT)</li>
              <li>= IC: internal complexity </li>
            </ul>
            <ul className="text-sm list-disc list-inside">
              <li>IFLW: inflows (inbound data)</li>
              <li>+ OFLW: outflows (outbound data)</li>
              <li>+ FANI: fan-in (inbound CALLs) </li>
              <li>+ FANO: fan-out (outbound CALLs) </li>            
              <li>= EC: external complexity </li>
              <li>AC: architectural compexity = IC + AC </li> 
            </ul>  
            <p className= "text-sm">BM: benchmark on AC = 0-300 Low, 301-600 Moderate, 601-900 High, 901+ Very High</p>          
          </div>
        </section>

        {/* Commentary Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Conclusion</h2>
          <p>
          Architecture Complexity in this application comes mainly from data manipulations, input/output, and PERFORMs of COBOL paragraphs

          </p>
        </section>
      </main>
    </div>
  );
}

   
    

