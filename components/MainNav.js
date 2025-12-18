// components/MainNav.js
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function MainNav() {
  const { user, logout } = useAuth();

  return (
    <header className="eg-header">
      <Link href="/dashboard" className="eg-brand">
  EasyGrade
</Link>

      <nav className="eg-nav">
        <Link href="/grade" className="eg-nav-link">
          Grade Essay
        </Link>

        <Link href="/rubric-builder" className="eg-nav-link">
          Rubric Builder
        </Link>

        {!user ? (
          <Link href="/login" className="eg-nav-login">
            Login
          </Link>
        ) : (
          <>
            <Link href="/dashboard" className="eg-nav-link">
              Dashboard
            </Link>
            <button className="eg-nav-login" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
