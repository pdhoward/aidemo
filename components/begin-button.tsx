import React, { FC } from 'react';
import Link from 'next/link';

// note the path name in the href is processed in the middleware to
// take the user to the multiclient applications

export default function Component() {    
  
  return (
    <Link href="/process">
      <div className="rounded-lg p-1.5 text-stone-700 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800">
        Welcome Back - Access the AI Code Machine
      </div>          
    </Link>
  )  

}
