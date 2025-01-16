import Anlaytics from "@/components/Analytics/analytics";
import { getUserRole } from "@/utilities/getSeverSideUserRole";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";


const AnalyticsPage: React.FC = () => {
  const nextCookies = cookies()
  const role = getUserRole(nextCookies)

  if(role == 'null' || !role){
    redirect('/auth/signIn')
  }

  return (
    <div className="p-4 flex flex-col gap-4 bg-indigo-800 shadow-2xl">
      
      {role === 'entAdmin' && <Anlaytics />}
      {role === 'admin' && <Anlaytics />}
      {(role === 'entUser' || role === 'professional' || role === 'user') &&
        <div className="text-2xl text-center mt-20 pb-10">404 Page not found</div>}
    </div>
  );
};

export default AnalyticsPage;
