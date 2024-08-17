import React from "react";
import { Button, Form, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { environment } from "../environment/environment";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        environment.apiUrl + "/api/user/login",
        values
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        localStorage.setItem("isAdmin",response.data.myuser.isAdmin)
        localStorage.setItem("isDoctor",response.data.myuser.isDoctor)
        localStorage.setItem("USERID",response.data.myuser._id)
        console.log("myUser",response.data)
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong ");
    }
  };
  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title ">Welcome Back</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input placeholder="Enter your password" type="password" />
          </Form.Item>

          <Button className="primary-button my-3" htmlType="submit">
            LOGIN
          </Button>

          <Link to="/register" className="anchor">
            Don't have an account? Register
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Login;
