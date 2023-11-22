import React from "react";
import Layout from "../components/Layout";
import { Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { environment } from "../environment/environment";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";

const Notifications = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        environment.apiUrl + "/api/user/mark-all-notifications-as-seen",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };
  const deleteAllNotifications = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        environment.apiUrl + "/api/user/delete-all-notifications",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };
  return (
    <Layout>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Unseen",
            key: "1",
            children: (
              <>
                <div className="d-flex justify-content-end">
                  <h1 className="anchor" onClick={() => markAllAsSeen()}>
                    Mark as all seen
                  </h1>
                </div>
                {user?.unseenNotifications.map((notifications, index) => (
                  <div
                    className="card p-2"
                    onClick={() => navigate(notifications?.onClickPath)}
                    key={index}
                  >
                    <div className="card-text">{notifications?.message}</div>
                  </div>
                ))}
              </>
            ),
          },
          {
            label: "Seen",
            key: "2",
            children: (
              <>
                <div className="d-flex justify-content-end">
                  <h1
                    className="anchor"
                    onClick={() => deleteAllNotifications()}
                    style={{ cursor: "pointer" }}
                  >
                    Delete All
                  </h1>
                </div>
                {user?.seenNotifications.map((notifications, index) => (
                  <div
                    className="card p-2"
                    style={{ cursor: "pointer" }}
                    key={index}
                  >
                    <div className="card-text">{notifications?.message}</div>
                  </div>
                ))}
              </>
            ),
          },
        ]}
      />
    </Layout>
  );
};

export default Notifications;
