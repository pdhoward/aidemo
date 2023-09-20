"use client"

import React from 'react';
import Link from 'next/link';

export default function Component() {    
  
  return (
    <Link href="/process">
      <div className="rounded-lg p-1.5 text-stone-700 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800">
        Welcome Back - Access the AI Code Machine
      </div>          
    </Link>
  )  

}
