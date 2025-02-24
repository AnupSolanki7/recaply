"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Profile from "../component/Profile";
import { useSession } from "next-auth/react";
import Workspace from "../component/Workspace";
import { useEffect, useState } from "react";
import http from "@/lib/http";
import Link from "next/link";
import RecordingButton from "../component/RecordAudio";
import UploadAudio from "../component/UploadAudio";

export interface Meeting {
  created_at: string;
  duration: string;
  end_time: string;
  file: string;
  id: string;
  name: string;
  project: { id: string; name: string };
  start_time: string;
}

interface Member {
  id: string;
  name: string;
  profile_image: string;
}

export interface Projects {
  created_at: string;
  id: string;
  image: string;
  meeting_count: number;
  project_member: Member[];
  project_name: string;
}

interface Dashboard {
  projects: Projects[];
  meetings: Meeting[];
}

export default function Home() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const session = useSession();

  useEffect(() => {
    fetchWorkspaces();
  }, [refresh]);

  const fetchWorkspaces = async () => {
    setIsLoading(true);
    try {
      const response = await http.get("/api/user/dashboard");
      if (response?.data?.data) {
        setDashboard(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-[240px] p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Welcome back, {session?.data?.user?.name}
          </h2>
          <p className="text-gray-400">Let&apos;s capture your discussions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Profile />
        </div>
      </div>

      <div className="mb-8 flex justify-end space-x-4">
        <RecordingButton
          setRefresh={setRefresh}
          refresh={refresh}
          projects={dashboard?.projects}
        />
        <UploadAudio
          setRefresh={setRefresh}
          refresh={refresh}
          projects={dashboard?.projects}
        />
      </div>

      <Workspace projects={dashboard?.projects} isLoading={isLoading} />
      <div>
        <h3 className="mb-4 text-xl font-semibold">Recent Discussions</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {dashboard?.meetings?.map((meet) => (
              <Link
                href={`/meeting/${meet?.id}`}
                key={meet.id}
                className="flex items-center justify-between rounded-lg bg-[#12141A] p-4 hover:bg-[#1E1F25]"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-10 w-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center`}
                  >
                    {meet?.name?.[0]}
                  </div>
                  <div>
                    <h4 className="font-medium font-mono text-gray-400">
                      {meet?.name}
                    </h4>
                    <p className="text-sm font-mono text-gray-400">
                      {meet?.project?.name}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(meet?.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
