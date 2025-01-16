import HeroDashboard from '@/components/Dashboard/HoverDevCard'
import MemberDashboard from '@/components/Dashboard/MemberDashboard'
import React from 'react'
import { cookies } from 'next/headers'
import { getUserRole } from '@/utilities/getSeverSideUserRole'
import { redirect } from 'next/navigation'
import { getMeUser } from '@/utilities/getMeUser'
import UserDashboard from '@/components/Dashboard/userDashboard'
// import { migrateModels, migrateRapps, migrateUsers } from '@/utilities/db_scripts'

const Dashboard: React.FC =async () => {
  const nextCookies = cookies()
  const role = getUserRole(nextCookies)

  let createPermissions = false;
  if (role === "entUser") {
    try {
      const { user } = await getMeUser();
      createPermissions = user?.createRappPermission || false;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  if (!role || role === 'null') {
    redirect('/auth/signIn');
  }

  //   migrateRapps()
  // .then(() => {
  //   console.log('Migration completed successfully.');
  // })
  // .catch((err) => {
  //   console.error('Migration failed:', err);
  // });
  
  // migrateUsers()
  // .then(() => {
  //   console.log('Migration completed successfully.');
  // })
  // .catch((err) => {
  //   console.error('Migration failed:', err);
  // });

  // migrateModels()
  // .then(() => {
  //   console.log('Migration completed successfully.');
  // })
  // .catch((err) => {
  //   console.error('Migration failed:', err);
  // });

  return (
    <div>
      {role === 'entAdmin' && <HeroDashboard />}
      {role === 'entUser' && <MemberDashboard createRappPermission={createPermissions}/>}
      {role === 'professional' && <UserDashboard />}
      {role === 'admin' && <HeroDashboard />}
      {role === 'user' && <UserDashboard />}
    </div>
  )
}

export default Dashboard
