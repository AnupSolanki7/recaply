"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload } from "lucide-react";
import http from "@/lib/http";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/Loading";

const AddWorkspaceModal = () => {
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [apiFile, setApiFile] = useState<File | null>(null);
  const [Loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setLoading(true);
    const file = e.target.files[0];
    const formdata = new FormData();
    formdata.append("image", file);
    formdata.append("folder", "image");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    setImageFile(file);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await http.post("/api/upload/image", formdata, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle form submission here
    if (response?.data?.data?.image) {
      toast(response?.data?.message);
    }
    setApiFile(response?.data?.data?.image);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      name: workspaceName,
      image: apiFile,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await http.post("/api/project", formData);
    // Handle form submission here
    if (response?.data?.data?.name) {
      toast.success(response?.data?.message);
      setWorkspaceName("");
      setImageFile(null);
      setOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-indigo-400 hover:text-indigo-300 hover:bg-zinc-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
        {Loading && <LoadingSpinner fullScreen />}

        <DialogHeader>
          <DialogTitle>Add Workspace</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a new workspace for your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-400">
                Name
              </Label>
              <Input
                id="name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter workspace name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image" className="text-zinc-400">
                Image
              </Label>
              <div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="image"
                  className="flex items-center justify-center px-4 py-2 bg-zinc-800 text-white rounded-md cursor-pointer hover:bg-zinc-700 transition-colors"
                >
                  <Upload className="mr-2 h-6 w-4" />
                  {imageFile ? imageFile.name : "Upload Image"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Create Workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkspaceModal;
