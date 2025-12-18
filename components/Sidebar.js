// components/Sidebar.js
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function Sidebar({ isPremium }) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleProClick = () => {
    if (isPremium) {
      router.push("/account"); // manage account
    } else {
      router.push("/upgrade"); // upgrade flow
    }
  };

  return (
    <aside className={`eg-sidebar ${collapsed ? "eg-sidebar--collapsed" : ""}`}>
      {/* TOP */}
      <div>
        <div className="eg-sidebar-top">
          {!collapsed && (
            <a
              href="/grade"
              className="eg-sidebar-logo"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              EasyGrade
            </a>
          )}

          <button
            className="eg-sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? ">" : "<"}
          </button>
        </div>

        {/* NAV */}
        <nav className="eg-sidebar-nav">
          <Link href="/dashboard" className="eg-sidebar-link">
            <span className="material-symbols-rounded eg-sidebar-icon">
              dashboard
            </span>
            {!collapsed && <span className="eg-sidebar-label">Dashboard</span>}
          </Link>

          <Link href="/grade" className="eg-sidebar-link">
            <span className="material-symbols-rounded eg-sidebar-icon">
              edit
            </span>
            {!collapsed && <span className="eg-sidebar-label">Grade Essay</span>}
          </Link>

          <Link href="/rubric-builder" className="eg-sidebar-link">
            <span className="material-symbols-rounded eg-sidebar-icon">
              widgets
            </span>
            {!collapsed && (
              <span className="eg-sidebar-label">Rubric Builder</span>
            )}
          </Link>

          {/* ONLY TEXT CHANGE HERE */}
          <Link href="/rubric-library" className="eg-sidebar-link">
            <span className="material-symbols-rounded eg-sidebar-icon">
              folder
            </span>
            {!collapsed && (
              <span className="eg-sidebar-label">Rubric Library</span>
            )}
          </Link>
        </nav>
      </div>

      {/* FOOTER */}
      <div className="eg-sidebar-footer">
        {/* PRO ACCOUNT / UPGRADE */}
        <button
          onClick={handleProClick}
          className="eg-sidebar-upgrade"
        >
          <span className="material-symbols-rounded eg-sidebar-icon">
            workspace_premium
          </span>
          {!collapsed && (
            <span className="eg-sidebar-label">
              {isPremium ? "Pro Account" : "Upgrade to Pro"}
            </span>
          )}
        </button>

        {/* LOGOUT */}
        <button
          className="eg-sidebar-link eg-sidebar-logout"
          onClick={handleLogout}
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
