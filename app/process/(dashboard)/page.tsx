import { Suspense } from "react";
import Editor from "@/components/editor/editor"
import OverviewStats from "@/components/overview-stats";
import PlaceholderCard from "@/components/placeholder-card";
import OverviewProjectsCTA from "@/components/overview-projects-cta";

export default function Overview() {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-xl font-bold dark:text-white">
          Altitude80 Modernization Command Center
        </h1>
        <OverviewStats />
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-xl font-bold dark:text-white">
            Top Active Projects
          </h1>
          <Suspense fallback={null}>
            <OverviewProjectsCTA />
          </Suspense>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <Editor />
        </Suspense>
      </div>

     
    </div>
  );
}
