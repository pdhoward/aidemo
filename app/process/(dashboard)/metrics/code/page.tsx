"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import metricImage from '@/data/images/codev2.png'


export default function Code() {
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 p-6">
        <h1 className="text-2xl font-semibold">Metrics Report</h1>
      </header>

        {/* Main Content */}
        <main className="m-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Code Complexity - The Cyclomatic Complexity (CC) is the number of cases needed to test every logic path once</h2>
          
          <div className="flex flex-row items-start space-x-1"> {/* space-x sets the gap */}
            {/* Metrics Section */}
            <div className="w-[35%]"> {/* adjusted width */}
              <div className="relative w-full h-[400px]">
                <Image 
                  src={metricImage} 
                  width={240}
                  height={440}
                  alt="Metrics" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Legend Section */}
            <div className="w-[40%]"> {/* adjusted width */}
              <h2 className="text-xl font-semibold mb-4">Legend</h2>
              <div className="border-2 border-white p-4 rounded-md">
                <ul className="text-sm list-disc list-inside">
                  <li>PG: paragraphs</li>
                  <li>CC: cyclometric complexity</li>
                  <li>CCPP: CC/PG</li>
                  <li>BM: benchmark on CCPG = 0-10 Low, 11-20 Moderate, 21-50 High, 51+ Very High</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Commentary Section */}
        <section className="mt-30">
          <h2 className="text-xl font-semibold mb-4">Conclusion</h2>
          <ul className="list-disc list-inside">
            <li>These programs range from highly complex to non-complex overall</li>
            <li>They do have nested conditions (IF ... IF …) and compound conditions (WHERE … AND … OR … NOT) which are harder to test and debug than simple conditions</li>
            <li>GOTO statements are not always constrained to EXIT paragraphs</li>
            <li>ALTER statements were removed from the COBOL standard in 1985</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
