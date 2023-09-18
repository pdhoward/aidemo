import { Suspense } from "react";
import Projects from "@/components/projects";
import PlacholderCard from "@/components/placeholder-card";
import CreateSiteButton from "@/components/create-site-button";
import CreateProjectModal from "@/components/modal/create-project";

export default function AllProjects({ params }: { params: { id: string } }) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-xl font-bold dark:text-white">
            AI Modernization Projects
          </h1>
          <CreateSiteButton>
            <CreateProjectModal />
          </CreateSiteButton>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlacholderCard key={i} />
              ))}
            </div>
          }
        >
          {/* @ts-expect-error Server Component */}
          <Projects projectId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
