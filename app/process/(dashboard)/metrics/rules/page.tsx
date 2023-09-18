"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import metricImage from '@/data/images/rules.png'

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
        <section>
          <h2 className="text-xl font-semibold mb-4">Business Rule Complexity Metrics </h2>
          
          <div className="flex flex-row items-start space-x-1"> {/* space-x sets the gap */}
            {/* Metrics Section */}
            <div className="w-[35%]"> {/* adjusted width */}
              <div className="relative w-full h-[400px]">
                <Image 
                  src={metricImage} 
                  width={400}
                  height={400}
                  alt="Metrics" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Legend Section */}
            <div className="w-[40%]"> {/* adjusted width */}
               <h2 className="text-xl font-semibold mb-4">Note:</h2>               
                  <ul className="text-sm list-disc list-inside">
                    <li>Business rules determine how business processes operate
                    <ul className="text-xs list-none list-inside ml-4">
                      <li>- Business rules touch business data</li>                    
                    </ul>
                    </li>
                    <li>Non-rule code determines how programs/systems operate
                    <ul className="text-xs list-none list-inside ml-4">
                      <li>- Reports and screens are examples of non-rule code often embedded with business rules</li>
                      <li>- Working Storage loads and data export are examples of non-rule code more likely separated from business rules because they occur before or after the mainline</li>
                    </ul>
                    </li>                    
                  </ul>             
              <h2 className="text-xl font-semibold mb-4 mt-6">Legend</h2>
              <div className="border-2 border-white p-4 rounded-md">
                <ul className="text-sm list-disc list-inside">
                  <li>PG: paragraphs</li>
                  <li>COV: coverage</li>
                  <li>RL: rule lines</li>
                  <li>BR: business rules</li>
                  <li>EXTR: extracted</li>
                  <li>PDL: PROC DIV lines</li>
                  <li>RD: rule density = RL/PDL</li>
                  <li>BM: benchmark on RD = 0-40% Low, 41-70% Moderate, 71-100% High</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Commentary Section */}
        <section className="mt-40">
          <h2 className="text-xl font-semibold mb-4">Conclusion</h2>
          <ul className="text-sm list-disc list-inside">
            <li>Coverage of 80% extracts only rules that do the most work and deselects code most likely to be non-rules</li>
            <li>Coverage of 100% extracts everything to ensure completeness</li>
            <li>Coverage parameter can be changed to extract more/fewer rules</li>
            <li>Rule density (ratio of rules to non-rules) is high 
</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

   
    

