import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import axios from "axios";
import { environment } from "../environment/environment";
import toast from "react-hot-toast";
import { Table } from "antd";
import moment from "moment";

const Appointments = () => {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);

  const getAppointmentsData = async (req, res) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        environment.apiUrl + "/api/user/get-appointments-by-user-id",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Doctor Name",
      dataIndex: "name",
      render: (text, record) => (
        <span className="normal-text">
          {record.doctorInfo?.firstName} {record.doctorInfo?.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <span className="normal-text">{record.doctorInfo?.phoneNumber}</span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span className="normal-text">
          {moment(record.date).format("DD-MM-YYYY")}  {moment(record.time).format("HH:mm")}
         
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  useEffect(() => {
    getAppointmentsData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;
