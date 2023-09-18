
"use client"
import { Suspense } from "react";
import Editor from "@/components/editor/editor"
import PlaceholderCard from "@/components/placeholder-card";


export default function Overview() {
  return (
    <div className="flex flex-col h-screen p-8">
    <div className="flex flex-col space-y-6">
      <h1 className="font-cal text-xl font-bold dark:text-white">
        Altitude80 AI Code Machine
      </h1>
    </div>

    <div className="flex flex-grow flex-col space-y-6 overflow-hidden">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlaceholderCard key={i} />
            ))}
          </div>
        }
      >
        <div className="flex-grow overflow-hidden">
          <Editor />
        </div>
      </Suspense>
    </div>
  </div>
  );
}
