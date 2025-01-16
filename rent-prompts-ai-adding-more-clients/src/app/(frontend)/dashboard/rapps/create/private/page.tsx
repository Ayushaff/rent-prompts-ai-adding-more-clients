import React from "react";
import Privaterapp from "@/components/PrivateRapp/PrivateRapp";
import { getUserRole } from "@/utilities/getSeverSideUserRole";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMeUser } from "@/utilities/getMeUser";

const Private = async () => {
  const nextCookies = cookies();
  const role = getUserRole(nextCookies);

  // Redirect if no role or role is 'null'
  if (!role || role === "null") {
    redirect("/auth/signIn");
  }

  // Fetch user data if the role is 'member'
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
      {role === 'entAdmin'  && <Privaterapp />}
      {role === 'admin' && <Privaterapp />}
      {role === 'entUser' && createPermissions && <Privaterapp/>}
      {role === 'entUser' && !createPermissions && <div className="text-2xl font-semibold text-center mt-10">You don&apos;t have permission to create a Rapp.</div>}
      {/* {role === 'professional' && <Privaterapp/>} */}
      {role === 'user' && <Privaterapp/>}
    </>
  );
};

export default Private;