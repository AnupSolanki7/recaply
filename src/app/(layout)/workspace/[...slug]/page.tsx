/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, ChevronRight, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import http from "@/lib/http";
import { secondsToHours } from "@/app/lib/function";
import UploadAudio from "../../component/UploadAudio";
import RecordingButton from "../../component/RecordAudio";
import PlayAudio from "../../component/PlayAudio";
import { LoadingSpinner } from "@/components/ui/Loading";
import MembersSection from "../../component/MemberSection";

export default function WorkspaceDetailMeetings() {
  const searchParams = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [details, setDetails] = useState<any>(null);
  const [Loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const id = searchParams?.slug?.[0];
  const router = useRouter();

  useEffect(() => {
    fetchWorkspace();
  }, [refresh]);

  const fetchWorkspace = async () => {
    setLoading(true);
    try {
      const response = await http.get(`/api/project/${id}`);
      if (response?.data?.data) {
        setDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-[240px] min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      {Loading && <LoadingSpinner fullScreen />}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center text-sm text-zinc-400 mb-4">
            <span>Workspaces</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">{details?.name}</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{details?.name}</h1>
              <p className="text-zinc-400">
                {details?.project_member?.length} team members ·{" "}
                {details?.meeting?.length}&nbsp; discussions this month
              </p>
            </div>
            <div className="flex justify-end items-start gap-6">
              <UploadAudio
                setRefresh={setRefresh}
                refresh={refresh}
                workspace={id}
              />
              <RecordingButton
                workspace={id}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-5 w-5 text-indigo-400" />
              <span className="text-xs text-zinc-400">This Month</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {details?.meeting?.length}
            </p>
            <p className="text-sm text-zinc-400">Total Meetings</p>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-5 w-5 text-purple-400" />
              <span className="text-xs text-zinc-400">Avg. per Meeting</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {details?.project_member?.length}{" "}
            </p>
            <p className="text-sm text-zinc-400">Members</p>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-5 w-5 text-emerald-400" />
              <span className="text-xs text-zinc-400">This Month</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {details?.meeting
                ? secondsToHours(
                    details?.meeting?.reduce(
                      (a: any, b: any) => a + Number(b?.duration),
                      0
                    )
                  )
                : 0}
            </p>
            <p className="text-sm text-zinc-400">Meeting Hours</p>
          </Card>
        </div>

        {/* Members */}
        <MembersSection initialMembers={details?.project_member} />
        {/* Meetings List */}
        <div className="space-y-8">
          <div className="grid gap-4">
            {details?.meeting?.map((meeting: any) => (
              <Card
                key={meeting?.id}
                className="bg-zinc-900 cursor-pointer border-zinc-800 p-6 hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => router.push(`/meeting/${meeting?.id}`)}
                    className="flex-1"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-medium text-zinc-400">
                        {meeting?.name}
                      </h3>
                      <div className="flex justify-start items-center text-sm text-zinc-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {meeting?.duration
                          ? secondsToHours(meeting?.duration)
                          : 0}{" "}
                        hours
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {details?.project_member?.length} participants
                      </div>
                      <div>{meeting.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PlayAudio
                      audioUrl={`https://d1vi0tie5phe8t.cloudfront.net/${meeting?.file}`}
                      title={meeting?.name}
                    />
                    <a
                      target="_blank"
                      href={`https://d1vi0tie5phe8t.cloudfront.net/${meeting?.file}`}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-zinc-400 border-zinc-400"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
