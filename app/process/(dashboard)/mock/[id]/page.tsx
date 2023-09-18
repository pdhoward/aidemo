import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function MockPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.project.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-800">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-xl font-bold text-white dark:text-gray-300">
            Temporary Placeholder for {data.name}
          </h1>
        </div>
      </div>
    </>
  );
}

