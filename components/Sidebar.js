// components/Sidebar.js
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "space_dashboard",
    },
    {
      label: "Grade Essay",
      href: "/",
      icon: "edit_note",
    },
    {
      label: "Rubric Builder",
      href: "/rubric-builder", // future page
      icon: "fact_check",
    },
  ];

  const isActive = (href) => router.pathname === href;

  return (
    <aside className={`eg-sidebar ${collapsed ? "eg-sidebar--collapsed" : ""}`}>
      {/* Top brand + collapse toggle */}
      <div className="eg-sidebar-top">
        {!collapsed && <div className="eg-sidebar-logo">EasyGrade</div>}
        <button
          type="button"
          className="eg-sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-rounded">
            {collapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>
      </div>

      {/* Navigation links */}
      <nav className="eg-sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} legacyBehavior>
            <a
              className={`eg-sidebar-link ${
                isActive(item.href) ? "eg-sidebar-link--active" : ""
              }`}
            >
              <span className="material-symbols-rounded eg-sidebar-icon">
                {item.icon}
              </span>
              {!collapsed && <span className="eg-sidebar-label">{item.label}</span>}
            </a>
          </Link>
        ))}
      </nav>

      {/* Bottom: Upgrade + Logout */}
      <div className="eg-sidebar-footer">
        <button
          type="button"
          className="eg-sidebar-upgrade"
          onClick={() => router.push("/billing")}
        >
          <span className="material-symbols-rounded eg-sidebar-icon">
            workspace_premium
          </span>
          {!collapsed && (
            <span className="eg-sidebar-label">
              Upgrade to <span className="eg-tag-pro">Pro</span>
            </span>
          )}
        </button>

        <button
          type="button"
          className="eg-sidebar-link eg-sidebar-logout"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <span className="material-symbols-rounded eg-sidebar-icon">
            logout
          </span>
          {!collapsed && <span className="eg-sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
