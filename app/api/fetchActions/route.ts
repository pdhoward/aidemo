
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//export const runtime = "edge";

export async function POST(request: Request) { 

  const { projectId, limit } = await request.json()

  // First, get the project with its associated model
  const projectWithModel = await prisma.project.findUnique({
    where: { id: projectId },
    include: { model: true }
  });
  if (!projectWithModel) {
    throw new Error(`No project found with ID ${projectId}`);
  }

  if (!projectWithModel.model) {
    throw new Error(`No model found for project with ID ${projectId}`);
  }

   // Then, get all actions associated with that model
   const actions = await prisma.action.findMany({
    where: {
      models: {
        some: { id: projectWithModel.model.id }
      },
    },
    orderBy: {
      updatedAt: "desc",
    },    
    ...(limit ? { take: limit } : {}),
  });

  // Here's where we attach the project to each action manually
  const actionsWithProject = actions.map(action => ({
    ...action,
    project: projectWithModel
  }));
  

  return NextResponse.json(actionsWithProject);
}
