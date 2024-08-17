import { Children, useEffect, useState } from "react";
import Login from "./Login";
import axios from "axios";
import { environment } from "../environment/environment";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import Doctor from "../components/Doctor";
import { Button, Col, Grid, Row, Table } from "antd";
import toast from "react-hot-toast";
import moment from "moment";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [totalPatients, setTotalPatients] = useState([]);
  console.log("adminAppointments", adminAppointments);

  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        environment.apiUrl + "/api/user/get-all-approved-doctors",
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
      console.log(error);
    }
  };

  const getAppointmentsData = async (req, res) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        environment.apiUrl + "/api/doctor/get-appointments-by-doctor-id",
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

  const fetchUserData = async () => {
    const isAdmin = await localStorage.getItem("isAdmin");
    const isDoctor = await localStorage.getItem("isDoctor");
    setIsAdmin(isAdmin === "true");
    setIsDoctor(isDoctor === "true");
  };

  const changeAppointmentStatus = async (appointmentId, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        environment.apiUrl + "/api/doctor/change-appointment-status",
        {
          appointmentId: appointmentId,
          status: status,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };

  const getAppointmentsDataAdmin = async (req, res) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        environment.apiUrl + "/api/user/get-appointments-admin",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAdminAppointments(response.data.data);
        const toatalPatients = [
          ...new Set(response.data.data.map((item) => item.userId)),
        ];
        console.log("toatalPatients", toatalPatients);
        setTotalPatients(toatalPatients);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchData();
    getAppointmentsData();
    getAppointmentsDataAdmin();
  }, []);

  const filteredAppointments = appointments.filter((item) =>
    moment(item.date).isSame(moment().startOf("day"), "day")
  );

  const filteredAppointmentsAdmin = adminAppointments.filter((item) =>
    moment(item.date).isSame(moment().startOf("day"), "day")
  );

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient Name",
      dataIndex: "name",
      render: (text, record) => (
        <span className="normal-text">{record.userInfo?.name}</span>
      ),
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
          {moment(record.date).format("DD-MM-YYYY")} (
          {moment(record.time).format("HH:mm")})
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  return (
    <Layout>
      <Row gutter={10} style={{ marginTop: "20px" }}>
        {isDoctor ? (
          <>
            <Col span={24} style={{ marginTop: "-20px", marginBottom: "10px" }}>
              {" "}
              <h1 className="page-title">Today's Appointment</h1>
            </Col>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((res) => (
                <Col
                  span={8}
                  xs={24}
                  sm={24}
                  lg={8}
                  style={{ marginBottom: "10px" }}
                  key={res._id}
                >
                  <div
                    className="card p-2"
                    style={{
                      background:
                        "linear-gradient(to bottom, #005555, #f0f0f0)",
                    }}
                  >
                    <h1 className="card-title1" style={{ color: "white" }}>
                      {res?.userInfo?.name}
                    </h1>
                    <hr style={{ marginTop: "0px", marginBottom: "5px" }} />
                    <p style={{ color: "white" }}>
                      <b>Id : </b>
                      {res?._id}
                    </p>
                    <p style={{ color: "white" }}>
                      <b>Email : </b>
                      {res?.userInfo?.email}
                    </p>
                    <p style={{ color: "white" }}>
                      <b>Date & Time : </b>
                      {moment(res?.date).format("DD-MM-YYYY")} (
                      {moment(res?.time).format("HH:mm")})
                    </p>
                    {res?.status === "pending" ? (
                      <Row style={{ marginTop: "5px" }}>
                        <Col span={8}>
                          <Button
                            type="primary"
                            style={{
                              backgroundColor: "#013030",
                              borderColor: "#005555",
                            }}
                            onClick={() =>
                              changeAppointmentStatus(res?._id, "approved")
                            }
                          >
                            Approve
                          </Button>
                        </Col>
                        <Col span={8}>
                          <Button
                            danger
                            onClick={() =>
                              changeAppointmentStatus(res?._id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </Col>
                      </Row>
                    ) : res.status === "approved" ? (
                      <Row style={{ marginTop: "12px" }}>
                        <Col span={24}>
                          <p style={{ color: "#013030" }}>
                            Appointment has been approved
                          </p>
                        </Col>
                      </Row>
                    ) : (
                      <Row style={{ marginTop: "12px" }}>
                        <Col span={24}>
                          <p style={{ color: "red" }}>
                            Appointment has been rejected
                          </p>
                        </Col>
                      </Row>
                    )}
                  </div>
                </Col>
              ))
            ) : (
              <>
                <Col span={24}>
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/022/919/630/original/search-no-result-data-document-file-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                    style={{
                      margin: "auto",
                      display: "block",
                      height: "300px",
                      width: "300px",
                    }}
                    alt="No appointments found"
                  />
                </Col>
                <Col span={24} style={{ marginTop: "-30px", fontSize: "18px" }}>
                  <p style={{ textAlign: "center" }}>
                    No current appointment found.
                  </p>
                </Col>
              </>
            )}
          </>
        ) : isAdmin ? (
          <Row gutter={10} style={{ marginBottom: "10px", marginTop: "-20px" }}>
            <Col
              span={8}
              xs={24}
              sm={24}
              lg={8}
              style={{ marginBottom: "10px", marginTop: "-5px" }}
            >
              <div
                className="card p-2"
                style={{
                  background: "linear-gradient(to right, #005555, #f0f0f0)",
                }}
              >
                <h1 className="card-title1" style={{ color: "white" }}>
                  Doctors
                </h1>
                <hr style={{ marginTop: "0px", marginBottom: "5px" }} />
                <Row align="middle">
                  <Col span={12}>
                    <img
                      src="https://svgsilh.com/svg_v2/296571.svg"
                      style={{ height: "100px", width: "100px" }}
                      alt="Doctor Icon"
                    />
                  </Col>
                  <Col span={12}>
                    <h2 style={{ margin: 0 }}>Total: {doctors.length}</h2>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col
              span={8}
              xs={24}
              sm={24}
              lg={8}
              style={{ marginBottom: "10px", marginTop: "-5px" }}
            >
              <div
                className="card p-2"
                style={{
                  background: "linear-gradient(to right, #005555, #f0f0f0)",
                }}
              >
                <h1 className="card-title1" style={{ color: "white" }}>
                  Patients
                </h1>
                <hr style={{ marginTop: "0px", marginBottom: "5px" }} />
                <Row align="middle">
                  <Col span={12}>
                    <img
                      src="../../patiet.png"
                      style={{ height: "100px", width: "100px" }}
                      alt="patiet Icon"
                    />
                  </Col>
                  <Col span={12}>
                    <h2 style={{ margin: 0 }}>Total: {totalPatients.length}</h2>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col
              span={8}
              xs={24}
              sm={24}
              lg={8}
              style={{ marginBottom: "10px", marginTop: "-5px" }}
            >
              <div
                className="card p-2"
                style={{
                  background: "linear-gradient(to right, #005555, #f0f0f0)",
                }}
              >
                <h1 className="card-title1" style={{ color: "white" }}>
                  Appointments
                </h1>
                <hr style={{ marginTop: "0px", marginBottom: "5px" }} />
                <Row align="middle">
                  <Col span={12}>
                    <img
                      src="../../appointment.png"
                      style={{ height: "100px", width: "100px" }}
                    />
                  </Col>
                  <Col span={12}>
                    <h2 style={{ margin: 0 }}>
                      Total: {adminAppointments.length}
                    </h2>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={24} style={{ marginBottom: "10px" }}>
              <h1 className="page-title">Today's Appointments</h1>
            </Col>
            <Col span={24}>
              {" "}
              <Table
                columns={columns}
                dataSource={filteredAppointmentsAdmin}
                pagination={{ pageSize: 4 }}
              />
            </Col>
          </Row>
        ) : (
          <>
            <div
              style={{
                maxHeight: "99vh",
                overflowY: "scroll",
                marginTop: "-20px",
                scrollbarWidth: "none",
              }}
            >
              <Row gutter={10} style={{ marginBottom: "10px" }}>
                {doctors.map((doctor) => (
                  <Col
                    span={8}
                    xs={24}
                    sm={24}
                    lg={8}
                    style={{ marginBottom: "10px" }}
                    key={doctor.id}
                  >
                    {" "}
                    <Doctor doctor={doctor} />
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}
      </Row>
    </Layout>
  );
};

export default Home;
