import React, { useEffect } from "react";
import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import moment from "moment";

const DoctorForm = ({ onFinish, doctorData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (doctorData && doctorData.timings) {
      form.setFieldsValue({
        timings: [
          moment(doctorData.timings[0], "HH:mm"),
          moment(doctorData.timings[1], "HH:mm"),
        ],
      });
    }
  }, [doctorData, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...doctorData,
        timings: doctorData && doctorData.timings
          ? [
              moment(doctorData.timings[0], "HH:mm"),
              moment(doctorData.timings[1], "HH:mm"),
            ]
          : [],
      }}
    >
      <h1 className="card-title1 mt-3">Personal Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter your address" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Website"
            name="website"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter your website" />
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <h1 className="card-title1 mt-3">Professional Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Specialization" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Experience"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Experience" type="number" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Fee Per Consultation"
            name="feePerCunsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Fee Per Consultation" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Timings"
            name="timings"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="d-flex justify-content-end">
            <Button
              className="primary-button-applydoctor"
              htmlType="submit"
              style={{ marginTop: "-5px" }}
            >
              APPLY
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default DoctorForm;
