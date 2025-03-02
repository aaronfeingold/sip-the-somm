import React from "react";
import { SipOwl } from "@/components/SipOwl";

interface SidebarHeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  title?: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isSidebarOpen,
  toggleSidebar,
  title = "Somm-In-Palm",
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        <SipOwl
          isExpanded={false}
          className="cursor-pointer h-12 w-12"
          onClick={toggleSidebar}
        />
        {isSidebarOpen && (
          <div
            className={`transition-all duration-300 overflow-hidden whitespace-nowrap font-medium text-pink-100
           w-auto
        `}
          >
            {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
