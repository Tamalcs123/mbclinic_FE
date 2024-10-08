import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { environment } from "../../environment/environment";
import toast from "react-hot-toast";
import { Table } from "antd";
import moment from "moment";

const DoctorsList = () => {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);

  const getDoctorsData = async (req, res) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        environment.apiUrl + "/api/admin/get-all-doctors",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        environment.apiUrl + "/api/admin/change-doctor-account-status",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span className="normal-text">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              Approve
            </h1>
          )}
          {record.status === "approved" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "blocked")}
            >
              Block
            </h1>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-title">Doctors List</h1>
      <Table columns={columns} dataSource={doctors}  pagination={{ pageSize: 7 }}/>
    </Layout>
  );
};

export default DoctorsList;
