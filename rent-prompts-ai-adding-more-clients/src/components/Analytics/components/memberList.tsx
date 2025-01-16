import Link from "next/link";
import React from "react";

interface Member {
  id: string;
  email: string;
  userName: string;
  name?: string; // Add optional fields if needed
  role?: string;
  createdApps?: number;
  sharedApps?: number;
  consumedTokens?: number;
}

// Accept memberData as a prop
interface MemberTableProps {
  memberData: Member[];
}

const MemberTable: React.FC<MemberTableProps> = ({ memberData }) => {

  return (
    <div className="bg-white p-4 shadow-md rounded-lg text-black">
      <div className="w-full text-center">
  {/* Header */}
  <div className="flex border-b font-semibold mb-4">
    <div className="p-2 flex-1 text-left">Name</div>
    <div className="p-2 flex-1">Role</div>
    <div className="p-2 flex-1">Created Apps</div>
    <div className="p-2 flex-1">Shared Apps</div>
    <div className="p-2 flex-1">Consumed Tokens</div>
  </div>

  {/* Rows */}
  {memberData?.map((member, index) => (
    <Link
      href={`/dashboard/onboard-user/${member.userName}`}
      key={index}
      className={`flex hover:bg-blue-400 p-2 items-center ${index % 2 === 0 ? 'bg-gray-100' : ''}`}
    >
      <div className="flex-1 text-left">{member.userName}</div>
      <div className="flex-1">{member.role || 'Developer'}</div>
      <div className="flex-1">{member.createdApps}</div>
      <div className="flex-1">{member.sharedApps}</div>
      <div className="flex-1">{member.consumedTokens}</div>
    </Link>
  ))}
</div>

    </div>
  );
};

export default MemberTable;
