"use client";

import React, { useState, useCallback, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { MdEdit } from "react-icons/md";

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

interface UsersListProps {
  users: User[];
  access?: any;
  handleCheckboxChange: (userId: string, action: "read" | "update") => void;
  setSelectedUsers: React.Dispatch<
    React.SetStateAction<{
      [userId: string]: { email: string; read: boolean; update: boolean };
    }>
  >;
  selectedUsers: {
    [userId: string]: { email: string; read: boolean; update: boolean };
  };
  handleAddMemberClick: () => void;
  handleFormSubmit
}

function UsersAccessList({
  users,
  access,
  handleCheckboxChange,
  setSelectedUsers,
  selectedUsers,
  handleAddMemberClick, 
  handleFormSubmit
}: UsersListProps) {

  const [isSending, setIsSending] = useState(false);
  const [isAccessEdit, setIsAccessEdit] = useState(false);

  useEffect(() => {
    const initialSelectedUsers = access?.reduce((acc, accessItem) => {
      acc[accessItem.userId.id] = {
        email: accessItem.userId.email,
        read: accessItem.getAccess.includes("read"),
        update: accessItem.getAccess.includes("update"),
      };
      return acc;
    }, {} as { [userId: string]: { email: string; read: boolean; update: boolean } });
    setSelectedUsers(initialSelectedUsers);
  }, [access]);

  // Function to send invitations
  const sendInvitations = useCallback(async () => {
    const selectedToAccess = Object.keys(selectedUsers).filter(
      (userId) => selectedUsers[userId].read || selectedUsers[userId].update
    );

    if (selectedToAccess.length === 0) {
      toast.error("Please select at least one user to send an invitation.");
      return;
    }

    const selectedUserEmails = selectedToAccess.map(
      (userId) => selectedUsers[userId].email
    );
    setIsSending(true);
    try {
      for (const email of selectedUserEmails) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await fetch("/api/sendPrivateRappsAccess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success(`Invitation sent to ${email}`);
        } else {
          toast.error(`Failed to send invitation to ${email}`);
        }
      }
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast.error("An error occurred while sending invitations.");
    } finally {
      setIsSending(false);
    }
  }, [selectedUsers]);

  const renderRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const user = users[index];
      const userAccess = selectedUsers[user.id] || {
        read: false,
        update: false,
      };

      return (
        <div
          style={style}
          className="flex items-center border-b border-gray-700 hover:bg-indigo-800 cursor-pointer transition-colors"
        >
          <div className="w-1/12 p-2 text-center text-gray-100 text-xs md:text-sm">
            {index + 1}
          </div>
          <div className="w-7/12 md:w-7/12 p-2 text-gray-100 text-xs md:text-sm">
            {user.email}
          </div>

          <div className="flex w-4/12 md:w-4/12 justify-around items-center space-x-2">
            <div className="w-1/2 flex justify-center items-center">
              <Checkbox
                checked={selectedUsers[user.id]?.read || false}
                disabled={!isAccessEdit}
                onCheckedChange={() => handleCheckboxChange(user.id, "read")}
                className="border-white"
              />
            </div>
            <div className="w-1/2 flex justify-center items-center">
              <Checkbox
                checked={selectedUsers[user.id]?.update || false}
                disabled={!isAccessEdit}
                onCheckedChange={() => handleCheckboxChange(user.id, "update")}
                className="border-white"
              />
            </div>
          </div>
        </div>
      );
    },
    [users, selectedUsers, handleCheckboxChange, isAccessEdit]
  );
  const listHeight = users?.length > 5 ? 400 : users?.length * 60;

  return (
    <div className="container mt-0 max-w-full mx-auto p-6 bg-black/[0.2] shadow-lg rounded-lg overflow-hidden select-none">
      <div className="pb-3 sm:pb-5 flex flex-col sm:flex-row justify-between ">
        <div>
          <div className="flex flex-row items-center gap-2">
            <CheckCircle className="h-5 w-5" />

            <h2 className="md:text-2xl font-bold text-white">
              Members Access List
            </h2>
            
          </div>
          <p className="text-xs md:text-sm text-gray-100 mt-1">
            Member with Access on this Ai app
          </p>
        </div>
        <div className="flex gap-2 justify-between mt-3 sm:mt-0 items-center">
        <Button onClick={handleAddMemberClick}
          disabled={isAccessEdit} variant="secondary" className="px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base rounded-lg">Add Member
        </Button>
        {
          isAccessEdit ? 
          (<div className="flex items-center gap-1 md:gap-2">
            <Button onClick={handleFormSubmit} variant="green">
              Save
            </Button>
            <Button
              onClick={() => setIsAccessEdit(!isAccessEdit)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>)
          :
          <Button onClick={() => setIsAccessEdit(!isAccessEdit)}
          disabled={isAccessEdit} variant="white" className="flex items-center gap-[1px]">Edit <MdEdit className="mt-[2px]"/></Button>
        }
        
        </div>
        
      </div>

      {
        users?.length > 0 && 
        <>
        <div className="overflow-x-auto">
        <div className="flex items-center bg-indigo-800 rounded-md p-2">
          <div className="w-1/12 text-xs md:text-sm text-center font-semibold text-gray-200">
            #
          </div>
          <div className="w-7/12 font-semibold text-gray-200 text-xs md:text-sm">
            Email
          </div>
          <div className="w-2/12 text-center font-semibold text-gray-200 text-xs md:text-sm">
            Read
          </div>
          <div className="w-2/12 text-center font-semibold text-gray-200 text-xs md:text-sm">
            Update
          </div>
        </div>       
        <List
          height={listHeight}
          itemCount={users.length}
          itemSize={60}
          width="100%"
        >
          {renderRow}
        </List>
      </div> 

      <div className="p-3 flex justify-center items-center border-t border-gray-400 ">
        {/* <p className="text-sm text-gray-100">
          {Object?.values(selectedUsers).filter((user) => user.read).length}{" "}
          member
          {Object?.values(selectedUsers).filter((user) => user.read).length !==
          1
            ? "s"
            : ""}{" "}
          selected
        </p> */}
        <Button
          onClick={sendInvitations}
          disabled={
            Object?.values(selectedUsers).filter((user) => user.read).length ===
            0 ||
            isSending ||
            !isAccessEdit
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
          {isSending ? "Sending Invitations..." : `Send Invitations`}
        </Button>
      </div>
      </>
        }
    </div>
  );
}

export default React.memo(UsersAccessList);
