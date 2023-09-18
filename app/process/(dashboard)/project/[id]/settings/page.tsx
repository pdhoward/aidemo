import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { updateProject } from "@/lib/actions";
import DeleteSiteForm from "@/components/form/delete-site-form";

export default async function ProjectSettingsIndex({
  params,
}: {
  params: { id: string };
}) {


  let data 

  try {

    data = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
    });

  } catch(error) {
    console.log('---error fetching project ---')
    console.log(error)
  }
 
 

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Name"
        description="The name of your project. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data?.name!,
          placeholder: "Project Name",
          maxLength: 32,
        }}
        handleSubmit={updateProject}
      />

      <Form
        title="Description"
        description="The description of your project. "
        helpText="Tags"
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: data?.description!,
          placeholder: "Modernization project description",
        }}
        handleSubmit={updateProject}
      />

      <DeleteSiteForm siteName={data?.name!} />
    </div>
  );
}
