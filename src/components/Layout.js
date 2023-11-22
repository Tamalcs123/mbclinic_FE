import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Layout.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { Avatar, Badge } from "antd";
const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-2-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
    },
  ];

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-2-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-2-line",
    },
    {
      name: "Users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctorslist",
      icon: "ri-user-heart-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 style={{ color: "whitesmoke" }}>MB</h2>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                  key={menu.name}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className="d-flex menu-item"
              key={"logout"}
              onClick={() => {
                dispatch(logout());
                localStorage.clear();
                navigate("/login");
              }}
            >
              <i className="ri-logout-box-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <span>
              {collapsed ? (
                <i
                  className="ri-menu-2-line header-action-icon"
                  onClick={() => setCollapsed(!collapsed)}
                ></i>
              ) : (
                <i
                  className="ri-close-line header-action-icon"
                  onClick={() => setCollapsed(!collapsed)}
                ></i>
              )}
            </span>
            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotifications?.length}
                style={{ marginRight: "15px" }}
              >
                <i
                  className="ri-notification-fill header-action-icon px-3"
                  onClick={() => navigate("/notifications")}
                />
              </Badge>

              {user ? (
                <Link className="anchor" to={`/doctor/profile/${user._id}`}>
                  {user.name} ({role})
                </Link>
              ) : (
                "Guest"
              )}
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
