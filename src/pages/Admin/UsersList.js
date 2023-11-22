import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { environment } from "../../environment/environment";
import toast from "react-hot-toast";
import { Table } from "antd";
import moment from "moment";

const UsersList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const getUsersData = async (req, res) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        environment.apiUrl + "/api/admin/get-all-users",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };
  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-title">Users List</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
};

export default UsersList;
