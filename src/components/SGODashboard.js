import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SGODashboard.css";
import { handleLogout } from "./Auth";
import { supabase } from "../supabaseClient";

export default function SGODashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [_error, _setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null); // which row dropdown is open
  const [roleMenuIndex, setRoleMenuIndex] = useState(null); // which nested role menu is open
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    userIndex: null,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, role, avatar_url")
          .order("full_name", { ascending: true });

        if (error) {
          console.error("Supabase error:", error.message);
        }

        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleMenu = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const toggleRoleMenu = (index) => {
    setRoleMenuIndex(roleMenuIndex === index ? null : index);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-row")) {
        setActiveIndex(null);
        setRoleMenuIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleChangeRole = async (index, newRole) => {
    try {
      const user = users[index];

      // Update in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", user.id); // we need if because it is unique. 2 people can have the same name

      if (error) {
        console.error("Error updating role:", error.message);
        return;
      }

      // Update local state
      const updatedUsers = [...users];
      updatedUsers[index].role = newRole;
      setUsers(updatedUsers);

      // Close menus
      setRoleMenuIndex(null);
      setActiveIndex(null);
    } catch (err) {
      console.error("Unexpected error updating role:", err);
    }
  };

  const handleDelete = async (index) => {
    const user = users[index];

    if (!user) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.full_name}'s profile?`
    );

    if (!confirmDelete) return;

    try {
      // Delete the profile from Supabase
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) {
        console.error("Error deleting profile:", error.message);
        return;
      }

      // Remove the user from local state so UI updates instantly
      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      setUsers(updatedUsers);

      // Close dropdown
      setActiveIndex(null);
      setRoleMenuIndex(null);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <article className="dashboard">
      <header className="DashboardHeader">
        <h1>Clubs Connect</h1>
        <nav>
          <ul className="nav-links">
            <li>
              <button
                onClick={() => navigate("/dashboard/sgo")}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/entities/sgo")}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Entities
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/profile/sgo")}
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

      <main className="content">
        <h1>User Management</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <section className="user-container">
            {/* Header Row */}
            <header className="user-header">
              <span className="avatar-col">
                <span className="header-text avatar-text">Avatar</span>
              </span>
              <span className="name-col">
                <span className="header-text name-text">Name</span>
              </span>
              <span className="role-col">
                <span className="header-text role-text">Role</span>
              </span>
              <span></span> {/* empty span for menu column */}
            </header>

            {/* User Rows */}
            <ul className="user-list">
              {users.map((user, index) => (
                <li
                  key={user.id}
                  className={`user-row ${activeIndex === index ? "show" : ""}`}
                >
                  <span>
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={`${user.full_name} avatar`}
                        className="avatar"
                      />
                    ) : (
                      <span className="avatar-placeholder">
                        {user.full_name[0]}
                      </span>
                    )}
                  </span>
                  <span>{user.full_name}</span>
                  <span>{user.role}</span>
                  <button
                    className="menu-btn"
                    onClick={() => toggleMenu(index)}
                    aria-label="Actions"
                  >
                    ...
                  </button>

                  {/* Only render dropdown if this row is active */}
                  {activeIndex === index && (
                    <ul className="dropdown-menu">
                      <li>
                        <button onClick={() => toggleRoleMenu(index)}>
                          Change Roles
                        </button>

                        {/* Nested role menu */}
                        {roleMenuIndex === index && (
                          <ul className="nested-menu">
                            <li className="nested-header">Choose Role</li>
                            <li>
                              <button
                                onClick={() =>
                                  handleChangeRole(index, "student")
                                }
                              >
                                Student
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleChangeRole(index, "exec")}
                              >
                                Exec
                              </button>
                            </li>
                          </ul>
                        )}
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            setDeleteModal({ open: true, userIndex: index })
                          }
                        >
                          Delete Profile
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.open && (
          <aside className="modal-overlay" role="dialog" aria-modal="true">
            <section className="modal">
              <header>
                <h2>Confirm Deletion</h2>
              </header>
              <p>
                Are you sure you want to delete{" "}
                {users[deleteModal.userIndex]?.full_name}&apos;s profile?
              </p>
              <footer className="modal-actions">
                <button onClick={() => handleDelete(deleteModal.userIndex)}>
                  Yes, Delete
                </button>
                <button
                  onClick={() =>
                    setDeleteModal({ open: false, userIndex: null })
                  }
                >
                  Cancel
                </button>
              </footer>
            </section>
          </aside>
        )}
      </main>
    </article>
  );
}
