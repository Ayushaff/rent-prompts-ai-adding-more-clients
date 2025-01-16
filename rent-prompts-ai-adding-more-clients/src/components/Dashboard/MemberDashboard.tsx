"use client";
import {
  Aperture,
  Box,
  Combine,
  Kanban,
  Plus,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const MemberDashboard = ({createRappPermission}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 flex flex-col gap-4 bg-indigo-800 shadow-2xl">
        <div className="flex flex-row gap-2 items-center">
          <h2 className="text-4xl">Create</h2>
          <div className="bg-indigo-900 rounded-full p-0.5">
            <Plus width={28} height={28} />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card
            title="Private AI App (Rapp)"
            description="Manage private apps with secure settings and team access control"
            href="/dashboard/rapps/create/private"
            Icon={Box}
            disabled={!createRappPermission}
          />
          <Card
            title="Public AI App (Rapp)"
            description="Manage public apps with secure settings and team access control"
            href="/dashboard/rapps/create/public"
            Icon={Box}
            disabled={!createRappPermission}
          />
          <Card
            title="Agent"
            description="Coming Soon"
            href=""
            Icon={Aperture}
            disabled={true}
          />
          <Card
            title="Remix"
            description="Coming Soon"
            href=""
            Icon={Combine}
            disabled={true}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 flex flex-col md:flex-row gap-6 bg-indigo-800 shadow-2xl">
          <Card
            title="Projects"
            description="Manage cards"
            href="/dashboard/projects"
            Icon={Kanban}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, description, Icon, href, disabled }) => {
  return (
    <Link
      href={href}
      className={`w-full p-4 rounded-xl relative overflow-hidden group shadow-lg  bg-gradient-to-br from-black/[0.3] via-black/[0.1] to-black/[0.4] transform transition duration-500 hover:scale-105 hover:shadow-xl backdrop-blur-sm  before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.indigo.800),theme(colors.indigo.700),theme(colors.indigo.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] h-full
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl"}`}
    >
      <Icon className="mb-2 text-2xl text-white group-hover:text-white transition-colors relative z-10 duration-300" />
      <h3 className="font-medium text-lg text-white group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300 break-normal whitespace-normal line-clamp-2">
        {description}
      </p>
    </Link>
  );
};

export default MemberDashboard;
