"use client";

import Link from "next/link";
import {      
  BotIcon,
  PenLine,
  FlaskConicalIcon, 
  Globe,
  GraduationCapIcon, 
  LayoutDashboard,  
  Menu, 
  Settings,
  PiIcon    
} from "lucide-react";

import {
  useParams, 
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useState } from "react";

import Image from "next/image";
import { FileCode, Github } from "lucide-react";

const externalLinks = [
  {
    name: "General System Survey",
    href: "https://forms.office.com/pages/responsepage.aspx?id=X0uGSDo0kk6r9krp4t-FvK_KJIDN-O9InpKi1LLbpoxUMFBXR0NDTVBUVkExSzRCQjlTVDVEWUVERy4u&web=1&wdLOR=cE658E616-B3B4-47C0-8C20-0D4BCCC5DDB9",
    icon: <PenLine width={18} />,
  },
  {
    name: "Learning Center",
    href: "https://altitude80.com",
    icon: <GraduationCapIcon width={18} />,
  },
  {
    name: "Code Repositories",
    href: "https://github.com/altitude80ai",
    icon: <Github width={18} />,
  },
  {
    name: "Modernization Research",
    href: "https://example.com",
    icon: <FileCode width={18} />,
  },
  {
    name: "AI Question and Answer",
    href: "https://example.com",
    icon: <BotIcon width={18} />,
  },
  {
    name: "AI Testing Center",
    href: "https://example.com",
    icon: <FlaskConicalIcon width={18} />,
  },
  {
    name: "Metrics",
    href: "https://example.com",
    icon: <PiIcon width={18} />,
  },
];



export default function Nav({ children }: { children: ReactNode }) {
  
   const [showSidebar, setShowSidebar] = useState(false);

  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };
 

  
  const mainTabs = [
    {
      name: "Command Center",
      href: "/",
      isActive: segments.length === 0,
      icon: <LayoutDashboard width={18} />,
    },
    {
      name: "Projects",
      href: "/projects",
      isActive: segments[0] === "projects",
      icon: <Globe width={18} />,
    },    
    {
      name: "Account Settings",
      href: "/settings",
      isActive: segments[0] === "settings",
      icon: <Settings width={18} />,
    }
    
  ];
 
  let  tabs = [...mainTabs ]  

  return (
    <>   
      <button
        className={`fixed z-20 ${
          // left align for Editor, right align for other pages
          segments[0] === "post" && segments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7"
        } sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } fixed z-10 flex h-full w-full flex-col justify-between border-r border-stone-200 bg-black p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <a
              href="https://strategicmachines.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              <Image
                src="https://res.cloudinary.com/stratmachine/image/upload/v1593540010/machine/sm_xlprlu.png"
                width={24}
                height={24}
                alt="Logo"
                className="dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
              />
            </a>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out 
                 ${isActive ? "bg-blue-500 text-white dark:bg-blue-700" : "hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white dark:text-gray-300"}`}
              > 
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-blue-500 hover:text-white dark:text-gray-300 dark:hover:bg-blue-700 dark:hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          {children}
        </div>
      </div>    
    </>
  );
}
