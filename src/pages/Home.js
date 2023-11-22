import { useEffect, useState } from "react";
import Login from "./Login";
import axios from "axios";
import { environment } from "../environment/environment";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import Doctor from "../components/Doctor";
import { Col, Row } from "antd";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
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

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Layout>
      <Row gutter={20}>
        {doctors.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default Home;
