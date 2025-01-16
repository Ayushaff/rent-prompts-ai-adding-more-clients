import React from "react";

import { getUserRole } from "@/utilities/getSeverSideUserRole";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Publicrapp from "@/components/PublicRapp/PublicRapp";
import { getMeUser } from "@/utilities/getMeUser";


const Public = async() => {
  const nextCookies = cookies()
  const role = getUserRole(nextCookies)

  if (!role || role === 'null') {
    redirect('/auth/signIn');
  }
  let createPermissions = false;
    if (role === "entUser") {
      try {
        const { user } = await getMeUser();
        createPermissions = user?.createRappPermission || false;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  return (
    <>
      {role === 'entAdmin' && <Publicrapp />}
      {role === 'admin' && <Publicrapp />}
      {role === 'entUser' && createPermissions && <Publicrapp />}
      {role === 'entUser' && !createPermissions && <div className="text-2xl font-semibold text-center mt-10">You don&apos;t have permission to create a Rapp.</div>}
      {/* {role === 'professional' && <Publicrapp />} */}
      {role === 'user' && <Publicrapp />}
    </>
  );
};

export default Public;
