/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, UserPlus } from "lucide-react";
import http from "@/lib/http";
import { useParams } from "next/navigation";

interface Member {
  id: string;
  name: string;
  email: string;
  avatarFallback: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MembersSection = ({ initialMembers }: { initialMembers: any }) => {
  const searchParams = useParams();
  const id = searchParams?.slug?.[0];
  const [members, setMembers] = useState<Member[]>(initialMembers ?? []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "" });

  const handleAddMember = async () => {
    if (newMember.name && newMember.email) {
      try {
        const response = await http.post(`/api/project-members`, {
          name: newMember.name,
          email: newMember.email,
          project: id,
        });

        if (response?.data) {
          setMembers([...members, ...initialMembers, response?.data?.data]);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
      setNewMember({ name: "", email: "" });
      setIsDialogOpen(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memberArray: any = members?.length ? members : initialMembers;

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-400">Members</h2>
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="outline"
          size="sm"
          className="bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberArray?.map((member: any) => (
          <Card key={member?.id} className="bg-zinc-800 border-zinc-700 p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{member?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{member?.name}</p>
                <p className="text-sm text-zinc-400">{member?.email}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-zinc-400">
                Name
              </label>
              <Input
                id="name"
                value={newMember?.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-zinc-400">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={newMember?.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddMember}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MembersSection;
