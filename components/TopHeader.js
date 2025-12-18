// components/TopHeader.js
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function TopHeader({ title, subtitle, showGreeting = false }) {
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  const menuItemsRef = useRef([]);

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    profile?.email?.split("@")[0] ||
    "Teacher";

  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    null;

  const isPremium = profile?.is_premium === true;

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="eg-dashboard-header">
      <div>
        <h1 className="eg-dashboard-title">
          {showGreeting ? `Welcome back, ${displayName}` : title}
        </h1>
        {subtitle && (
          <p className="eg-dashboard-subtitle">{subtitle}</p>
        )}
      </div>

      <div className="eg-dashboard-header-right">
        {isPremium ? (
          <span className="eg-premium-pill--pro">Pro</span>
        ) : (
          <button
            className="eg-premium-pill--upgrade"
            onClick={() => router.push("/upgrade")}
          >
            Upgrade
          </button>
        )}

        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <button
            ref={avatarRef}
            className="eg-avatar-button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((v) => !v);
              setTimeout(() => {
                menuItemsRef.current[0]?.focus();
              }, 0);
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="User avatar"
                className="eg-dashboard-avatar-img"
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              role="menu"
              className="eg-dashboard-menu"
              onKeyDown={(e) => {
                const items = menuItemsRef.current;
                const index = items.indexOf(document.activeElement);

                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  items[(index + 1) % items.length]?.focus();
                }

                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  items[
                    (index - 1 + items.length) % items.length
                  ]?.focus();
                }

                if (e.key === "Escape") {
                  setMenuOpen(false);
                  avatarRef.current?.focus();
                }
              }}
            >
              <button
                ref={(el) => (menuItemsRef.current[0] = el)}
                role="menuitem"
                className="eg-dashboard-menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/account");
                }}
              >
                Account settings
              </button>

              <button
                ref={(el) => (menuItemsRef.current[1] = el)}
                role="menuitem"
                className="eg-dashboard-menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/billing");
                }}
              >
                Billing
              </button>

              <div className="eg-dashboard-menu-divider" />

              <button
                ref={(el) => (menuItemsRef.current[2] = el)}
                role="menuitem"
                className="eg-dashboard-menu-item eg-dashboard-menu-logout"
                onClick={logout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
