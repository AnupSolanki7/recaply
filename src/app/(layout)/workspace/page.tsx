"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import http from "@/lib/http";
import { useRouter } from "next/navigation";
import AddWorkspaceModal from "../component/AddWorkspaceModal";

interface Workspace {
  id: string;
  name: string;
  image: string;
  created_at: string;
}

const Page = () => {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    setIsLoading(true);
    try {
      const response = await http.get("/api/project");
      if (response?.data?.data) {
        setWorkspaces(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const SkeletonLoader = () => (
    <Card className="bg-zinc-800 p-6 text-white animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-16 w-16 rounded-lg bg-zinc-700"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-zinc-700 rounded"></div>
          <div className="h-3 w-24 bg-zinc-700 rounded"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-zinc-700 rounded"></div>
        <div className="h-3 w-4/5 bg-zinc-700 rounded"></div>
      </div>
    </Card>
  );

  const EditWorkspaceDialog = ({ workspace }: { workspace: Workspace }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute top-2 right-2">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Edit Workspace: {workspace.name}</DialogTitle>
        </DialogHeader>
        {/* Add your form here */}
        <p className="text-zinc-400">Workspace edit form goes here.</p>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="ml-[240px] min-h-screen bg-zinc-950 text-white p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Workspaces</h1>
        <p className="text-xl text-zinc-400">
          Manage and organize your team&apos;s collaborative spaces
        </p>
      </header>
      {/* 
      <section className="mb-12 bg-zinc-900 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Workspace Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-indigo-500 p-6">
            <Briefcase className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold mb-1">Total Workspaces</h3>
            <p className="text-3xl font-bold">{workspaces.length}</p>
          </Card>
          <Card className="bg-indigo-500 p-6">
            <Users className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold mb-1">Active Members</h3>
            <p className="text-3xl font-bold">24</p>
          </Card>
          <Card className="bg-indigo-500 p-6">
            <Clock className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold mb-1">Avg. Daily Activity</h3>
            <p className="text-3xl font-bold">3.5 hrs</p>
          </Card>
        </div>
      </section> */}

      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Workspaces</h2>
          <AddWorkspaceModal />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, index) => <SkeletonLoader key={index} />)
            : workspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  className="bg-zinc-800 p-6 text-white cursor-pointer relative hover:bg-zinc-700 transition-colors"
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
                      <h3 className="font-semibold text-lg">
                        {workspace.name}
                      </h3>
                      <p className="text-zinc-400 text-sm">
                        Created:{" "}
                        {new Date(workspace.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-zinc-300 mb-4">
                    Collaborate and manage projects efficiently in this
                    dedicated workspace.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className=" bg-indigo-400 text-white"
                  >
                    View Details
                  </Button>
                  <EditWorkspaceDialog workspace={workspace} />
                </Card>
              ))}
        </div>
      </section>

      {/* <section className="bg-zinc-900 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          {[1, 2, 3].map((item) => (
            <li
              key={item}
              className="flex items-center space-x-4 text-zinc-300"
            >
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <p>
                New discussion started in{" "}
                <span className="font-semibold text-white">Project Alpha</span>
              </p>
              <span className="text-zinc-500">2 hours ago</span>
            </li>
          ))}
        </ul>
        <Button
          variant="link"
          className="mt-4 text-indigo-400 hover:text-indigo-300"
        >
          View All Activity
        </Button>
      </section> */}
    </div>
  );
};

export default Page;
