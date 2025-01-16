import ModelList from "@/components/ui/Models/ModelListing";
import { getUserRole } from "@/utilities/getSeverSideUserRole";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";


const Models: React.FC = () => {

  const nextCookies = cookies()
  const role = getUserRole(nextCookies)

  if (!role || role === 'null') {
    redirect('/auth/signIn');
  }

  return (
    <div className="p-4 flex flex-col gap-4 bg-indigo-800 shadow-2xl">
      <ModelList />
    </div>
  );
};

export default Models;
