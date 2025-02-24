"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

const PlayAudio = ({
  audioUrl,
  title,
}: {
  audioUrl: string;
  title: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleAudioEnded = () => setIsPlaying(false);

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Open Dialog Button */}
      <Button
        variant="outline"
        size="icon"
        className="bg-zinc-400 border-zinc-400"
        onClick={() => setIsDialogOpen(true)}
      >
        <Play className="h-4 w-4" />
      </Button>

      {/* Dialog Popup */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Card className="bg-zinc-800 p-6 mt-4">
            {/* Audio Element */}
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={handleAudioEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden"
            />
            {/* Play/Pause Button */}
            <div className="flex justify-center">
              <Button
                onClick={togglePlayback}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayAudio;
