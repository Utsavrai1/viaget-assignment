import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { useAuthStore } from "@/zustand/auth";

const Header: React.FC = () => {
  const { token, clearToken } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-primary text-primary-foreground">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center dark:bg-zinc-950 dark:text-zinc-50">
        <Link to="/" className="text-2xl font-bold">
          Book Review App
        </Link>
        <ul className="flex space-x-4 items-center">
          {token ? (
            <>
              <li>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </li>
            </>
          )}
          <li>
            <ModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
