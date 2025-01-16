import { IconUserBolt } from "@tabler/icons-react";
import { Aperture, Box, Combine, Kanban, Plus, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeroDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 flex flex-col gap-4 bg-indigo-800 shadow-2xl">
        <div className="flex flex-row gap-2 items-center">
          <h2 className="text-4xl">Create</h2>
          {/* <div className="bg-indigo-900 rounded-full p-0.5">
            <Plus width={28} height={28} />
          </div> */}
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card
            title="Private AI App (Rapp)"
            description="Manage private apps with secure settings and team access control"
            href="/dashboard/rapps/create/private"
            Icon={Box}
            disabled={false}
          />
          <Card
            title="Public AI App (Rapp)"
            description="Create public apps with customizable permissions and user interactions."
            href="/dashboard/rapps/create/public"
            Icon={Box}
            disabled={false}
          />
          <Card
            title="Agent (Coming Soon)"
            description="Create and manage your agent's performace and efficiency."
            href="/dashboard"
            Icon={Aperture}
            disabled={true}
          />
          <Card
            title="Remix (Coming Soon)"
            description="Create and manage customizable rapps with dynamic output."
            href="/dashboard"
            Icon={Combine}
            disabled={true}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-1">
        <div className="p-4 flex flex-col md:flex-row gap-6 bg-indigo-800 shadow-2xl">
          <Card
            title="Onboard Team"
            description="Easily onboard new team members by guiding them through the necessary steps and providing essential resources for a smooth integration into the team."
            href="/dashboard/onboard-user"
            Icon={Users}
            disabled={false}
          />
          <Card
            title="Onboard Collaborator"
            description="Easily onboard new collaborator by guiding them through the necessary steps and providing essential resources for a smooth integration into the team."
            href="/dashboard/onboard-user"
            Icon={IconUserBolt}
            disabled={false}
          />
        </div>
      </div>
      <div className="p-4 flex flex-col md:flex-row gap-6 bg-indigo-800 shadow-2xl">
      <Card
            title="Projects"
            description="Organize and track progress on your ongoing projects. Use advanced tools to manage tasks, milestones, and team collaboration for effective productivity."
            href="/dashboard/projects"
            Icon={Kanban}
            disabled={false}
          />
      </div>
    </div>
  );
};

const Card = ({ title, description, Icon, href, disabled }) => {
  return (
    <Link
      href={href}
      className={`w-full p-4 rounded-xl relative overflow-hidden group shadow-lg  bg-gradient-to-br from-black/[0.3] via-black/[0.1] to-black/[0.4] transform transition duration-500 hover:scale-105 hover:shadow-xl backdrop-blur-sm  before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.indigo.800),theme(colors.indigo.700),theme(colors.indigo.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] h-full ${disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:scale-105 hover:shadow-xl"
}`}
    >
      <Icon className="mb-2 text-2xl text-white group-hover:text-white transition-colors relative z-10 duration-300" />
      <h3 className="font-medium md:text-lg text-white group-hover:text-white relative z-10 duration-300 break-normal whitespace-normal">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300 break-normal whitespace-normal line-clamp-2 text-sm md:text-md">
        {description}
      </p>
    </Link>
  );
};

export default HeroDashboard;
