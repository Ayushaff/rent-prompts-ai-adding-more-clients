'use client'
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Card from "./components/card";
import MemberTable from "./components/memberList";
import Chart from "./components/chart";
import { useUser } from "@/providers/User";
import Link from "next/link";
import { Server, Share2, Users } from "lucide-react";
import { MdMonetizationOn } from "react-icons/md";
import { ClipLoader } from "react-spinners";

interface Member {
  id: string;
  email: string;
  userName: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  position: string; 
  sharedApps: any;
  tokens: number;
}

const Anlaytics: React.FC = () => {

  const user = useUser() as User | null;
  const [memberData, setMemberData] = useState<Member[]>([]);
  const [membersLength, setMembersLength] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const getUser = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/onboarded-members-list`
        );
        const data = await getUser.json();
        setMembersLength(data?.data?.length);
        setMemberData(data.data || []);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally{
        setLoading(false);
      }
    };
    fetchMembers();
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <ClipLoader color="#ffffff" loading={loading} size={50} />
      </div>
    )
  }

  return (
    <>
      {/* <Head> */}
        {/* <title>Enterprise Dashboard</title> */}
      {/* </Head> */}
      <main className="p-0 md:p-6  min-h-screen">
        <h1 className="text-2xl font-semibold mb-6 text-white">Hii, {user?.name}👋</h1>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card title="Apps Shared" value={user?.sharedApps || 0} description="Total apps shared with collaborators" icon={<Share2 />} />
          <Card title="API Consumption" value="5,000 req/day" description="Current average daily requests" icon={<Server />}/>
          <Card title="Total Consumption" value={`${user?.tokens || 0} tokens`} description="Total Joule consumption" icon={<MdMonetizationOn className=" h-7 w-7 "/>}/>
          <Card title="Team" value={`${membersLength} members`} description="Active Team Members" icon={<Users />}/>
          <Card title="Collaborators" value={`${membersLength} members`} description="Active members collaborating" icon={<Users />}/>
        </section>
        <section  className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2"><Users /> Team Collaboration</h2>
          {
            memberData.length === 0 && user? (
              <div className="justify-center mx-auto mt-5 py-10 h-72 bg-indigo-900/[0.4] border-dashed border-2 border-muted-foreground rounded-lg flex items-center flex-col">
                <p className="text-gray-400">
                No members onboarded. You may need to invite collaborators.
                </p>
                <Link href="/dashboard/onboard-user">
                  <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Onboard Member
                  </button>
                </Link>
              </div>
            ) : (
              <MemberTable memberData={memberData}/>
            )
          }
        </section>
        {/* <section>
          <h2 className="text-xl font-semibold mb-4 text-white">Usage Insights</h2>
          <Chart />
        </section> */}
      </main>
    </>
  );
};

export default Anlaytics;
