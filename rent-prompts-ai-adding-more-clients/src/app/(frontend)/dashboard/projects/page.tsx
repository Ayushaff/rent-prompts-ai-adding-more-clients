import MemberProductList from "@/components/ui/Project/MemberProjectList";
import ProductList from "@/components/ui/Project/ProjectListing";
import UserProjectListing from "@/components/ui/Project/UserProjectListing";
import { getMeUser } from "@/utilities/getMeUser";
import { getUserRole } from "@/utilities/getSeverSideUserRole";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";


const Projects: React.FC =async () => {
  const nextCookies = cookies()
  const role = getUserRole(nextCookies)

  if(role == 'null' || !role){
    redirect('/auth/signIn')
  }

  let createPermissions = false;
  if (role === "entUser") {
    try {
      const { user } = await getMeUser();
      createPermissions = user?.createRappPermission || false;
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error (e.g., redirect or show an error message)
    }
  }

  return (
    <div className="md:p-4 flex flex-col gap-4 mt-5 md:bg-indigo-800 md:shadow-2xl">
      
      {role === 'entAdmin' && <ProductList  />}
      {role === 'admin' && <ProductList  />}
      {role === 'entUser' && <MemberProductList createRappPermission={createPermissions} />}
      {role === 'professional' && <UserProjectListing />}
      {role === 'user' && <UserProjectListing />}

    </div>
  );
};

export default Projects;
