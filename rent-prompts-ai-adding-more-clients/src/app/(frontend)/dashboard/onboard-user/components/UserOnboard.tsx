"use client";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/Icons";
import { Input } from "@/components/ui/input";
import { EllipsisVertical, Trash2, UserPlus, UserRoundCog, Check, X, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import TeamCollaboratorToggle from "./TeamCollabeList";

interface Member {
  id: string;
  email: string;
  userName: string;
  createRappPermission: boolean;
}

const OnboardUser = () => {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredData, setFilteredData] = useState<Member[]>([]); // State for filtered data
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clickedButton, setClickedButton] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    memberId: "",
  });
  const [memberToRemove, setMemberToRemove] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [createRappPermission, setCreateRappPermission] = useState(false);

  // Fetch members list
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const getUser = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/onboarded-members-list`
      );
      const data = await getUser.json();
      setData(data.data || []);
      setFilteredData(data.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch members. Please try again.");
    }
    setLoading(false);
  };

  // Handle granting/revoking permission
  const handleTogglePermission = async (memberId: string, newPermission: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/update-create-permission`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memberId, createRappPermission: newPermission }),
        }
      );

      const res = await response.json();

      if (response.ok) {
        toast.success(
          newPermission
            ? "Create AI App Permission granted successfully!"
            : "Create AI App Permission revoked successfully!"
        );
        fetchMembers(); // Refresh the members list
      } else {
        toast.error(res.error || "Failed to update permission");
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error("An error occurred while updating permission.");
    }
  };

  // Handle removing a member
  const handleRemove = async (memberId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/remove-member`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memberId }),
        }
      );

      const res = await response.json();

      if (response.ok) {
        toast.success("Member removed successfully!");
        closeConfirmModal();
        fetchMembers();
      } else {
        closeConfirmModal();
        toast.error(res.error);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while removing the member.");
    }
  };

  // Open/close confirmation modal
  const openConfirmModal = (memberId: string) => {
    setConfirmModal({ open: true, memberId });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ open: false, memberId: "" });
  };

  // Confirm removal
  const confirmRemove = () => {
    handleRemove(confirmModal.memberId);
  };

  // Filter members based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(
        (member) =>
          member?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const toggleDropdown = (email: string) => {
    setOpenDropdown((prev) => (prev === email ? null : email));
  };

  const isDropdownOpen = (email: string) => openDropdown === email;

  const closeDropdown = () => {
    setOpenDropdown(null);
  };
  const handleSend = async () => {
    if (email.trim()) {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/onboard-Member`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, createRappPermission }),
          }
        );

        const res = await response.json();

        if (response.ok) {
          toast.success("User onboarded successfully!");
          setEmail("");
          setCreateRappPermission(false); // Reset the checkbox
          fetchMembers();
          setShowModal(false);
        } else {
          toast.error(res.error);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while onboarding the user.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please enter a valid email.");
    }
  };


  return (
    <div className="w-full flex flex-col gap-4">
      <div className="md:p-6 flex flex-col gap-4  min-h-[80vh] w-full">
        {/* <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 mx-auto md:my-2 mt-4 justify-between w-full">
          <h1 className="text-lg md:text-3xl font-bold">
            Onboard a New Member
          </h1>
        </div> */}

        <div className="flex flex-row items-center gap-2 max-md:mt-4 justify-between">
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search by username or email"
              className="w-full bg-gradient-to-br from-indigo-900 to-indigo-950 border-muted-foreground text-white pl-10 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500  transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Icons.searchbar />
            </div>
          </div>
          <div className="flex flex-row gap-2">
          <Button
            variant="white"
            className="transform transition duration-500 hover:scale-105"
            onClick={() => {setShowModal(true)
              setClickedButton("member")}
            }
          >
            <UserPlus className="" strokeWidth={2.5} />
            <span className="hidden md:block ml-2">Add Member</span>
          </Button>
          <Button
            variant="white"
            className="transform transition duration-500 hover:scale-105"
            onClick={() => {setShowModal(true)
              setClickedButton("collaborator")}
            }
          >
            <UserPlus className="" strokeWidth={2.5} />
            <span className="hidden md:block ml-2">Add Collaborator</span>
          </Button>
          </div>
          
        </div>

       <TeamCollaboratorToggle filteredTeamData={filteredData} filteredCollaboratorData={[]} loading={loading} toggleDropdown={toggleDropdown} isDropdownOpen={isDropdownOpen} closeDropdown={closeDropdown} openConfirmModal={openConfirmModal} handleTogglePermission={handleTogglePermission} setMemberToRemove={setMemberToRemove} />

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">{clickedButton === "member" ? "Add Member" : "Add Collaborator"}</h2>
              <input
                type="email"
                placeholder={clickedButton === "member" ? "Enter member email" : "Enter collaborator email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              />
              {/* Add a checkbox for Create RAPP Permission */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="createRappPermission"
                  checked={createRappPermission}
                  onChange={(e) => setCreateRappPermission(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="createRappPermission" className="text-black">
                Allow user to create AI app for organization
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300 mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`py-2 px-4 rounded-lg transition duration-300 font-semibold ${loading
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  onClick={handleSend}
                  disabled={loading}
                >
                  {loading ? "Sending..." : (clickedButton === "member" ? "Add Member" : "Add Collaborator")}
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-80 transition-all duration-200 flex justify-center items-center px-4">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Confirm Remove</h2>
              <p className="break-normal whitespace-normal">
                Are you sure you want to remove{" "}
                <strong>{memberToRemove}</strong>?
              </p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300 mr-2"
                  onClick={closeConfirmModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                  onClick={confirmRemove}
                  disabled={loading}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardUser;
