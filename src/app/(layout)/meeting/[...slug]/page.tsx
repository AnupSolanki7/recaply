/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download, Share2, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import http from "@/lib/http";
import moment from "moment";
import { useEffect, useState } from "react";
import PlayAudio from "../../component/PlayAudio";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function WorkspaceDetail() {
  const searchParams = useParams();
  const [details, setDetails] = useState<any>(null);
  const [Loading, setLoading] = useState(false);
  const id = searchParams?.slug?.[0];

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const response = await http.get(`/api/meeting/${id}`);
      if (response?.data?.data) {
        setDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonHeader = () => (
    <div className="mb-8">
      <div className="flex items-center text-zinc-400 mb-4">
        <Skeleton className="h-4 w-24 bg-zinc-800" />
        <ChevronRight className="h-4 w-4 mx-2" />
        <Skeleton className="h-4 w-32 bg-zinc-800" />
      </div>
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-8 w-64 bg-zinc-800 mb-2" />
          <div className="flex items-center text-zinc-400">
            <Skeleton className="h-4 w-32 bg-zinc-800" />
            <span className="mx-2">•</span>
            <Skeleton className="h-4 w-24 bg-zinc-800" />
            <span className="mx-2">•</span>
            <Skeleton className="h-6 w-24 bg-zinc-800" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 bg-zinc-800" />
          <Skeleton className="h-10 w-24 bg-zinc-800" />
        </div>
      </div>
    </div>
  );

  const SkeletonCard = ({ title }: { title: string }) => (
    <Card className="bg-zinc-900 border-zinc-800 p-6">
      <h2 className="text-xl text-indigo-700 font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full bg-zinc-800" />
        <Skeleton className="h-4 w-5/6 bg-zinc-800" />
        <Skeleton className="h-4 w-4/6 bg-zinc-800" />
      </div>
    </Card>
  );

  const SkeletonAnalytics = () => (
    <Card className="bg-zinc-900 border-zinc-800 p-6">
      <h2 className="text-xl font-semibold mb-6 text-indigo-700">
        Meeting Analytics
      </h2>
      <div className="space-y-6">
        {["Speaker Analysis", "Sentiment Analysis", "Topic Breakdown"].map(
          (title, index) => (
            <div key={index}>
              <h3 className="font-medium mb-4 text-indigo-700">{title}</h3>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-zinc-800" />
                <Skeleton className="h-4 w-5/6 bg-zinc-800" />
                <Skeleton className="h-4 w-4/6 bg-zinc-800" />
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );

  const handleShare = async () => {
    const response = await http.post(`/api/meeting/send-mail/${id}`, {});

    if (response?.data) {
      console.log(response?.data);
      toast.success("Email sent Successfully");
    }
  };

  return (
    <div className="ml-[240px] min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {Loading ? (
          <SkeletonHeader />
        ) : (
          <div className="mb-8">
            <div className="flex items-center text-zinc-400 mb-4">
              <span>{details?.project?.name}</span>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span>{details?.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{details?.name}</h1>
                <div className="flex items-center text-zinc-400">
                  <span>
                    {" "}
                    {moment(details?.created_at).format("MMM DD, YYYY")}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {(Number(details?.duration) / 60).toFixed(2)} Minutes
                  </span>
                  <span className="mx-2">•</span>
                  <div className="flex -space-x-2">
                    {details?.meeting_json?.meetingAnalysis?.identifiedSpeakers?.map(
                      (mem: any, index: any) => (
                        <Avatar
                          key={index}
                          className="border-2 border-zinc-950 h-6 w-6"
                        >
                          <AvatarFallback>{mem?.[0]}</AvatarFallback>
                        </Avatar>
                      )
                    )}
                  </div>
                  <span className="ml-2">
                    {
                      details?.meeting_json?.meetingAnalysis?.identifiedSpeakers
                        ?.length
                    }{" "}
                    participants
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-zinc-900 border-zinc-700"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Send Mail
                </Button>
                <a
                  href={`https://d1vi0tie5phe8t.cloudfront.net/${details?.file}`}
                  target="_blank"
                >
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Discussion Summary */}
            {Loading ? (
              <>
                <SkeletonCard title="Discussion Summary" />
                <SkeletonCard title="Full Transcription" />
              </>
            ) : (
              <>
                <Card className="bg-zinc-900  border-zinc-800 p-6">
                  <h2 className="text-xl text-indigo-700 font-semibold mb-4">
                    Discussion Summary
                  </h2>
                  {/* <p className="text-zinc-400">{details?.meeting_summary}</p> */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-indigo-700 mb-2">
                        Key Discussion Points
                      </h3>
                      <ul className="list-disc list-inside text-zinc-300 space-y-2">
                        {details?.meeting_json?.meetingAnalysis?.minutesOfMeeting?.keyDiscussionPoints?.map(
                          (point: any, index: any) => (
                            <li key={index}>{point}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-indigo-700 mb-2">
                        Decision Made
                      </h3>
                      <ul className="list-disc list-inside text-zinc-300 space-y-2">
                        {details?.meeting_json?.meetingAnalysis?.minutesOfMeeting?.decisionsMade?.map(
                          (point: any, index: any) => (
                            <li key={index}>{point}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-indigo-700 mb-2">
                        Action Items
                      </h3>
                      <ul className="list-disc list-inside text-zinc-300 space-y-2">
                        {details?.meeting_json?.meetingAnalysis?.minutesOfMeeting?.actionItems?.map(
                          (point: any, index: any) => (
                            <li key={index}>
                              {point?.speaker ? (
                                <span>
                                  {point?.speaker} : {point?.action}
                                </span>
                              ) : (
                                point
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Full Transcription */}
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <h2 className="text-xl font-semibold text-indigo-700 mb-4">
                    Full Transcription
                  </h2>
                  <div className="space-y-6">
                    {details?.meeting_json?.meetingAnalysis?.conversation?.map(
                      (transcript: any, index: any) => (
                        <div key={index} className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>{transcript?.[0]}</AvatarFallback>
                          </Avatar>

                          <p className="text-zinc-300">{transcript}</p>
                        </div>
                      )
                    )}
                  </div>
                </Card>
              </>
            )}
          </div>
          {/* Analytics Sidebar */}
          <div className="space-y-8">
            {Loading ? (
              <>
                <SkeletonAnalytics />
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <Skeleton className="h-12 w-full bg-zinc-800" />
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <h2 className="text-xl font-semibold mb-6 text-indigo-700">
                    Meeting Analytics
                  </h2>

                  {/* Speaker Analysis */}
                  <div className="mb-8">
                    <h3 className="font-medium mb-4 text-indigo-700">
                      Speaker Analysis
                    </h3>
                    <div className="space-y-4">
                      {details?.meeting_json &&
                        Object.keys(
                          details?.meeting_json?.meetingAnalysis
                            ?.speakerInsights?.speakerTalkTimeAnalysis
                        )?.map((speaker: any, index: any) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-white text-sm">
                              <div className="flex items-center  gap-2">
                                <Avatar className="h-6 w-6 text-zinc-800 ">
                                  <AvatarFallback>
                                    {speaker?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{speaker}</span>
                              </div>
                              <span>
                                {
                                  details?.meeting_json?.meetingAnalysis
                                    ?.speakerInsights
                                    ?.speakerTalkTimeAnalysis?.[speaker]
                                }{" "}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Sentiment Analysis */}
                  <div className="mb-8">
                    <h3 className="font-medium mb-4 text-indigo-700">
                      Sentiment Analysis
                    </h3>
                    <div className="space-y-4">
                      {details?.meeting_json &&
                        Object.keys(
                          details?.meeting_json?.meetingAnalysis
                            ?.sentimentAnalysis
                        )?.map((sentiment: any, index: any) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <span className="text-sm text-zinc-400">
                              {sentiment} :{" "}
                              {
                                details?.meeting_json?.meetingAnalysis
                                  ?.sentimentAnalysis?.[sentiment]
                              }
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Topic Breakdown */}
                  <div>
                    <h3 className="font-medium mb-4 text-indigo-700">
                      Topic Breakdown
                    </h3>
                    <div className="space-y-3 text-white">
                      {details?.meeting_json &&
                        Object.keys(
                          details?.meeting_json?.meetingAnalysis
                            ?.speakerInsights?.topicBreakdown
                        )?.map((topic: any, index: any) => (
                          <div
                            key={index}
                            className="flex flex-wrap justify-between text-sm"
                          >
                            <span className="text-indigo-500">{topic} :</span>
                            <span>
                              {
                                details?.meeting_json?.meetingAnalysis
                                  ?.speakerInsights?.topicBreakdown?.[topic]
                              }
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </Card>

                {/* Audio Player */}
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <div className="flex items-center gap-4">
                    <PlayAudio
                      audioUrl={`https://d1vi0tie5phe8t.cloudfront.net/${details?.file}`}
                      title={details?.name}
                    />
                    <div>
                      <div className="font-medium text-indigo-700">
                        Full Recording
                      </div>
                      <div className="text-sm text-zinc-400">
                        {Number(Number(details?.duration) / 60)?.toFixed(2)}{" "}
                        Minutes
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
