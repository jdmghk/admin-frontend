"use client";

import * as React from "react";
import {
  AudioWaveform,
  Banknote,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  ScanBarcodeIcon,
  Ticket,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Session } from "next-auth";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Tickets",
      url: "/dashboard",
      icon: Ticket,
      isActive: true,
      items: [
        {
          title: "Types",
          url: "/dashboard/tickets",
        },
      ],
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: Banknote,
      items: [
        {
          title: "Overview",
          url: "/dashboard/transactions",
        },
      ],
    },
    {
      title: "Checkin",
      url: "#",
      icon: ScanBarcodeIcon,
      items: [
        {
          title: "QR Scan",
          url: "#",
        },
        {
          title: "Credentails",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Support",
          url: "mailto:tickets@lifewithallin.com",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {props.session.user && (
          <NavUser
            user={{
              name: props.session.user.name ?? "",
              email: props.session.user.email ?? "",
              avatar: props.session.user.image,
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
