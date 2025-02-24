"use client";

import { Card } from "@/components/ui/card";
import { Projects } from "../home/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface Workspace {
  projects: Projects[] | undefined;
  isLoading: boolean;
}

const Workspace = ({ projects, isLoading }: Workspace) => {
  const router = useRouter();
  const SkeletonLoader = () => (
    <Card className="bg-zinc-800 p-4 text-white animate-pulse">
      <div className="mb-4 flex items-center space-x-2">
        <div className="h-10 w-10 rounded-lg bg-zinc-700"></div>
        <div>
          <div className="h-4 w-24 bg-zinc-700 rounded"></div>
          <div className="h-3 w-16 bg-zinc-700 rounded mt-2"></div>
        </div>
      </div>
      <div className="flex -space-x-2">
        <div className="h-8 w-8 rounded-full bg-zinc-700"></div>
        <div className="h-8 w-8 rounded-full bg-zinc-700"></div>
        <div className="h-8 w-8 rounded-full bg-zinc-700"></div>
      </div>
    </Card>
  );

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Your Workspaces</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, index) => <SkeletonLoader key={index} />)
          : projects?.map((workspace) => (
              <Card
                key={workspace.id}
                className="bg-zinc-800 cursor-pointer p-6 text-white relative hover:bg-zinc-700 transition-colors"
                onClick={() => router.push(`/workspace/${workspace.id}`)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className="h-16 w-16 rounded-lg bg-cover bg-center"
                    style={{
                      backgroundImage: `url(https://d1vi0tie5phe8t.cloudfront.net/${workspace.image})`,
                    }}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-indigo-500 text-lg">
                      {workspace.project_name}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Created:
                      {new Date(workspace.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {workspace?.project_member?.map((member, i) => (
                    <Avatar
                      key={i}
                      className="border-2 border-[#12141A] hover:z-10"
                    >
                      <AvatarImage
                        src={
                          member?.profile_image
                            ? `https://d1vi0tie5phe8t.cloudfront.net/${member?.profile_image}`
                            : "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
                        }
                      />
                      <AvatarFallback>{member?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Workspace;
