import Layout from "../../components/Layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import toast from "react-hot-toast";
import { environment } from "../../environment/environment";
import DoctorForm from "../../components/DoctorForm";
import moment from "moment";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  console.log("doctor data", doctor);
  const onFinish = async (values) => {
    const formattedTimings = [
      moment(values.timings[0]).format("HH:mm"),
      moment(values.timings[1]).format("HH:mm"),
    ];
    console.log("formattedTimings",formattedTimings)

    console.log("values",values)
    try {
      dispatch(showLoading());
      const response = await axios.post(
        environment.apiUrl + "/api/doctor/update-doctor-profile",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format('HH:mm'),
            moment(values.timings[1]).format('HH:mm'),
          ],
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
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        environment.apiUrl + "/api/doctor/get-doctor-info-by-user-id",
        { userId: params.userId },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      } else {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      navigate("/login");
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">Doctor's Profile</h1>
      <hr />
      {doctor && <DoctorForm onFinish={onFinish} doctorData={doctor} />}
    </Layout>
  );
};

export default Profile;
