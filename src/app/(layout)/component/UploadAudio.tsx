/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import { Upload, FileAudio, Check, Mic } from "lucide-react";
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
import { LoadingSpinner } from "@/components/ui/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UploadAudio = ({
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
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);
  const [workspace, setWorkspace] = useState(initialWorkspace || "");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (workspace) {
        setIsDialogOpen(true);
      } else {
        setIsWorkspaceDialogOpen(true);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append("audio", file);
      formData.append("start_time", new Date().toISOString());
      formData.append("end_time", new Date().toISOString());
      formData.append("project", workspace);
    }
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
        alert("Audio uploaded successfully!");
      } else {
        alert("Failed to upload audio.");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("An error occurred while uploading the audio.");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const handleWorkspaceSubmit = () => {
    if (workspace) {
      setIsWorkspaceDialogOpen(false);
      setIsDialogOpen(true);
    } else {
      alert("Please enter a workspace name.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="audio/*"
        className="hidden"
        id="audio-upload"
        onChange={handleFileChange}
      />
      <label htmlFor="audio-upload">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white cursor-pointer"
        >
          <span>
            <Upload className="mr-2 h-5 w-5" />
            Upload Audio
          </span>
        </Button>
      </label>

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
              Continue Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Audio File Details</DialogTitle>
          </DialogHeader>
          <Card className="bg-zinc-800 p-6 mt-4">
            {file && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <FileAudio className="h-8 w-8 text-indigo-400" />
                  <div>
                    <p className="font-medium text-indigo-500">{file.name}</p>
                    <p className="text-sm text-zinc-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400">
                  Type: {file.type || "Audio file"}
                </p>
              </div>
            )}
          </Card>
          <DialogFooter className="mt-6">
            <Button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Check className="mr-2 h-4 w-4" />
              {loading ? <LoadingSpinner fullScreen /> : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadAudio;
