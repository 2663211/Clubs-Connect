import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";
import { handleLogout } from "./Auth";

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <article className="dashboard">
      <header className="StudentHeader">
        <h1>Clubs Connect</h1>
        <nav>
          <ul className="nav-links">
            <li>
              <button
                onClick={() => navigate("/profile")}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={async () => {
                  await handleLogout();
                  navigate("/auth");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <h1>Student Dashboard</h1>

        <p>
          Welcome, student! Here you can view your clubs, events, and updates.
        </p>
      </main>
    </article>
  );
}
