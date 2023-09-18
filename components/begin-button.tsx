"use client";

import React, { FC } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react"

// note the path name in the href is processed in the middleware to
// take the user to the multiclient applications

export default function Component() {
    const { data: session } = useSession()
    if (session) {
      return (
        <Link href="/beginthejourney">
          <div className="rounded-lg p-1.5 text-stone-700 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800">
            Welcome Back - Access Your Projects
          </div>
          <button onClick={() => signOut()}>Sign out</button>
        </Link>
      )
    }
  return ( 
      <Link href="/beginthejourney">
        <div className="rounded-lg p-1.5 text-stone-700 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800">
            Access the AI Modernization Platform         
        </div>
      </Link>
   
  );
}
