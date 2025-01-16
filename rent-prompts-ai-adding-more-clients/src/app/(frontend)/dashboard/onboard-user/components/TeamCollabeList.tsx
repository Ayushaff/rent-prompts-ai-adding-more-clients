import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, EllipsisVertical, Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";

interface Member {
    id: string;
    email: string;
    userName: string;
    createRappPermission: boolean;
    role?: string;
}

interface TeamCollaboratorToggleProps {
    filteredTeamData: Member[];
    filteredCollaboratorData: Member[];
    loading: boolean;
    toggleDropdown: (email: string) => void;
    isDropdownOpen: (email: string) => boolean;
    closeDropdown: () => void;
    handleTogglePermission: (id: string, newPermission: boolean) => void;
    openConfirmModal: (email: string) => void;
    setMemberToRemove: (email: string) => void;
  }

export default function TeamCollaboratorToggle({
  filteredTeamData = [],
  filteredCollaboratorData = [],
  loading = false,
  toggleDropdown,
  isDropdownOpen,
  closeDropdown,
  handleTogglePermission,
  openConfirmModal,
  setMemberToRemove
}:TeamCollaboratorToggleProps) {
  const [activeTab, setActiveTab] = useState("team");

  const renderContent = () => {
    const filteredData =
      activeTab === "team" ? filteredTeamData : filteredCollaboratorData;

    if (loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <ClipLoader loading={loading} color="white" size={40} />
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <>
        { activeTab === "team" ? 
        <div className="flex items-center gap-2">
            <Users/>
            <h1 className="text-2xl font-semibold">Onboarded Team</h1>
        </div> : 
        <div className="flex items-center gap-2">
            <Users/>
            <h1 className="text-2xl font-semibold">Collaborators</h1>
        </div>}
        <div className="justify-center mx-auto py-10 mt-4 h-48 bg-indigo-900/[0.4] border-dashed border-2 border-muted-foreground rounded-lg flex items-center">
          <p className="text-gray-400">
            No {activeTab === "team" ? "members" : "collaborators"} onboarded
            yet.
          </p>
        </div>
        </>
      );
    }

    return (
      <div className="flex flex-col space-y-2">
        { activeTab === "team" ? 
        <div className="flex items-center gap-2">
            <Users/>
            <h1 className="text-2xl font-semibold">Onboarded Team</h1>
        </div> : 
        <div className="flex items-center gap-2">
            <Users/>
            <h1 className="text-2xl font-semibold">Collaborators</h1>
        </div>}
        {filteredData.map((member:Member) => (
          <Link
            href={`/dashboard/onboard-user/${member.userName}`}
            key={member.id}
            className="bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] shadow hover:shadow-lg transition rounded-lg px-4 py-4 relative"
          >
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-start sm:items-center justify-between">
              {/* Username Column */}
              <div className="text-white font-semibold w-full md:w-4/12">
                {member?.userName || "username"}
              </div>

              {/* Email Column */}
              <div className="text-gray-200 w-full md:w-6/12">
                {member.email}
              </div>

              {/* Role Column */}
              <div className="text-gray-300 text-md italic w-full md:w-2/12">
                {member.role || "No Role"}
              </div>

              <div
                      className="absolute max-md:top-3 max-md:right-1 md:relative flex items-center justify-end w-full md:w-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="text-gray-400 hover:text-white z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleDropdown(member.email);
                        }}
                      >
                        <EllipsisVertical className="w-5 h-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen(member.email) && (
                        <div className="absolute top-full right-0 mt-2 z-20 bg-white shadow-lg rounded-md">
                          <ul className="flex flex-col p-1 md:p-2 space-y-1">
                            {/* Remove Member Button */}
                            <li>
                              <Button
                                className="text-red-400 bg-white hover:text-red-600 w-full text-left flex flex-row justify-start px-2 gap-1 py-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  closeDropdown();
                                  openConfirmModal(member.id);
                                  setMemberToRemove(member.email);
                                }}
                              >
                                <Trash2 className="w-5 h-5 inline-block md:mr-2" /> {/* Red delete icon */}
                                <p >Remove Member</p>
                              </Button>
                            </li>

                            {/* Grant/Revoke Create Permission Button */}
                            <li>
                            <li className="flex items-center px-2  hover:bg-blue-100/45 rounded-md">
                              <input
                                type="checkbox"
                                id={`togglePermission-${member.id}`}
                                checked={member.createRappPermission}
                                onChange={() => handleTogglePermission(member.id, !member.createRappPermission)} // Toggle permission
                                className="w-4 h-4 text-red-400 focus:ring-red-600"
                              />
                              <label
                                htmlFor={`togglePermission-${member.id}`}
                                className={`ml-2 text-gray-500 cursor-pointer font-semibold`}
                              >
                                {member.createRappPermission ? "Revoke Create AI App Permission" : "Allow Create AI App Permission"}
                              </label>
                            </li>
                             </li>
                          </ul>
                        </div>
                      )}
                    </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full">
      {/* Toggle Buttons */}
      <div className="flex justify-start md:justify-center my-4">
        <div className="flex bg-gray-200 rounded-lg p-1">
            <button
            onClick={() => setActiveTab("team")}
            className={`px-5 md:px-10 py-1 md:py-2 rounded-lg font-semibold transition ${
                activeTab === "team"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-700"
            }`}
            >
            Team
            </button>
            <button
            onClick={() => setActiveTab("collaborator")}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-lg font-semibold transition ${
                activeTab === "collaborator"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-700"
            }`}
            >
            Collaborator
            </button>
        </div>
    </div>
    
      {/* Content */}
      {renderContent()}
    </div>
  );
}
