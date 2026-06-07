"use client";

import { useState, useEffect } from "react";
import { Home, BarChart2, Users, Megaphone, Settings } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function Sidebar() {
  const { activeTab, setActiveTab, t } = useDashboard();
  const [width, setWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Load width preference from localStorage on mount
  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    if (savedWidth) {
      setWidth(parseInt(savedWidth, 10));
    }
  }, []);

  // Sync media query listener to check if desktop
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Save width preference on mouse up / drag completion
  useEffect(() => {
    if (!isResizing && isDesktop) {
      localStorage.setItem("sidebarWidth", width.toString());
    }
  }, [isResizing, width, isDesktop]);

  // Handle resizing mouse events
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      if (newWidth < 140) {
        setWidth(80);
      } else {
        const clampedWidth = Math.max(180, Math.min(newWidth, 450));
        setWidth(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Disable text selection and change cursor for the entire document while resizing
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  };

  const isCollapsed = isDesktop ? width < 180 : false;

  return (
    <aside
      className="relative flex flex-col items-center lg:items-start border-r border-sidebar-border bg-sidebar h-full py-6 transition-colors duration-300 flex-shrink-0"
      style={{
        width: isDesktop ? `${width}px` : undefined,
      }}
    >
      {/* Brand Logo Header */}
      <div
        className={`flex items-center gap-3 mb-10 w-full transition-all duration-300 ${
          isCollapsed ? "px-0 justify-center" : "px-6 justify-start"
        }`}
      >
        <img 
          src="/logo.png" 
          alt="Arca Logo" 
          className="w-10 h-10 object-contain flex-shrink-0 drop-shadow-md" 
        />
        {!isCollapsed && (
          <span className="hidden lg:block text-xl font-bold tracking-wide text-brand-red whitespace-nowrap overflow-hidden text-ellipsis">
            Arca <span className="text-text-bright font-semibold">Predicte</span>
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav
        className={`flex flex-col gap-2 w-full flex-1 transition-all duration-300 ${
          isCollapsed ? "px-2" : "px-2 lg:px-4"
        }`}
      >
        <NavItem
          icon={<Home size={22} />}
          label={t.sidebar.home}
          active={activeTab === "Home"}
          onClick={() => setActiveTab("Home")}
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Users size={22} />}
          label={t.sidebar.users}
          active={activeTab === "Users"}
          onClick={() => setActiveTab("Users")}
          isCollapsed={isCollapsed}
        />
      </nav>

      {/* Resize Handle */}
      {isDesktop && (
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize select-none z-50 group/handle"
        >
          <div
            className={`w-[2px] h-full mx-auto transition-colors duration-200 ${
              isResizing
                ? "bg-brand-red bg-opacity-100"
                : "bg-transparent group-hover/handle:bg-brand-red group-hover/handle:bg-opacity-50"
            }`}
          />
        </div>
      )}
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
  isCollapsed,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center rounded-xl transition-all duration-200 group ${
        isCollapsed
          ? "p-3 justify-center w-12 h-12 mx-auto"
          : "flex-col lg:flex-row gap-1 lg:gap-3 p-3 lg:px-4 lg:py-3 w-full justify-center lg:justify-start"
      } ${
        active
          ? "bg-brand-red-muted text-brand-red shadow-sm border border-brand-red-border"
          : "text-text-muted hover:text-text-bright hover:bg-hover"
      }`}
      title={isCollapsed ? label : undefined}
    >
      <div className={`${active ? "text-brand-red" : "text-text-muted group-hover:text-brand-red transition-colors flex-shrink-0"}`}>
        {icon}
      </div>
      {!isCollapsed && (
        <span className="text-[10px] lg:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </span>
      )}
    </a>
  );
}

