/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { Mic, StopCircle, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import http from "@/lib/http";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/Loading";

const RecordingButton = ({
  workspace: initialWorkspace,
  projects,
  setRefresh,
  refresh,
}: {
  workspace?: string;
  projects?: any;
  setRefresh?: any;
  refresh?: boolean;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);
  const [workspace, setWorkspace] = useState(initialWorkspace || "");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [loading, setLoading] = useState(false);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    if (!workspace) {
      setIsWorkspaceDialogOpen(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioBlob(audioBlob);
        setIsDialogOpen(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!audioBlob) {
      alert("No audio recorded!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("start_time", new Date().toISOString());
    formData.append("end_time", new Date().toISOString());
    formData.append("project", workspace);

    try {
      const response = await http.post("/api/upload", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setIsDialogOpen(false);
        setRefresh(!refresh);
        alert("Recording uploaded successfully!");
      } else {
        alert("Failed to upload recording.");
      }
    } catch (error) {
      console.error("Error uploading recording:", error);
      alert("An error occurred while uploading the recording.");
    }
    setLoading(false);
  };

  const handleWorkspaceSubmit = () => {
    if (workspace) {
      setIsWorkspaceDialogOpen(false);
      handleStartRecording();
    } else {
      alert("Please enter a workspace name.");
    }
  };

  return (
    <>
      <Button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={
          isRecording
            ? "bg-red-600 hover:bg-red-700"
            : "bg-indigo-600 hover:bg-indigo-700"
        }
      >
        {isRecording ? (
          <StopCircle className="h-4 w-4 mr-2" />
        ) : (
          <Mic className="h-4 w-4 mr-2" />
        )}
        {isRecording ? "Stop Recording" : "New Recording"}
      </Button>

      <Dialog
        open={isWorkspaceDialogOpen}
        onOpenChange={setIsWorkspaceDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Select Workspace</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="workspace" className="text-white">
              Workspace Name
            </Label>
            <Select
              onValueChange={(item) => setWorkspace(item)}
              name="workspace"
              value={workspace}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Workspace" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((item: any, index: any) => (
                  <SelectItem key={index} value={item?.id}>
                    {item?.project_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={handleWorkspaceSubmit}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Recording Complete</DialogTitle>
          </DialogHeader>
          <Card className="bg-zinc-800 p-4 mt-4">
            {audioUrl && (
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            )}
          </Card>
          <DialogFooter className="flex w-full !justify-between mt-6">
            <Button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {loading ? <LoadingSpinner /> : "Submit"}
            </Button>
            {audioUrl && (
              <a href={audioUrl} download="recording.webm">
                <Button
                  variant="outline"
                  className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecordingButton;
