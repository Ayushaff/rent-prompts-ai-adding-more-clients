"use client";
import React, { useState } from "react";
import { IconArrowLeft, IconUserBolt } from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "../../SideBar";
import { Box, Kanban, LayoutDashboard, LogOut, Users, BarChart } from "lucide-react";
import { Icons } from "../Icons";
import { useUser } from "@/providers/User";
import { toast } from "sonner";


export function SidebarComponent() {
  const [open, setOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const user = useUser()

  const handleLogout = async() => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await req.json();
      if(req.ok){
        toast.success("Logout Successfully");
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <IconUserBolt className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: (
        <Kanban className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    ...(user?.role === "entAdmin" || user?.role === "admin"
      ? [
          {
            label: "Team",
            href: "/dashboard/onboard-user",
            icon: (
              <Users className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
          },
          {
            label: "Analytics",
            href: "/dashboard/analytics",
            icon: (
              <BarChart className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
          },
        ]
      : []),
    {
      label: "Models",
      href: "/dashboard/models",
      icon: (
        <Box className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    // {
    //   label: "Logout",
    //   href: "/",
    //   icon: (
    //     <IconArrowLeft className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
  ];



  return (
    <>
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-2">
            <SidebarLink
              link={{
                label: (
                  <div className="italic font-semibold text-xl mb-2 ">
                    RENTPROMPTS
                  </div>
                ),
                href: "/",
                icon: (
                  <Icons.logo
                    className="text-white dark:text-neutral-200 h-7 w-7 flex-shrink-0 mb-2 "
                    fill="white"
                  />
                ),
              }}
            />
            {
              links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))
            }
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "rentprompts.com",
              href: "https://rentprompts.com/",
              icon: <Icons.logo width={17} fill="white" />,
              target: "_blank"
            }}
          />
          <SidebarLink
            onLogoutClick={() => setShowConfirmModal(true)}
            link={{
              label: "Logout",
              href: "#",
              icon: <LogOut className="text-warning dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
    {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-72 md:w-96">
            <h2 className="text-lg font-semibold text-black">Confirm Logout</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure want to logout?
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleLogout();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
