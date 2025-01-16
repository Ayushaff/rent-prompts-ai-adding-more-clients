
import React from "react";
import OnboardUser from "./components/UserOnboard";
import { cookies } from "next/headers";
import { getUserRole } from "@/utilities/getSeverSideUserRole";
import { redirect } from "next/navigation";


const Onboard: React.FC = () => {
  const nextCookies = cookies()
  const role = getUserRole(nextCookies)

  if (!role || role === 'null') {
    redirect('/auth/signIn');
  }

  return (
    <div>
      {role === 'entAdmin' && <OnboardUser />}
      {(role === 'entUser' || role === 'professional' || role === 'user' || role === 'admin') &&
        <div className="text-2xl font-bold text-center mt-20">Only Enterprise can Onboard members</div>}
    </div>
  );
};

export default Onboard;
