import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleGoToAdmin = () => {
    navigate("/admin/users");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1 className="navbar-title">Mini Food Ordering</h1>
        <div className="navbar-right">
          <span className="user-name">Welcome, {user.username}!</span>
          {user.role === "ADMIN" && (
            <button onClick={handleGoToAdmin} className="admin-button">
              Admin Panel
            </button>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to Mini Food Ordering System</h2>
          <p>
            You are successfully logged in as: <strong>{user.email}</strong>
          </p>
          <p>
            Your role: <strong>{user.role}</strong>
          </p>
        </div>

        <div className="coming-soon">
          <h3>Coming Soon...</h3>
          <p>
            Features like food menu, shopping cart, and orders will be available
            soon!
          </p>
        </div>
      </div>
    </div>
  );
}
