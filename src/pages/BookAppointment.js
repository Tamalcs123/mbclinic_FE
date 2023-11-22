import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import toast from "react-hot-toast";
import { environment } from "../environment/environment";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import moment from "moment";

const BookAppointment = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        environment.apiUrl + "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const checkAvilability = async () => {
    try {
      dispatch(showLoading());
      const formattedDate = date.format("DD-MM-YYYY");
      const formattedTime = time ? time.format("HH:mm") : null;
      if (!formattedTime) {
        toast.error("Please select a valid time.");
        dispatch(hideLoading());
        return;
      }
      const [startTime, endTime] = doctor.timings.map((time) =>
        moment(time, "HH:mm").format("HH:mm")
      );

      if (
        moment(formattedTime, "HH:mm").isBefore(moment(startTime, "HH:mm")) ||
        moment(formattedTime, "HH:mm").isAfter(moment(endTime, "HH:mm"))
      ) {
        toast.error("Selected time is outside the available time range.");
        dispatch(hideLoading());
        return;
      }
      const response = await axios.post(
        environment.apiUrl + "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: formattedDate,
          time: formattedTime,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error Booking appointment, try again");
      console.log(error);
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const formattedDate = date.format("DD-MM-YYYY");
      const formattedTime = time ? time.format("HH:mm") : null;
      if (!formattedTime) {
        toast.error("Please select a valid time.");
        dispatch(hideLoading());
        return;
      }
      const response = await axios.post(
        environment.apiUrl + "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: formattedDate,
          time: formattedTime,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/appointments");
      }
    } catch (error) {
      toast.error("Error Booking appointment");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">
            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg"
                width="100%"
                height="350"
              />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings : </b>
                {doctor.timings[0]}-{doctor.timings[1]}
              </h1>
              <p>
                <b>Mobile Number : </b>
                {doctor.phoneNumber}
              </p>
              <p>
                <b>Address : </b>
                {doctor.address}
              </p>
              <p>
                <b> Fee per Visit : </b>
                {doctor.feePerCunsultation}
              </p>
              <p>
                <b> Website : </b>
                {doctor.website}
              </p>
              <div className="d-flex flex-column pt-2 mt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setDate(value);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(value);
                  }}
                />
                <Button
                  className="primary-button mt-3"
                  onClick={checkAvilability}
                >
                  Check Availability
                </Button>
                {isAvailable && (
                  <Button className="primary-button mt-3" onClick={bookNow}>
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
};

export default BookAppointment;
